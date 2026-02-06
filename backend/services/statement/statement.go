package StatementService

import (
	"context"
	"math"

	"main/services/utils"
	"main/types"

	"main/database/databaseSQL"
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
func InsertItems(ctx context.Context, item databaseSqlc.StatementYields, SourceId int) (int, error) {
	queries := ctx.Value("queries").(*databaseSQL.Queries)

	accountId, err := queries.GetStatement(ctx, databaseSqlc.GetStatementParams{
		StartDate:     item.Statement.StartDate,
		EndDate:       item.Statement.EndDate,
		LedgerBalance: item.Statement.LedgerBalance,
	})
	if err != nil {

		stt, err := queries.CreateStatement(ctx, databaseSqlc.CreateStatementParams{
			SourceID:      int64(SourceId),
			StartDate:     item.Statement.StartDate,
			EndDate:       item.Statement.EndDate,
			LedgerBalance: item.Statement.LedgerBalance,
			BalanceDate:   item.Statement.BalanceDate,
			ServerDate:    item.Statement.ServerDate,
			Language:      item.Statement.Language,
		})
		if err != nil {
			return 0, err
		}

		return int(stt.ID), nil
	}

	if accountId > 0 {
		return int(accountId), nil
	}

	return 0, types.ErrorSavingStatement
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
func GetItems(ctx context.Context, filter types.StatementSearch) ([]databaseSQL.StatementYields, int, int, error) {
	queries := ctx.Value("queries").(*databaseSQL.Queries)

	offset := filter.PerPage * (filter.CurrentPage - 1)

	var statementYields []databaseSQL.StatementYields

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

	for _, statement := range statements {
		yields, err := queries.ListBalancesByStatementId(ctx, statement.ID)
		if err != nil {
			return nil, 0, 0, err
		}

		statementYields = append(statementYields, databaseSqlc.StatementYields{
			Statement: statement,
			Yields:    yields,
		})
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
	return statementYields, int(totalItems), int(last_page), nil
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
func GetInfo(ctx context.Context) (databaseSqlc.Statement, databaseSqlc.Statement, error) {
	queries := ctx.Value("queries").(*databaseSQL.Queries)
	sourceId := ctx.Value("sourceId").(int64)

	var largestBalance, currentBalance databaseSqlc.Statement

	largestBalance, err := queries.GetLargestBalanceQuery(ctx, sourceId)
	if err != nil {
		return largestBalance, currentBalance, err
	}

	currentBalance, err = queries.GetCurrentBalanceQuery(ctx, sourceId)
	if err != nil {
		return largestBalance, currentBalance, err
	}

	return largestBalance, currentBalance, nil
}
