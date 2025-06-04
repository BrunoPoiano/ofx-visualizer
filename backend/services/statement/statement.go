package StatementService

import (
	"database/sql"
	"fmt"
	BalanceService "main/services/balance"
	"main/services/utils"
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
func GetItems(database *sql.DB, filter types.StatementSearch, bankId int64) ([]types.Statement, int, int, error) {

	offset := filter.PerPage * (filter.CurrentPage - 1)
	query := makeQuery("*", filter)
	query = fmt.Sprintf("%s ORDER BY %s %s", query, filter.Order, filter.Direction)
	query = fmt.Sprintf("%s LIMIT %v OFFSET %v", query, filter.PerPage, offset)

	defaultSearch := types.DefaultSearch{
		PerPage:     100,
		CurrentPage: 1,
		Order:       "id",
		Direction:   "ASC",
	}

	items, err := utils.MakeQueryCall(database, query, func(rows *sql.Rows) ([]types.Statement, error) {
		var s []types.Statement
		for rows.Next() {
			var item types.Statement
			if err := rows.Scan(&item.Id, &item.BankId, &item.StartDate, &item.EndDate, &item.LedgerBalance, &item.BalanceDate, &item.ServerDate, &item.Language); err != nil {
				return nil, err
			}

			balances, _, _, _ := BalanceService.GetItems(database, defaultSearch, int64(item.Id))
			item.Yields = balances
			s = append(s, item)
		}
		return s, rows.Err()
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

// GetInfo retrieves the largest and latest Statement items for a given bank ID.
//
// Parameters:
//   - database: A pointer to the database connection.
//   - bankId: The ID of the bank to retrieve statements for.
//
// Returns:
//   - The largest Statement item.
//   - The latest Statement item.
//   - An error if the retrieval fails, nil otherwise.
func GetInfo(database *sql.DB, bankId int64) (types.Statement, types.Statement, error) {

	var largestBalance, currentBalance types.Statement

	scanStatement := func(rows *sql.Rows) (types.Statement, error) {
		var s types.Statement
		for rows.Next() {
			err := rows.Scan(
				&s.Id,
				&s.BankId,
				&s.StartDate,
				&s.EndDate,
				&s.LedgerBalance,
				&s.BalanceDate,
				&s.ServerDate,
				&s.Language,
			)
			if err != nil {
				return s, err
			}
		}
		return s, rows.Err()
	}

	largestBalanceQuery := fmt.Sprintf("SELECT id, bank_id, start_date, end_date, ledger_balance, balance_date, server_date, language FROM statements WHERE bank_id = %v ORDER BY ledger_balance DESC LIMIT 1", bankId)
	largestBalance, err := utils.MakeQueryCall(database, largestBalanceQuery, scanStatement)
	if err != nil {
		return largestBalance, currentBalance, err
	}

	currentBalanceQuery := fmt.Sprintf("SELECT id, bank_id, start_date, end_date, ledger_balance, balance_date, server_date, language FROM statements WHERE bank_id = %v ORDER BY balance_date DESC LIMIT 1", bankId)
	currentBalance, err = utils.MakeQueryCall(database, currentBalanceQuery, scanStatement)
	if err != nil {
		return largestBalance, currentBalance, err
	}

	return largestBalance, currentBalance, nil
}

// makeQuery generates a SQL query based on the provided filter criteria.
//
// Parameters:
//   - s: The SELECT clause of the query.
//   - filter: A StatementSearch struct containing filter criteria.
//
// Returns:
//   - A string containing the generated SQL query.
func makeQuery(s string, filter types.StatementSearch) string {

	query := fmt.Sprintf("SELECT %s FROM statements", s)

	where := []string{}

	if filter.MaxValue != "" {
		where = append(where, fmt.Sprintf("ledger_balance < '%s'", filter.MaxValue))
	}

	if filter.MinValue != "" {
		where = append(where, fmt.Sprintf("ledger_balance > '%s'", filter.MinValue))
	}

	if filter.From != "" {
		if filter.To == "" {
			where = append(where, fmt.Sprintf("start_date >= '%s 00:00:00'", filter.From))
			where = append(where, fmt.Sprintf("start_date <= '%s 23:59:59'", filter.From))
		} else {
			where = append(where, fmt.Sprintf("start_date >= '%s 00:00:00'", filter.From))
		}
	}

	if filter.To != "" {
		where = append(where, fmt.Sprintf("end_date <= '%s 23:59:59'", filter.To))
	}

	// if filter.Search != "" {
	// 	where = append(where, fmt.Sprintf("desc LIKE '%%%s%%'", filter.Search))
	// }

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
