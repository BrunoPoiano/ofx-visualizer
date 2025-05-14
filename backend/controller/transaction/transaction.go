package transaction

import (
	"database/sql"
	"main/types"
)

func InsertItems(items []types.Transaction, db *sql.DB) {

	stmt, err := db.Prepare("INSERT INTO transactions(id,date,value,desc,type) values(?,?,?,?,?)")
	if err != nil {
		return
	}

	for _, item := range items {
		_, err = stmt.Exec(item.Id, item.Date, item.Value, item.Desc, item.Type)
	}

}

func GetItems(db *sql.DB) ([]types.Transaction, error) {

	rows, err := db.Query("SELECT * FROM transactions")
	if err != nil {
		return nil, err
	}

	defer rows.Close()

	var items []types.Transaction

	for rows.Next() {
		var item types.Transaction
		if err := rows.Scan(&item.Id, &item.Date, &item.Value, &item.Type, &item.Desc); err != nil {
			return nil, err
		}
		items = append(items, item)
	}

	if err := rows.Err(); err != nil {
		return nil, err
	}

	return items, nil

}
