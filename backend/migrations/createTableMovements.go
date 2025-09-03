package migrations

import "database/sql"

func CreatingTableTransaction(db *sql.DB) {

	sql := `CREATE TABLE IF NOT EXISTS transactions (
 					id STRING PRIMARY KEY,
	        source_id INTEGER,
  				date DATETIME NOT NULL,
					value REAL NOT NULL,
					type STRING,
					desc TEXT,
					FOREIGN KEY (source_id) REFERENCES Source(id)
					);`

	_, err := db.Exec(sql)
	if err != nil {
		println("Error creating table:", err.Error())
	}
}
