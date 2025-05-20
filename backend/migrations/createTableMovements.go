package migrations

import "database/sql"

func CreatingTableTransaction(db *sql.DB) {

	sql := `CREATE TABLE transactions (
 					id STRING PRIMARY KEY,
	        bank_id INTEGER,
  				date DATETIME NOT NULL,
					value REAL NOT NULL,
					type STRING,
					desc TEXT,
					FOREIGN KEY (bank_id) REFERENCES Banks(id)
	);`

	_, err := db.Exec(sql)
	if err != nil {
		println("Error creating table:", err.Error())
	}
}
