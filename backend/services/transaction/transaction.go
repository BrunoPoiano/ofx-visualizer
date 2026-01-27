package transactionService

import (
	"context"
	"math"

	"main/services/utils"
	"main/types"

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
func InsertTransaction(queries *databaseSqlc.Queries, ctx context.Context, items []databaseSqlc.CreateTransactionParams) error {
	for _, item := range items {
		_, err := queries.CreateTransaction(ctx, item)
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
func GetTransactions(queries *databaseSqlc.Queries, ctx context.Context, filter types.TransactionSearch) ([]databaseSqlc.Transaction, int, int, error) {
	offset := filter.PerPage * (filter.CurrentPage - 1)

	items, err := queries.ListTransactions(ctx, databaseSqlc.ListTransactionsParams{
		Search: filter.Search,
		Offset: offset,
		Limit:  filter.PerPage,
	})
	if err != nil {
		return nil, 0, 0, err
	}

	totalItems, err := queries.CountTransactions(ctx, filter.Search)
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
func GetTransactionInfos(queries *databaseSqlc.Queries, ctx context.Context, filter types.TransactionSearch) (float64, float64, float64, error) {
	values, err := queries.TransactionInfo(ctx, databaseSqlc.TransactionInfoParams{
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
func DeleteTransaction(queries *databaseSqlc.Queries, ctx context.Context, bankId int64) error {
	return queries.DeleteTransaction(ctx, bankId)
}
