package migrations

import "database/sql"

func CreatingTableTransaction(db *sql.DB) {

	sql := `CREATE TABLE transactions (
 					id STRING PRIMARY KEY,
	        Bank_id INTEGER,
  				date DATETIME NOT NULL,
					value REAL NOT NULL,
					type STRING,
					desc TEXT,
					FOREIGN KEY (Bank_id) REFERENCES Banks(id)
	);`

	_, err := db.Exec(sql)
	if err != nil {
		println("Error creating table:", err.Error())
	}
}
