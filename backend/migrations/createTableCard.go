package migrations

import "database/sql"

func CreatingTableCards(db *sql.DB) {

	sql := `CREATE TABLE IF NOT EXISTS cards (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	account_id STRING NOT NULL,
	name STRING NOT NULL,
	f_id STRING NOT NULL
	);`

	_, err := db.Exec(sql)
	if err != nil {
		println("Error creating table", err.Error())
	}

}
