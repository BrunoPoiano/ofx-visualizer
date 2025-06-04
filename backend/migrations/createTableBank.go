package migrations

import "database/sql"

func CreatingTableBank(db *sql.DB) {

	sql := `CREATE TABLE IF NOT EXISTS banks (
					id INTEGER PRIMARY KEY AUTOINCREMENT,
					name STRING NOT NULL,
					account_id STRING NOT NULL,
					account_type STRING NOT NULL,
					f_id STRING NOT NULL,
					bank_id STRING NOT NULL,
					branch_id STRING NOT NULL
			);`

	_, err := db.Exec(sql)
	if err != nil {
		println("Error creating table:", err.Error())
	}
}
