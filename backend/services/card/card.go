package CardService

import (
	"database/sql"
	"fmt"
	"main/services/utils"
	"main/types"
)

// InsertItems inserts a Card item into the database.
//
// Parameters:
//   - database: A pointer to the database connection.
//   - item: The Card item to insert.
//
// Returns:
//   - An error if the insertion fails, nil otherwise.
func InsertItems(database *sql.DB, item types.Card) (int, error) {

	var id int
	total, err := database.Query("SELECT id FROM cards WHERE account_id = ?", item.AccountId)
	if err != nil {
		return 0, err
	}
	defer total.Close()

	if err := total.Err(); err != nil {
		return 0, err
	}
	for total.Next() {
		total.Scan(&id)
	}

	if id != 0 {
		return id, nil
	}

	stmt, err := database.Prepare("INSERT INTO cards(name,account_id,f_id) values(?,?,?)")
	if err != nil {
		return 0, err
	}

	result, err := stmt.Exec(item.Name, item.AccountId, item.FId)
	if err != nil {
		return 0, err
	}

	lastId, err := result.LastInsertId()
	if err != nil {
		return 0, err
	}

	return int(lastId), nil
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
func GetItems(database *sql.DB, filter types.DefaultSearch) ([]types.Card, int, error) {

	var items []types.Card

	offset := filter.PerPage * (filter.CurrentPage - 1)
	query := fmt.Sprintf("SELECT * FROM cards")

	if filter.Search != "" {
		query = fmt.Sprintf("%s WHERE name LIKE '%%%s%%'", query, filter.Search)
	}

	query = fmt.Sprintf("%s ORDER BY %s %s", query, filter.Order, filter.Direction)
	query = fmt.Sprintf("%s LIMIT %v OFFSET %v", query, filter.PerPage, offset)

	items, err := utils.MakeQueryCall(database, query, func(rows *sql.Rows) ([]types.Card, error) {
		var s []types.Card
		for rows.Next() {
			var item types.Card
			err := rows.Scan(&item.Id, &item.Name, &item.AccountId, &item.FId)
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

func UpdateItems(database *sql.DB, item types.Card) error {

	if item.Name == "" || item.Id == 0 {
		return fmt.Errorf("Invalid object")
	}

	query := fmt.Sprintf("UPDATE cards SET name='%s' WHERE id=%d", item.Name, item.Id)
	_, err := database.Exec(query)

	return err
}
