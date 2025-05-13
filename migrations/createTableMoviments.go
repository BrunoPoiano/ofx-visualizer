package migrations

import "database/sql"

func CreatingTable(db *sql.DB) {

	sql := `CREATE TABLE moviments (
          id STRING PRIMARY KEY,
  				date STRING NOT NULL,
					value FLOAT64 NOT NULL,
					desc TEXT NOT NULL
	);`

	_, err := db.Exec(sql)
	if err != nil {
		println(err)
	}
}
