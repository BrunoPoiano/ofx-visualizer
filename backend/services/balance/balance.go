package BalanceService

import (
	"context"
	"database/sql"
	"math"

	"main/database/databaseSQL"
	databaseSqlc "main/database/databaseSQL"
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
func InsertItems(ctx context.Context, item databaseSqlc.CreateBalanceParams, StatementId int) error {
	queries := ctx.Value("queries").(*databaseSQL.Queries)
	item.StatementID = int64(StatementId)

	account_id, err := queries.FindBalance(ctx, databaseSqlc.FindBalanceParams{
		Name:        item.Name,
		Value:       item.Value,
		StatementID: item.StatementID,
	})

	if account_id > 0 {
		return nil
	}

	_, err = queries.CreateBalance(ctx, item)

	return err
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
func GetItems(ctx context.Context, filter types.DefaultSearch, statementId int64) ([]databaseSqlc.Balance, int, int, error) {
	queries := ctx.Value("queries").(*databaseSQL.Queries)

	offset := filter.PerPage * (filter.CurrentPage - 1)

	balances, err := queries.ListBalances(ctx, databaseSqlc.ListBalancesParams{
		Search: filter.Search,
		Limit:  filter.PerPage,
		Offset: offset,
		StatementID: sql.NullInt64{
			Int64: int64(statementId),
		},
	})
	if err != nil {
		return nil, 0, 0, err
	}

	count, err := queries.CountBalances(ctx, databaseSqlc.CountBalancesParams{
		Search: filter.Search,
		StatementID: sql.NullInt64{
			Int64: int64(statementId),
		},
	})

	last_page := math.Ceil(float64(count) / float64(filter.PerPage))

	return balances, int(count), int(last_page), nil
}
