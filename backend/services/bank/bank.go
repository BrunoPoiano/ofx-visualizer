package BankService

import (
	"database/sql"
	"fmt"
	"main/types"
)

// InsertItems inserts a Bank item into the database.
//
// Parameters:
//   - database: A pointer to the database connection.
//   - item: The Bank item to insert.
//
// Returns:
//   - An error if the insertion fails, nil otherwise.
func InsertItems(database *sql.DB, item types.Bank) (int, error) {

	var account_id int
	total, err := database.Query("SELECT id FROM banks WHERE account_id = ?", item.AccountId)
	if err != nil {
		return 0, err
	}
	defer total.Close()

	if err := total.Err(); err != nil {
		return 0, err
	}
	for total.Next() {
		total.Scan(&account_id)
	}

	if account_id != 0 {
		return account_id, nil
	}

	stmt, err := database.Prepare("INSERT INTO banks(name,account_id,account_type,f_id,bank_id,branch_id) values(?,?,?,?,?,?)")
	if err != nil {
		return 0, err
	}

	result, err := stmt.Exec(item.Name, item.AccountId, item.AccountType, item.FId, item.BankId, item.BranchId)
	if err != nil {
		return 0, err
	}

	id, err := result.LastInsertId()
	if err != nil {
		return 0, err
	}

	return int(id), nil
}

// GetItems retrieves a paginated list of Bank items from the database.
//
// Parameters:
//   - database: A pointer to the database connection.
//   - perPage: The number of items to retrieve per page.
//   - currentPage: The current page number.
//
// Returns:
//   - A slice of Bank items.
//   - The total number of items in the database.
//   - An error if the retrieval fails, nil otherwise.
func GetItems(database *sql.DB, perPage, currentPage int) ([]types.Bank, int, error) {

	var items []types.Bank
	var totalItems int

	//BANCS
	offset := perPage * (currentPage - 1)
	query := fmt.Sprintf("SELECT * FROM banks LIMIT %v OFFSET %v", perPage, offset)

	rows, err := database.Query(query)
	if err != nil {
		return nil, 0, err
	}

	if err := rows.Err(); err != nil {
		return nil, 0, err
	}

	for rows.Next() {
		var item types.Bank
		if err := rows.Scan(&item.Id, &item.Name, &item.AccountId, &item.AccountType, &item.FId, &item.BankId, &item.BranchId); err != nil {
			return nil, 0, err
		}
		items = append(items, item)
	}

	defer rows.Close()

	// TOTALITEMS
	total, err := database.Query("SELECT count(id) as totalItems FROM banks")
	if err := total.Err(); err != nil {
		return nil, 0, err
	}

	for total.Next() {
		total.Scan(&totalItems)
	}

	defer total.Close()

	return items, totalItems, nil

}
