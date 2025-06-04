package migrations

import "database/sql"

func CreatingTableBalance(db *sql.DB) {

	sql := `CREATE TABLE IF NOT EXISTS balances (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    statement_id INTEGER,
    name STRING NOT NULL,
    description TEXT,
    balance_type STRING NOT NULL,
    value REAL NOT NULL,
    FOREIGN KEY (statement_id) REFERENCES Statements(id)
);`

	_, err := db.Exec(sql)
	if err != nil {
		println("Error creating table:", err.Error())
	}
}
