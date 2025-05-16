package migrations

import "database/sql"

func CreatingTableBanc(db *sql.DB) {

	sql := `CREATE TABLE Banks (
					id INTEGER PRIMARY KEY AUTOINCREMENT,
					name STRING NOT NULL,
					account_id STRING NOT NULL
			);`

	_, err := db.Exec(sql)
	if err != nil {
		println("Error creating table:", err.Error())
	}
}
