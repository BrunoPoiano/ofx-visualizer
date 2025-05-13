package migrations

import "database/sql"

func CreatingTable(db *sql.DB) {

	sql := `CREATE TABLE transactions (
	          id STRING PRIMARY KEY,
  				date STRING NOT NULL,
					value REAL NOT NULL,
					desc TEXT NOT NULL
	);`

	_, err := db.Exec(sql)
	if err != nil {
		println("Error creating table:", err.Error())
	}

	println("database Created")
}
