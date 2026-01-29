package utils

import (
	"database/sql"
	"fmt"
	"net/url"
	"strconv"

	databaseSqlc "main/database/databaseSQL"
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

type ListParams interface {
	databaseSqlc.ListBanksParams
}

func CheckRequestParams[T ListParams](params url.Values) T {
	search := params.Get("search")

	perpage, err := strconv.ParseInt(params.Get("perPage"), 10, 64)
	if err != nil || perpage < 5 {
		perpage = 5
	}

	currentPage, err := strconv.ParseInt(params.Get("currentPage"), 10, 64)
	if err != nil || currentPage == 0 {
		currentPage = 1
	}

	order := params.Get("order")
	if order == "" {
		order = "id"
	}

	direction := params.Get("direction")
	if direction == "" {
		direction = "ASC"
	}

	offset := perpage * (currentPage - 1)

	return T{
		search,
		offset,
		perpage,
	}
}

func InterfaceToInt(value interface{}) (int, error) {
	var v int
	switch t := value.(type) {
	case int:
		v = t
	case int8:
		v = int(t)
	case int16:
		v = int(t)
	case int32:
		v = int(t)
	case int64:
		v = int(t)
	case float32:
		v = int(t)
	case float64:
		v = int(t)
	default:
		return 0, fmt.Errorf("Invalid value")
	}

	return v, nil
}

func InterfaceToString(v interface{}) string {
	var s string

	switch v := v.(type) {
	case string:
		s = v
	case []byte:
		s = string(v)
	case int:
		s = strconv.Itoa(v)
	default:
		s = ""
	}

	return s
}

func InterfaceToFloat(value interface{}) (float64, error) {
	var v float64
	switch t := value.(type) {
	case int:
		v = float64(t)
	case int8:
		v = float64(t)
	case int16:
		v = float64(t)
	case int32:
		v = float64(t)
	case int64:
		v = float64(t)
	case float32:
		v = float64(t)
	case float64:
		v = t
	default:
		return 0, fmt.Errorf("Invalid value")
	}

	return v, nil
}

func CheckIfZero(value int64) interface{} {
	if value == 0 {
		return nil
	}

	return value
}

func FixSearchDate(value string, from bool) interface{} {
	if value == "" {
		return nil
	}

	if from {
		return fmt.Sprintf("%s 00:00:00", value)
	}

	return fmt.Sprintf("%s 23:59:59", value)
}
