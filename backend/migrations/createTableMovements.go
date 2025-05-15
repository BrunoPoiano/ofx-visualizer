package migrations

import "database/sql"

func CreatingTableTransaction(db *sql.DB) {

	sql := `CREATE TABLE transactions (
 					id STRING PRIMARY KEY,
	        banc_id INTEGER,
  				date STRING NOT NULL,
					value REAL NOT NULL,
					type STRING,
					desc TEXT,
					FOREIGN KEY (banc_id) REFERENCES bancs(id)
	);`

	_, err := db.Exec(sql)
	if err != nil {
		println("Error creating table:", err.Error())
	}
}
