package transaction

import (
	"database/sql"
	"main/types"
)

func InsertItems(items []types.Transaction, db *sql.DB) {

	stmt, err := db.Prepare("INSERT INTO transactions(id,date,value,desc) values(?,?,?,?)")
	if err != nil {
		return
	}

	for _, item := range items {
		_, err = stmt.Exec(item.Id, item.Date, item.Value, item.Desc)
	}

}
