package StatementService

import (
	"context"
	"fmt"
	"math"

	"main/services/utils"
	"main/types"

	databaseSqlc "main/database/databaseSQL"
)

// InsertItems inserts a Statement item into the database if it doesn't already exist.
//
// Parameters:
//   - queries: A pointer to the database queries.
//   - ctx: The context for the database operation.
//   - item: The Statement item parameters to check or insert.
//   - SourceId: The ID of the source associated with the statement.
//
// Returns:
//   - The ID of the statement.
//   - An error if the operation fails, nil otherwise.
func InsertItems(queries *databaseSqlc.Queries, ctx context.Context, item databaseSqlc.StatementYields, SourceId int) (int, error) {
	accountId, err := queries.GetStatement(ctx, databaseSqlc.GetStatementParams{
		StartDate:     item.Statement.StartDate,
		EndDate:       item.Statement.EndDate,
		LedgerBalance: item.Statement.LedgerBalance,
	})
	if err != nil {

		item.Statement.SourceID = int64(SourceId)
		stt, err := queries.CreateStatement(ctx, item.Statement)
		if err != nil {
			return 0, err
		}

		return int(stt.ID), nil
	}

	if accountId > 0 {
		return int(accountId), nil
	}

	return 0, fmt.Errorf("Error saving statement")
}

// GetItems retrieves a paginated list of Statement items based on search filters.
//
// Parameters:
//   - queries: A pointer to the database queries.
//   - ctx: The context for the database operation.
//   - filter: The search, sorting, and pagination criteria.
//
// Returns:
//   - A slice of Statement items.
//   - The total number of items found.
//   - The total number of pages based on the per-page limit.
//   - An error if the retrieval fails, nil otherwise.
func GetItems(queries *databaseSqlc.Queries, ctx context.Context, filter types.StatementSearch) ([]databaseSqlc.Statement, int, int, error) {
	offset := filter.PerPage * (filter.CurrentPage - 1)

	statements, err := queries.ListStatements(ctx, databaseSqlc.ListStatementsParams{
		Search:         filter.Search,
		Offset:         offset,
		Limit:          filter.PerPage,
		SearchMaxValue: utils.CheckIfZero(filter.MaxValue),
		SearchMinValue: utils.CheckIfZero(filter.MinValue),
		SearchFrom:     utils.FixSearchDate(filter.From, true),
		SearchTo:       utils.FixSearchDate(filter.To, false),
		SourceID:       filter.SourceId,
	})
	if err != nil {
		return nil, 0, 0, err
	}

	totalItems, err := queries.CountStatements(ctx, databaseSqlc.CountStatementsParams{
		Search:         filter.Search,
		SearchMaxValue: utils.CheckIfZero(filter.MaxValue),
		SearchMinValue: utils.CheckIfZero(filter.MinValue),
		SearchFrom:     utils.FixSearchDate(filter.From, true),
		SearchTo:       utils.FixSearchDate(filter.To, false),
		SourceID:       filter.SourceId,
	})

	last_page := math.Ceil(float64(totalItems) / float64(filter.PerPage))
	return statements, int(totalItems), int(last_page), nil
}

// GetInfo retrieves the largest and latest Statement items for a given bank ID.
//
// Parameters:
//   - queries: A pointer to the database queries.
//   - ctx: The context for the database operation.
//   - bankId: The ID of the bank to retrieve statements for.
//
// Returns:
//   - The Statement item with the largest balance.
//   - The Statement item with the most recent balance.
//   - An error if the retrieval fails, nil otherwise.
func GetInfo(queries *databaseSqlc.Queries, ctx context.Context, bankId int64) (databaseSqlc.Statement, databaseSqlc.Statement, error) {
	var largestBalance, currentBalance databaseSqlc.Statement

	largestBalance, err := queries.GetLargestBalanceQuery(ctx, bankId)
	if err != nil {
		return largestBalance, currentBalance, err
	}

	currentBalance, err = queries.GetCurrentBalanceQuery(ctx, bankId)
	if err != nil {
		return largestBalance, currentBalance, err
	}

	return largestBalance, currentBalance, nil
}
