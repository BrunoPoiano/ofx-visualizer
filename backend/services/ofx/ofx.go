package ofxService

import (
	"fmt"
	"io"
	"main/types"
	"mime/multipart"
	"regexp"
	"strconv"
	"strings"
	"time"
)

// ParseOfx parses an OFX file and extracts transaction data and bank information.
//
// Parameters:
//   - file: A multipart.File representing the OFX file to parse.
//
// Returns:
//   - []types.Transaction: A slice of Transaction structs, each representing a transaction from the OFX file.
//   - types.Bank: A Bank struct containing bank information extracted from the OFX file.
//   - error: An error if any occurred during the parsing process, or nil if parsing was successful.
func ParseOfx(file multipart.File) ([]types.Transaction, types.Bank, error) {

	var lines []types.Transaction

	fileContent, err := io.ReadAll(file)
	if err != nil {
		return nil, types.Bank{}, fmt.Errorf("error reading file: %w", err)
	}
	fileString := string(fileContent)

	stmttrn := getItensFromTag("STMTTRN", fileString)
	Bank := parseBankInfo(fileString)
	for _, item := range stmttrn {
		line := parseSTMTTRNIntoTransaction(item)
		lines = append(lines, line)
	}

	return lines, Bank, nil
}

// getItensFromTag extracts all occurrences of a tag and its content from a string.
//
// Parameters:
//   - tag: The tag to search for (e.g., "STMTTRN").
//   - fileString: The string to search within.
//
// Returns:
//   - []string: A slice of strings, where each string is the content found within the specified tag.
func getItensFromTag(tag, fileString string) []string {

	sintax := fmt.Sprintf(`(?s)<%s>(.*?)</%s>`, tag, tag)

	regex := regexp.MustCompile(sintax)
	matches := regex.FindAllStringSubmatch(fileString, -1)

	var results []string

	for _, match := range matches {
		results = append(results, match[1])
	}

	return results
}

// parseSTMTTRNIntoTransaction parses a STMTTRN string into a Transaction struct.
//
// Parameters:
//   - stmttrn: The STMTTRN string to parse.
//
// Returns:
//   - types.Transaction: A Transaction struct containing the parsed data.
func parseSTMTTRNIntoTransaction(stmttrn string) types.Transaction {

	var transaction types.Transaction
	value := getItensFromTag("TRNAMT", stmttrn)[0]

	transaction.Value, _ = strconv.ParseFloat(value, 64)
	transaction.Type = getItensFromTag("TRNTYPE", stmttrn)[0]
	transaction.Id = getItensFromTag("FITID", stmttrn)[0]
	transaction.Desc = getItensFromTag("MEMO", stmttrn)[0]
	transaction.Date, _ = parseOfxDate(getItensFromTag("DTPOSTED", stmttrn)[0])

	return transaction
}

// parseOfxDate parses an OFX date string into a formatted date string.
//
// Parameters:
//   - date: The OFX date string to parse.
//
// Returns:
//   - string: A formatted date string in the format "2006-01-02 15:04:05".
//   - error: An error if the date string could not be parsed, or nil if parsing was successful.
func parseOfxDate(date string) (string, error) {
	if idx := strings.Index(date, "["); idx != -1 {
		date = date[:idx]
	}

	const layout = "20060102150405"
	t, err := time.Parse(layout, date)
	if err != nil {
		return "", err
	}

	return t.Format("2006-01-02 15:04:05"), nil

}

// parseBankInfo parses bank information from a string.
//
// Parameters:
//   - file: The string containing the bank information.
//
// Returns:
//   - types.Bank: A Bank struct containing the parsed bank information.
func parseBankInfo(file string) types.Bank {

	var Bank types.Bank

	Bank.Name = getItensFromTag("ORG", file)[0]
	Bank.AccountId = getItensFromTag("ACCTID", file)[0]

	return Bank

}
