package database

import (
	"database/sql"
	"main/migrations"
)

// ConnectDatabase opens a connection to the SQLite database.
// Returns:
//
//	*sql.DB: The database connection.
//	error: An error if the connection could not be opened.
func ConnectDatabase() (*sql.DB, error) {
	db, err := sql.Open("sqlite", "./database/analytics.db")
	if err != nil {
		return nil, err
	}
	return db, nil
}

// RunMigrations runs the database migrations.
// Params:
//
//	db: The database connection.
func RunMigrations(db *sql.DB) {
	migrations.CreatingTableTransaction(db)
	migrations.CreatingTableBanc(db)
}
