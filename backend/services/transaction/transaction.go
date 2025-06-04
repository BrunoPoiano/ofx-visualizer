package transactionService

import (
	"database/sql"
	"fmt"
	"main/services/utils"
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

	// TRANSACTION
	offset := filter.PerPage * (filter.CurrentPage - 1)
	query := makeQuery("*", filter)
	query = fmt.Sprintf("%s ORDER BY %s %s", query, filter.Order, filter.Direction)
	query = fmt.Sprintf("%s LIMIT %v OFFSET %v", query, filter.PerPage, offset)

	items, err := utils.MakeQueryCall(database, query, func(rows *sql.Rows) ([]types.Transaction, error) {
		var s []types.Transaction
		for rows.Next() {
			var item types.Transaction
			if err := rows.Scan(&item.Id, &item.BankId, &item.Date, &item.Value, &item.Type, &item.Desc); err != nil {
				return nil, err
			}
			s = append(s, item)
		}
		return s, nil
	})
	if err != nil {
		return nil, 0, 0, err
	}

	totalQuery := makeQuery("count(id) as totalItems", filter)
	totalItems, err := utils.MakeQueryCall(database, totalQuery, func(rows *sql.Rows) (int, error) {
		var s int
		for rows.Next() {
			rows.Scan(&s)
		}
		return s, nil
	})
	if err != nil {
		return nil, 0, 0, err
	}

	last_page := math.Ceil(float64(totalItems) / float64(filter.PerPage))

	return items, totalItems, int(last_page), nil
}

// GetTransactionInfos retrieves sum of positive, negative and total transaction values from the database.
//
// Parameters:
//   - database: A pointer to the database connection.
//   - filter: A TransactionSearch struct containing filter criteria.
//
// Returns:
//   - float64: The sum of positive transaction values.
//   - float64: The sum of negative transaction values.
//   - float64: The sum of all transaction values.
//   - error: An error if the retrieval fails, nil otherwise.
func GetTransactionInfos(database *sql.DB, filter types.TransactionSearch) (float64, float64, float64, error) {

	var positive, negative, value float64

	queryFilter := makeQuery("SUM(value)", filter)
	positiveQuery := fmt.Sprintf("%s AND value > 0", queryFilter)
	negativeQuery := fmt.Sprintf("%s AND value < 0", queryFilter)
	valueQuery := queryFilter

	query := fmt.Sprintf("SELECT (%s) as positive, (%s) as negative, (%s) as value from transactions LIMIT 1", positiveQuery, negativeQuery, valueQuery)
	println(query)
	_, err := utils.MakeQueryCall(database, query, func(rows *sql.Rows) (int, error) {
		for rows.Next() {
			rows.Scan(&positive, &negative, &value)
		}
		return 0, nil
	})
	if err != nil {
		return 0, 0, 0, err
	}

	return positive, negative, value, nil
}

// DeleteTransaction deletes transactions from the database based on bankId.
//
// Parameters:
//   - database: A pointer to the database connection.
//   - bankId: The ID of the bank whose transactions are to be deleted.
//
// Returns:
//   - error: An error if the deletion fails, nil otherwise.
func DeleteTransaction(database *sql.DB, bankId int64) error {

	query := fmt.Sprintf("DELETE FROM transactions WHERE bank_id = '%v'", bankId)
	_, err := database.Exec(query)
	if err != nil {
		return err
	}

	return nil
}

// makeQuery constructs a SQL query based on the provided filter criteria.
//
// Parameters:
//   - s: The SELECT clause of the query.
//   - filter: A TransactionSearch struct containing filter criteria.
//
// Returns:
//   - string: The constructed SQL query string.
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
		if filter.To == "" {
			where = append(where, fmt.Sprintf("date >= '%s 00:00:00'", filter.From))
			where = append(where, fmt.Sprintf("date <= '%s 23:59:59'", filter.From))
		} else {
			where = append(where, fmt.Sprintf("date >= '%s 00:00:00'", filter.From))
		}
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
