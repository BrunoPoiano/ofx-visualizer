package BankService

import (
	"database/sql"
	"fmt"
	"main/services/utils"
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

	offset := perPage * (currentPage - 1)
	query := fmt.Sprintf("SELECT * FROM banks LIMIT %v OFFSET %v", perPage, offset)

	items, err := utils.MakeQueryCall(database, query, func(rows *sql.Rows) ([]types.Bank, error) {
		var s []types.Bank
		for rows.Next() {
			var item types.Bank
			err := rows.Scan(&item.Id, &item.Name, &item.AccountId, &item.AccountType, &item.FId, &item.BankId, &item.BranchId)
			if err != nil {
				return nil, err
			}
			s = append(s, item)
		}
		return s, rows.Err()
	})
	if err != nil {
		return nil, 0, err
	}

	totalQuery := "SELECT count(id) as totalItems FROM banks"
	totalItems, err := utils.MakeQueryCall(database, totalQuery, func(rows *sql.Rows) (int, error) {
		var s int
		for rows.Next() {
			rows.Scan(&s)
		}
		return s, nil
	})
	if err != nil {
		return nil, 0, err
	}

	return items, totalItems, nil
}
