package utils

import (
	"database/sql"
)

// MakeQueryCall executes a SQL query and scans the result into a specified type.
//
// Parameters:
//   - db: The database connection.
//   - query: The SQL query to execute.
//   - scanFunc: A function that scans a sql.Rows object into the desired type T.  This function should handle the iteration and scanning of rows as needed.
//
// Returns:
//   - The scanned result of type T.  If no rows are returned, the zero value of T is returned.
//   - An error if the query fails or if the scan function returns an error.
func MakeQueryCall[T any](db *sql.DB, query string, scanFunc func(*sql.Rows) (T, error)) (T, error) {
	var zero T

	rows, err := db.Query(query)
	if err != nil {
		return zero, err
	}
	defer rows.Close()

	result, err := scanFunc(rows)
	if err != nil {
		return zero, err
	}

	return result, nil
}
