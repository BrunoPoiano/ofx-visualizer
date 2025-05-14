package migrations

import "database/sql"

func CreatingTableTransaction(db *sql.DB) {

	sql := `CREATE TABLE transactions (
	        id STRING PRIMARY KEY,
  				date STRING NOT NULL,
					value REAL NOT NULL,
					type STRING,
					desc TEXT
	);`

	_, err := db.Exec(sql)
	if err != nil {
		println("Error creating table:", err.Error())
	}
}
