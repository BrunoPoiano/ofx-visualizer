package BalanceService

import (
	"context"

	"main/database/databaseSQL"
	databaseSqlc "main/database/databaseSQL"
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
