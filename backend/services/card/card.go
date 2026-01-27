package CardService

import (
	"context"
	"database/sql"
	"fmt"

	"main/services/utils"
	"main/types"

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
func InsertItems(queries *databaseSqlc.Queries, ctx context.Context, item databaseSqlc.CreateCardParams) (int, error) {
	card_id, err := queries.GetCardIdByAccountId(ctx, item.AccountID)
	if err != nil {
		return 0, err
	}

	if card_id > 0 {
		return int(card_id), nil
	}

	card, err := queries.CreateCard(ctx, item)
	if err != nil {
		return 0, err
	}

	return int(card.ID), nil
}

// GetItems retrieves a paginated list of Card items from the database.
//
// Parameters:
//   - database: A pointer to the database connection.
//   - perPage: The number of items to retrieve per page.
//   - currentPage: The current page number.
//
// Returns:
//   - A slice of Card items.
//   - The total number of items in the database.
//   - An error if the retrieval fails, nil otherwise.
func GetItems(database *sql.DB, filter types.DefaultSearch) ([]databaseSqlc.Card, int, error) {
	var items []databaseSqlc.Card

	offset := filter.PerPage * (filter.CurrentPage - 1)
	query := fmt.Sprintf("SELECT * FROM cards")

	if filter.Search != "" {
		query = fmt.Sprintf("%s WHERE name LIKE '%%%s%%'", query, filter.Search)
	}

	query = fmt.Sprintf("%s ORDER BY %s %s", query, filter.Order, filter.Direction)
	query = fmt.Sprintf("%s LIMIT %v OFFSET %v", query, filter.PerPage, offset)

	items, err := utils.MakeQueryCall(database, query, func(rows *sql.Rows) ([]databaseSqlc.Card, error) {
		var s []databaseSqlc.Card
		for rows.Next() {
			var item databaseSqlc.Card
			err := rows.Scan(&item.ID, &item.Name, &item.AccountID, &item.FID)
			if err != nil {
				return nil, err
			}
			s = append(s, item)
		}
		return s, rows.Err()
	})
	if err != nil {
		return nil, 0, err
	}

	totalQuery := "SELECT count(id) as totalItems FROM cards"
	totalItems, err := utils.MakeQueryCall(database, totalQuery, func(rows *sql.Rows) (int, error) {
		var s int
		for rows.Next() {
			rows.Scan(&s)
		}
		return s, nil
	})
	if err != nil {
		return nil, 0, err
	}

	return items, totalItems, nil
}

func UpdateItems(database *sql.DB, item databaseSqlc.Card) error {
	if item.Name == "" || item.ID == 0 {
		return fmt.Errorf("Invalid object")
	}

	query := fmt.Sprintf("UPDATE cards SET name='%s' WHERE id=%d", item.Name, item.ID)
	_, err := database.Exec(query)

	return err
}
