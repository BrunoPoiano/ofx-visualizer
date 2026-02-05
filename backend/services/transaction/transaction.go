package transactionService

import (
	"context"
	"math"

	"main/services/utils"
	"main/types"

	"main/database/databaseSQL"
	databaseSqlc "main/database/databaseSQL"
)

// InsertTransaction inserts a slice of transactions into the database.
//
// Parameters:
//   - db: A pointer to the database connection.
//   - items: A slice of Transaction structs to insert.
//
// Returns:
//   - error: An error if the insertion fails, nil otherwise.
func InsertTransaction(ctx context.Context, items []databaseSqlc.CreateTransactionParams, sourceId int) error {
	queries := ctx.Value("queries").(*databaseSQL.Queries)

	for _, item := range items {
		countTransaction, err := queries.CheckTransaction(ctx, item.ID)
		if err != nil {
			return err
		}
		if countTransaction > 0 {
			return nil
		}

		item.SourceID = int64(sourceId)
		_, err = queries.CreateTransaction(ctx, item)
		if err != nil {
			return err
		}
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
//   - []databaseSqlc.Transaction: A slice of Transaction structs representing the transactions on the current page.
//   - int: The total number of transactions in the database.
//   - error: An error if the retrieval fails, nil otherwise.
func GetTransactions(ctx context.Context, filter types.TransactionSearch) ([]databaseSqlc.Transaction, int, int, error) {
	queries := ctx.Value("queries").(*databaseSQL.Queries)
	offset := filter.PerPage * (filter.CurrentPage - 1)

	items, err := queries.ListTransactions(ctx, databaseSqlc.ListTransactionsParams{
		Search:         filter.Search,
		SearchType:     filter.Type,
		SearchMaxValue: utils.CheckIfZero(filter.MaxValue),
		SearchMinValue: utils.CheckIfZero(filter.MinValue),
		SearchFrom:     utils.FixSearchDate(filter.From, true),
		SearchTo:       utils.FixSearchDate(filter.To, false),
		Offset:         offset,
		Limit:          filter.PerPage,
		SourceID:       filter.SourceId,
	})
	if err != nil {
		return nil, 0, 0, err
	}

	totalItems, err := queries.CountTransactions(ctx, databaseSqlc.CountTransactionsParams{
		Search:         filter.Search,
		SearchType:     filter.Type,
		SearchMaxValue: utils.CheckIfZero(filter.MaxValue),
		SearchMinValue: utils.CheckIfZero(filter.MinValue),
		SearchFrom:     utils.FixSearchDate(filter.From, true),
		SearchTo:       utils.FixSearchDate(filter.To, false),
		SourceID:       filter.SourceId,
	})
	if err != nil {
		return nil, 0, 0, err
	}

	last_page := math.Ceil(float64(totalItems) / float64(filter.PerPage))

	return items, int(totalItems), int(last_page), nil
}

// GetTransactionInfos retrieves sum of positive, negative and total transaction values from the database.
//
// Parameters:
//   - database: A pointer to the database connection.
//   - filter: A TransactionSearch struct containing filter criteria.
//
// Returns:
//   - float64: The sum of positive transaction values.
//   - float64: The sum of negative transaction values.
//   - float64: The sum of all transaction values.
//   - error: An error if the retrieval fails, nil otherwise.
func GetTransactionInfos(ctx context.Context, filter types.TransactionSearch) (float64, float64, float64, error) {
	queries := ctx.Value("queries").(*databaseSQL.Queries)

	values, err := queries.TransactionsInfo(ctx, databaseSqlc.TransactionsInfoParams{
		Value:    float64(filter.MaxValue),
		Value_2:  float64(filter.MaxValue),
		SourceID: filter.SourceId,
	})
	if err != nil {
		return 0, 0, 0, err
	}

	positive, err := utils.InterfaceToFloat(values.Positive)
	if err != nil {
		return 0, 0, 0, err
	}

	negative, err := utils.InterfaceToFloat(values.Negative)
	if err != nil {
		return 0, 0, 0, err
	}

	value, err := utils.InterfaceToFloat(values.Value)
	if err != nil {
		return 0, 0, 0, err
	}

	return positive, negative, value, nil
}

// DeleteTransaction deletes transactions from the database based on bankId.
//
// Parameters:
//   - database: A pointer to the database connection.
//   - bankId: The ID of the bank whose transactions are to be deleted.
//
// Returns:
//   - error: An error if the deletion fails, nil otherwise.
func DeleteTransaction(ctx context.Context, bankId string) error {
	queries := ctx.Value("queries").(*databaseSQL.Queries)

	return queries.DeleteTransaction(ctx, bankId)
}
