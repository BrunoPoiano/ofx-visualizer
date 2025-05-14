package banc

import (
	"database/sql"
	"main/types"
)

func InsertItems(item types.Banc, db *sql.DB) {

	stmt, err := db.Prepare("INSERT INTO bancs(id,name,account_id) values(?,?,?)")
	if err != nil {
		return
	}

	_, err = stmt.Exec(item.Id, item.Name, item.AccountId)

}

func GetItems(db *sql.DB) ([]types.Banc, error) {

	rows, err := db.Query("SELECT * FROM bancs")
	if err != nil {
		return nil, err
	}

	defer rows.Close()

	var items []types.Banc

	for rows.Next() {
		var item types.Banc
		if err := rows.Scan(&item.Id, &item.Name, &item.AccountId); err != nil {
			return nil, err
		}
		items = append(items, item)
	}

	if err := rows.Err(); err != nil {
		return nil, err
	}

	return items, nil

}
