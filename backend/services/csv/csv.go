package csvService

import (
	"os"
	"strconv"
	"strings"

	databaseSqlc "main/database/databaseSQL"
)

// ParseCsv reads a CSV file from the given file path and parses it into a slice of Transaction structs.
//
// Parameters:
//   - filePath: The path to the CSV file.
//
// Returns:
//   - []databaseSqlc.Transaction: A slice of Transaction structs representing the data in the CSV file.
//   - error: An error if there was a problem reading or parsing the file.
func ParseCsv(filePath string) ([]databaseSqlc.Transaction, error) {
	file, err := os.ReadFile(filePath)
	if err != nil {
		return nil, err
	}

	var lines []databaseSqlc.Transaction

	for index, line := range strings.Split(string(file), "\n") {
		if index == 0 {
			continue
		}

		if line == "" {
			return lines, nil
		}

		items := strings.Split(line, ",")
		value, _ := strconv.ParseFloat(items[1], 64)
		lines = append(lines, databaseSqlc.Transaction{Date: items[0], Value: value, ID: items[2], Desc: items[3]})
	}

	return lines, nil
}
