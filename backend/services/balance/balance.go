package BalanceService

import (
	"database/sql"
	"fmt"
	"main/services/utils"
	"main/types"
	"math"
)

// InsertItems inserts a Bank item into the database.
//
// Parameters:
//   - database: A pointer to the database connection.
//   - item: The Bank item to insert.
//
// Returns:
//   - An error if the insertion fails, nil otherwise.
func InsertItems(database *sql.DB, item types.Balance, StatementId int) error {

	var account_id int
	total, err := database.Query("SELECT id FROM balances WHERE statement_id = ? AND name = ? AND value = ?", StatementId, item.Name, item.Value)
	if err != nil {
		return err
	}
	defer total.Close()

	if err := total.Err(); err != nil {
		return err
	}
	for total.Next() {
		total.Scan(&account_id)
	}

	if account_id != 0 {
		return nil
	}

	stmt, err := database.Prepare("INSERT INTO balances(statement_id,name,description,balance_type,value) values(?,?,?,?,?)")
	if err != nil {
		return err
	}

	_, err = stmt.Exec(StatementId, item.Name, item.Desc, item.BalType, item.Value)
	if err != nil {
		return err
	}

	return nil
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
func GetItems(database *sql.DB, filter types.DefaultSearch, statementId int64) ([]types.Balance, int, int, error) {

	offset := filter.PerPage * (filter.CurrentPage - 1)

	query := fmt.Sprintf("SELECT * FROM balances")
	if statementId > 0 {
		query = fmt.Sprintf("%s WHERE statement_id = '%v'", query, statementId)
	}
	query = fmt.Sprintf("%s ORDER BY %s %s", query, filter.Order, filter.Direction)
	query = fmt.Sprintf("%s LIMIT %v OFFSET %v", query, filter.PerPage, offset)

	items, err := utils.MakeQueryCall(database, query, func(rows *sql.Rows) ([]types.Balance, error) {
		var s []types.Balance
		for rows.Next() {
			var item types.Balance
			if err := rows.Scan(&item.Id, &item.StatementId, &item.Name, &item.Desc, &item.BalType, &item.Value); err != nil {
				return nil, err
			}
			s = append(s, item)
		}
		return s, nil
	})
	if err != nil {
		return nil, 0, 0, err
	}

	totalQuery := "SELECT count(id) as totalItems FROM balances"
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
