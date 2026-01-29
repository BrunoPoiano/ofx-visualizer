package database

import (
	"context"
	"database/sql"
	"log"

	_ "embed"
	databaseSqlc "main/database/databaseSQL"
)

//go:embed schema.sql
var ddl string

// ConnectDatabase opens a connection to the SQLite database.
// Returns:
//
//	*sql.DB: The database connection.
//	error: An error if the connection could not be opened.
func ConnectDatabase(ctx context.Context) (*sql.DB, *databaseSqlc.Queries, error) {
	database, err := sql.Open("sqlite", "./database/analytics.db")
	if err != nil {
		return nil, nil, err
	}

	if _, err := database.Exec(`PRAGMA foreign_keys = ON; PRAGMA journal_mode = WAL; PRAGMA synchronous = NORMAL;`); err != nil {
		log.Fatalf("failed to enable foreign keys: %v", err)
	}

	println("Running migrations")
	if _, err := database.ExecContext(ctx, ddl); err != nil {
		return nil, nil, err
	}

	queries := databaseSqlc.New(database)
	return database, queries, nil
}
