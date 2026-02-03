package BankService

import (
	"context"
	"math"

	databaseSqlc "main/database/databaseSQL"
	"main/services/utils"
	"main/types"
)

// InsertItems checks if a Bank record exists for the given account and creates one if it doesn't.
//
// Parameters:
//   - queries: A pointer to the sqlc Queries instance.
//   - ctx: The context for the database operations.
//   - bank: The parameters required to create a new bank record.
//
// Returns:
//   - The ID of the bank (either existing or newly created).
//   - An error if any database operation or conversion fails.
func InsertItems(queries *databaseSqlc.Queries, ctx context.Context, bank databaseSqlc.CreateBankParams) (int, error) {
	bankAccId, err := queries.GetBankIdByAccountId(ctx, bank.AccountID)
	if err != nil {
		newBank, err := queries.CreateBank(ctx, bank)
		if err != nil {
			return 0, err
		}

		return int(newBank.ID), nil
	}

	account_id, err := utils.InterfaceToInt(bankAccId)
	if err != nil {
		return 0, err
	}

	if account_id > 0 {
		return account_id, nil
	}

	return 0, types.ErrorSavingBank
}

// GetItems retrieves a paginated list of Bank items along with pagination metadata.
//
// Parameters:
//   - queries: A pointer to the sqlc Queries instance.
//   - ctx: The context for the database operations.
//   - params: The list parameters including limit and offset for pagination.
//
// Returns:
//   - A slice of Bank database models.
//   - The total count of Bank items matching the criteria.
//   - The calculated last page number.
//   - An error if the retrieval or counting fails.
func GetItems(queries *databaseSqlc.Queries, ctx context.Context, params databaseSqlc.ListBanksParams) ([]databaseSqlc.Bank, int, int, error) {
	banks, err := queries.ListBanks(ctx, params)
	if err != nil {
		return banks, 0, 0, err
	}

	totalItems, err := queries.CountBanks(ctx, params.Search)
	if err != nil {
		return nil, 0, 1, err
	}

	last_page := math.Ceil(float64(totalItems) / float64(params.Limit))
	return banks, int(totalItems), int(last_page), nil
}

// UpdateItems updates an existing Bank record in the database.
//
// Parameters:
//   - queries: A pointer to the sqlc Queries instance.
//   - ctx: The context for the database operation.
//   - bank: The parameters containing the updated values and the record ID.
//
// Returns:
//   - An error if the update operation fails, nil otherwise.
func UpdateItems(queries *databaseSqlc.Queries, ctx context.Context, bank databaseSqlc.UpdateBankNameParams) error {
	return queries.UpdateBankName(ctx, bank)
}
