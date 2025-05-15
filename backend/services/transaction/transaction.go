package transactionService

import (
	"database/sql"
	"fmt"
	"main/types"
)

// InsertTransaction inserts a slice of transactions into the database.
//
// Parameters:
//   - db: A pointer to the database connection.
//   - items: A slice of Transaction structs to insert.
//
// Returns:
//   - error: An error if the insertion fails, nil otherwise.
func InsertTransaction(db *sql.DB, items []types.Transaction, bancId int) error {

	stmt, err := db.Prepare("INSERT INTO transactions(id,banc_id,date,value,desc,type) values(?,?,?,?,?,?)")
	if err != nil {
		return err
	}

	for _, item := range items {
		_, err = stmt.Exec(item.Id, bancId, item.Date, item.Value, item.Desc, item.Type)
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
func GetTransactions(database *sql.DB, perPage, currentPage int) ([]types.Transaction, int, error) {

	var items []types.Transaction
	var totalItems int

	// TRANSACTION
	offset := perPage * (currentPage - 1)
	query := fmt.Sprintf("SELECT * FROM transactions LIMIT %v OFFSET %v", perPage, offset)

	rows, err := database.Query(query)
	if err != nil {
		return nil, 0, err
	}

	if err := rows.Err(); err != nil {
		return nil, 0, err
	}

	for rows.Next() {
		var item types.Transaction
		if err := rows.Scan(&item.Id, &item.BancId, &item.Date, &item.Value, &item.Type, &item.Desc); err != nil {
			return nil, 0, err
		}
		items = append(items, item)
	}
	defer rows.Close()

	// TOTALITEMS
	total, err := database.Query("SELECT count(id) as totalItems FROM transactions")
	if err := total.Err(); err != nil {
		return nil, 0, err
	}

	for total.Next() {
		total.Scan(&totalItems)
	}

	defer total.Close()

	return items, totalItems, nil

}
