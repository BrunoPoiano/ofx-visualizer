package moviments

import (
	"database/sql"
	"main/types"
)

func InsetItems(items []types.CsvTable, db *sql.DB) {

	stmt, err := db.Prepare("INSERT INTO moviments(id,date,value,desc) values(?,?,?,?)")
	if err != nil {
		return
	}

	for _, item := range items {
		_, err = stmt.Exec(item.Id, item.Date, item.Value, item.Desc)
	}

}
