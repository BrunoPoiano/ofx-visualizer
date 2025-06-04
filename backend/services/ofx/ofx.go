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
func ParseOfx(file multipart.File) ([]types.Transaction, types.Bank, types.Statement, error) {

	var lines []types.Transaction

	fileContent, err := io.ReadAll(file)
	if err != nil {
		return nil, types.Bank{}, types.Statement{}, fmt.Errorf("error reading file: %w", err)
	}
	fileString := string(fileContent)

	statement, err := parseStatement(fileString)
	if err != nil {
		return nil, types.Bank{}, types.Statement{}, fmt.Errorf("error parsing statements: %w", err)
	}

	Bank := parseBankInfo(fileString)
	stmttrn := getItensFromTag("STMTTRN", fileString)
	for _, item := range stmttrn {
		line := parseSTMTTRNIntoTransaction(item)
		lines = append(lines, line)
	}

	return lines, Bank, statement, nil
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
	Bank := types.Bank{
		Name:        getItensFromTag("ORG", file)[0],
		AccountId:   getItensFromTag("ACCTID", file)[0],
		FId:         getItensFromTag("FID", file)[0],
		BankId:      getItensFromTag("BANKID", file)[0],
		BranchId:    getItensFromTag("BRANCHID", file)[0],
		AccountType: getItensFromTag("ACCTTYPE", file)[0],
	}
	return Bank
}

// parseStatement parses statement information from an OFX file string.
//
// Parameters:
//   - fileString: The string containing the OFX data.
//
// Returns:
//   - types.Statement: A Statement struct containing the parsed statement information.
//   - error: An error if any occurred during the parsing process, or nil if parsing was successful.
func parseStatement(fileString string) (types.Statement, error) {

	var statement types.Statement

	dtStart, err := parseOfxDate(getItensFromTag("DTSTART", fileString)[0])
	if err != nil {
		return statement, err
	}
	dtEnd, err := parseOfxDate(getItensFromTag("DTEND", fileString)[0])
	if err != nil {
		return statement, err
	}
	dtasof, err := parseOfxDate(getItensFromTag("DTASOF", fileString)[0])
	if err != nil {
		return statement, err
	}
	dtserver, err := parseOfxDate(getItensFromTag("DTSERVER", fileString)[0])
	if err != nil {
		return statement, err
	}

	balamt, err := strconv.ParseFloat(getItensFromTag("BALAMT", fileString)[0], 64)
	if err != nil {
		return statement, err
	}

	statement.StartDate = dtStart
	statement.EndDate = dtEnd
	statement.BalanceDate = dtasof
	statement.ServerDate = dtserver
	statement.LedgerBalance = balamt
	statement.Language = getItensFromTag("LANGUAGE", fileString)[0]

	statement.Yields = parseBalance(fileString)
	return statement, nil
}

// parseBalance parses balance information from an OFX file string.
//
// Parameters:
//   - fileString: The string containing the OFX data.
//
// Returns:
//   - []types.Balance: A slice of Balance structs containing the parsed balance information.
func parseBalance(fileString string) []types.Balance {

	balItems := getItensFromTag("BAL", fileString)
	var balances []types.Balance
	for _, balItem := range balItems {

		value, _ := strconv.ParseFloat(getItensFromTag("VALUE", balItem)[0], 64)

		balance := types.Balance{
			Name:    getItensFromTag("NAME", balItem)[0],
			Desc:    getItensFromTag("DESC", balItem)[0],
			BalType: getItensFromTag("BALTYPE", balItem)[0],
			Value:   value,
		}
		balances = append(balances, balance)
	}

	return balances
}
