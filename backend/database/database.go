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
	return db, nil
}

func RunMigrations(db *sql.DB) {
	migrations.CreatingTableTransaction(db)
	migrations.CreatingTableBanc(db)
}
