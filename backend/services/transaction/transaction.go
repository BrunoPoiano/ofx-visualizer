package transactionService

import (
	"database/sql"
	"fmt"
	"main/types"
	"math"
)

// InsertTransaction inserts a slice of transactions into the database.
//
// Parameters:
//   - db: A pointer to the database connection.
//   - items: A slice of Transaction structs to insert.
//
// Returns:
//   - error: An error if the insertion fails, nil otherwise.
func InsertTransaction(db *sql.DB, items []types.Transaction, BankId int) error {

	stmt, err := db.Prepare("INSERT INTO transactions(id,Bank_id,date,value,desc,type) values(?,?,?,?,?,?)")
	if err != nil {
		return err
	}

	for _, item := range items {
		_, err = stmt.Exec(item.Id, BankId, item.Date, item.Value, item.Desc, item.Type)
	}

	return nil

}

// GetTransactions retrieves transactions from the database with pagination.
//
// Parameters:
//   - database: A pointer to the database connection.
//   - perPage: The number of transactions to retrieve per page.
//   - currentPage: The current page number.
//
// Returns:
//   - []types.Transaction: A slice of Transaction structs representing the transactions on the current page.
//   - int: The total number of transactions in the database.
//   - error: An error if the retrieval fails, nil otherwise.
func GetTransactions(database *sql.DB, filter types.TransactionSearch) ([]types.Transaction, int, int, error) {

	var items []types.Transaction
	var totalItems int

	// TRANSACTION
	offset := filter.PerPage * (filter.CurrentPage - 1)
	query := makeQuery("*", filter)
	query = fmt.Sprintf("%s ORDER BY %s %s", query, filter.Order, filter.Direction)
	query = fmt.Sprintf("%s LIMIT %v OFFSET %v", query, filter.PerPage, offset)

	println(makeQuery("*", filter))

	rows, err := database.Query(query)
	if err != nil {
		return nil, 0, 0, err
	}
	defer rows.Close()

	if err := rows.Err(); err != nil {
		return nil, 0, 0, err
	}

	for rows.Next() {
		var item types.Transaction
		if err := rows.Scan(&item.Id, &item.BankId, &item.Date, &item.Value, &item.Type, &item.Desc); err != nil {
			return nil, 0, 0, err
		}
		items = append(items, item)
	}

	// TOTALITEMS
	query = makeQuery("count(id) as totalItems", filter)
	total, err := database.Query(query)
	if err != nil {
		return nil, 0, 0, err
	}
	defer total.Close()

	if err := total.Err(); err != nil {
		return nil, 0, 0, err
	}
	for total.Next() {
		total.Scan(&totalItems)
	}

	last_page := math.Ceil(float64(totalItems) / float64(filter.PerPage))

	return items, totalItems, int(last_page), nil
}

func makeQuery(s string, filter types.TransactionSearch) string {

	query := fmt.Sprintf("SELECT %s FROM transactions", s)

	where := []string{}

	if filter.Type != "" {
		where = append(where, fmt.Sprintf("type = '%s'", filter.Type))
	}

	if filter.MaxValue != "" {
		where = append(where, fmt.Sprintf("value < '%s'", filter.MaxValue))
	}

	if filter.MinValue != "" {
		where = append(where, fmt.Sprintf("value > '%s'", filter.MinValue))
	}

	if filter.From != "" {
		where = append(where, fmt.Sprintf("date >= '%s 00:00:00'", filter.From))
	}

	if filter.To != "" {
		where = append(where, fmt.Sprintf("date <= '%s 23:59:59'", filter.To))
	}

	if filter.Search != "" {
		where = append(where, fmt.Sprintf("desc LIKE '%%%s%%'", filter.Search))
	}

	if filter.Bank != "" {
		where = append(where, fmt.Sprintf("bank_id = '%s'", filter.Bank))
	}

	if len(where) > 0 {
		query = fmt.Sprintf("%s WHERE %s", query, where[0])
		for i := 1; i < len(where); i++ {
			query = fmt.Sprintf("%s AND %s", query, where[i])
		}
	}

	return query
}
