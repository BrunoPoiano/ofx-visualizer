package CardService

import (
	"context"

	"main/database/databaseSQL"
	databaseSqlc "main/database/databaseSQL"
)

// InsertItems inserts a Card item into the database.
//
// Parameters:
//   - database: A pointer to the database connection.
//   - item: The Card item to insert.
//
// Returns:
//   - An error if the insertion fails, nil otherwise.
func InsertItems(ctx context.Context, item databaseSqlc.CreateCardParams) (int, error) {
	queries := ctx.Value("queries").(*databaseSQL.Queries)

	card_id, err := queries.GetCardIdByAccountId(ctx, item.AccountID)
	if err != nil {
		card, err := queries.CreateCard(ctx, item)
		if err != nil {
			return 0, err
		}

		return int(card.ID), nil
	}

	if card_id > 0 {
		return int(card_id), nil
	}

	return 0, err
}
