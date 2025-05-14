package migrations

import "database/sql"

func CreatingTableBanc(db *sql.DB) {

	sql := `CREATE TABLE bancs (
	        id AUTO INCREMENT PRIMARY KEY,
					name STRING NOT NULL,
					account_id STRING NOT NULL
			);`

	_, err := db.Exec(sql)
	if err != nil {
		println("Error creating table:", err.Error())
	}
}
