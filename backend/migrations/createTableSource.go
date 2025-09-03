package migrations

import "database/sql"

func CreatingTableSource(db *sql.DB) {

	sql := `CREATE TABLE IF NOT EXISTS source (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	card_id INTEGER NULLABLE,
	bank_id INTEGER NULLABLE,
	FOREIGN KEY (bank_id) REFERENCES Banks(id)
	FOREIGN KEY (card_id) REFERENCES Cards(id)
	);`

	_, err := db.Exec(sql)
	if err != nil {
		println("Error creating table", err.Error())
	}

}
