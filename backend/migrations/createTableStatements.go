package migrations

import "database/sql"

func CreatingTableStatements(db *sql.DB) {

	sql := `CREATE TABLE IF NOT EXISTS statements (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    source_id INTEGER,
    start_date DATETIME NOT NULL,
    end_date DATETIME NOT NULL,
    ledger_balance REAL NOT NULL,
    balance_date DATETIME NOT NULL,
    server_date DATETIME NOT NULL,
    language STRING NOT NULL,
    FOREIGN KEY (source_id) REFERENCES Source(id)
);`

	_, err := db.Exec(sql)
	if err != nil {
		println("Error creating table:", err.Error())
	}
}
