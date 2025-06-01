package StatementService

import (
	"database/sql"
	"fmt"
	BalanceService "main/services/balance"
	"main/types"
	"math"
)

// InsertItems inserts a Statement item into the database.
//
// Parameters:
//   - database: A pointer to the database connection.
//   - item: The Statement item to insert.
//
// Returns:
//   - An error if the insertion fails, nil otherwise.
func InsertItems(database *sql.DB, item types.Statement, BankId int) (int, error) {

	var account_id int
	total, err := database.Query("SELECT id FROM statements WHERE start_date = ? AND end_date = ? AND ledger_balance = ?", item.StartDate, item.EndDate, item.LedgerBalance)
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

	stmt, err := database.Prepare("INSERT INTO statements(bank_id,start_date,end_date,ledger_balance,balance_date,server_date,language) values(?,?,?,?,?,?,?)")
	if err != nil {
		return 0, err
	}

	result, err := stmt.Exec(BankId, item.StartDate, item.EndDate, item.LedgerBalance, item.BalanceDate, item.ServerDate, item.Language)
	if err != nil {
		return 0, err
	}

	id, err := result.LastInsertId()
	if err != nil {
		return 0, err
	}

	return int(id), nil
}

// GetItems retrieves a paginated list of Statement items from the database.
//
// Parameters:
//   - database: A pointer to the database connection.
//   - perPage: The number of items to retrieve per page.
//   - currentPage: The current page number.
//
// Returns:
//   - A slice of Statement items.
//   - The total number of items in the database.
//   - An error if the retrieval fails, nil otherwise.
func GetItems(database *sql.DB, filter types.DefaultSearch, bankId int64) ([]types.Statement, int, int, error) {

	var items []types.Statement
	var totalItems int

	offset := filter.PerPage * (filter.CurrentPage - 1)

	query := fmt.Sprintf("SELECT * FROM statements")

	if bankId > 0 {
		query = fmt.Sprintf("%s WHERE bank_id = '%v'", query, bankId)
	}

	query = fmt.Sprintf("%s ORDER BY %s %s", query, filter.Order, filter.Direction)
	query = fmt.Sprintf("%s LIMIT %v OFFSET %v", query, filter.PerPage, offset)

	rows, err := database.Query(query)
	if err != nil {
		return nil, 0, 0, err
	}

	if err := rows.Err(); err != nil {
		return nil, 0, 0, err
	}

	defaultSearch := types.DefaultSearch{
		PerPage:     100,
		CurrentPage: 1,
		Order:       "id",
		Direction:   "ASC",
	}

	for rows.Next() {
		var item types.Statement
		if err := rows.Scan(&item.Id, &item.BankId, &item.StartDate, &item.EndDate, &item.LedgerBalance, &item.BalanceDate, &item.ServerDate, &item.Language); err != nil {
			return nil, 0, 0, err
		}

		balances, _, _, _ := BalanceService.GetItems(database, defaultSearch, int64(item.Id))
		item.Yields = balances

		items = append(items, item)
	}

	defer rows.Close()

	// TOTALITEMS
	total, err := database.Query("SELECT count(id) as totalItems FROM statements")
	if err := total.Err(); err != nil {
		return nil, 0, 0, err
	}

	for total.Next() {
		total.Scan(&totalItems)
	}

	defer total.Close()

	last_page := math.Ceil(float64(totalItems) / float64(filter.PerPage))

	return items, totalItems, int(last_page), nil

}
