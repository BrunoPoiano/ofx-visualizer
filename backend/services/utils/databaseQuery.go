package utils

import (
	"database/sql"
	"main/types"
)

func MakeQueryCall[T any](db *sql.DB, query string, scanFunc func(*sql.Rows) (T, error)) (T, error) {
	var zero T

	rows, err := db.Query(query)
	if err != nil {
		return zero, err
	}
	defer rows.Close()

	if rows.Next() {
		result, err := scanFunc(rows)
		if err != nil {
			return zero, err
		}
		return result, nil
	}

	return zero, sql.ErrNoRows
}

func ScanStatement(rows *sql.Rows) (types.Statement, error) {
	var s types.Statement
	err := rows.Scan(
		&s.Id,
		&s.BankId,
		&s.StartDate,
		&s.EndDate,
		&s.LedgerBalance,
		&s.BalanceDate,
		&s.ServerDate,
		&s.Language,
	)
	return s, err
}
