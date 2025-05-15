package bancService

import (
	"database/sql"
	"fmt"
	"main/types"
)

// InsertItems inserts a banc item into the database.
//
// Parameters:
//   - database: A pointer to the database connection.
//   - item: The Banc item to insert.
//
// Returns:
//   - An error if the insertion fails, nil otherwise.
func InsertItems(database *sql.DB, item types.Banc) (int, error) {

	stmt, err := database.Prepare("INSERT INTO bancs(name,account_id) values(?,?)")
	if err != nil {
		return 0, err
	}

	result, err := stmt.Exec(item.Name, item.AccountId)
	if err != nil {
		return 0, err
	}

	id, err := result.LastInsertId()
	if err != nil {
		return 0, err
	}

	return int(id), nil
}

// GetItems retrieves a paginated list of banc items from the database.
//
// Parameters:
//   - database: A pointer to the database connection.
//   - perPage: The number of items to retrieve per page.
//   - currentPage: The current page number.
//
// Returns:
//   - A slice of Banc items.
//   - The total number of items in the database.
//   - An error if the retrieval fails, nil otherwise.
func GetItems(database *sql.DB, perPage, currentPage int) ([]types.Banc, int, error) {

	var items []types.Banc
	var totalItems int

	//BANCS
	offset := perPage * (currentPage - 1)
	query := fmt.Sprintf("SELECT * FROM bancs LIMIT %v OFFSET %v", perPage, offset)

	rows, err := database.Query(query)
	if err != nil {
		return nil, 0, err
	}

	if err := rows.Err(); err != nil {
		return nil, 0, err
	}

	for rows.Next() {
		var item types.Banc
		if err := rows.Scan(&item.Id, &item.Name, &item.AccountId); err != nil {
			return nil, 0, err
		}
		items = append(items, item)
	}

	defer rows.Close()

	// TOTALITEMS
	total, err := database.Query("SELECT count(id) as totalItems FROM transactions")
	if err := total.Err(); err != nil {
		return nil, 0, err
	}

	for total.Next() {
		total.Scan(&totalItems)
	}

	defer total.Close()

	return items, totalItems, nil

}
