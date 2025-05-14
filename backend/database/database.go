package database

import (
	"database/sql"
	"main/migrations"
)

func ConnectDatabase() (*sql.DB, error) {
	db, err := sql.Open("sqlite", "./analytics.db")
	if err != nil {
		return nil, err
	}

	migrations.CreatingTableTransaction(db)
	migrations.CreatingTableBanc(db)

	return db, nil
}
