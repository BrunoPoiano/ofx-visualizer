package ofxService

import (
	"database/sql"
	"fmt"
	"io"
	"mime/multipart"
	"regexp"
	"strconv"
	"strings"
	"time"

	databaseSqlc "main/database/databaseSQL"
	"main/types"
)

// ParseOfx parses an OFX file and extracts transaction data and bank information.
//
// Parameters:
//   - file: A multipart.File representing the OFX file to parse.
//
// Returns:
//   - []databaseSqlc.Transaction: A slice of Transaction structs, each representing a transaction from the OFX file.
//   - databaseSqlc.CreateBankParams: A Bank struct containing bank information extracted from the OFX file.
//   - error: An error if any occurred during the parsing process, or nil if parsing was successful.
func ParseOfx(file multipart.File) ([]databaseSqlc.CreateTransactionParams, databaseSqlc.StatementYields, databaseSqlc.CreateBankParams, databaseSqlc.CreateCardParams, error) {
	var Transactions []databaseSqlc.CreateTransactionParams
	var Bank databaseSqlc.CreateBankParams
	var Statement databaseSqlc.StatementYields
	var Card databaseSqlc.CreateCardParams

	fileContent, err := io.ReadAll(file)
	if err != nil {
		return Transactions, Statement, Bank, Card, fmt.Errorf("error reading file: %w", err)
	}
	fileString := string(fileContent)

	Statement, err = parseStatement(fileString)
	if err != nil {
		return Transactions, Statement, Bank, Card, fmt.Errorf("error parsing statements: %w", err)
	}

	Card, card_err := parseCardInfo(fileString)
	Bank, bank_err := parseBankInfo(fileString)

	if bank_err != nil && card_err != nil {
		return Transactions, Statement, Bank, Card, fmt.Errorf("error parsing bank or card: %w", err)
	}

	stmttrn := getArrayItensFromTag("STMTTRN", fileString)
	for _, item := range stmttrn {
		line, err := parseSTMTTRNIntoTransaction(item)
		if err == nil {
			Transactions = append(Transactions, line)
		}
	}

	return Transactions, Statement, Bank, Card, nil
}

// isXMLFormat checks if the OFX file is in XML format (has closing tags) or SGML format
func isXMLFormat(fileString, tag string) bool {
	var regex *regexp.Regexp
	regex = regexp.MustCompile(fmt.Sprintf(`(?s)<%s>(.*?)</%s>`, tag, tag))
	matches := regex.FindAllStringSubmatch(fileString, -1)
	return len(matches) > 0
}

// getItensFromTag extracts all occurrences of a tag and its content from a string.
//
// Parameters:
//   - tag: The tag to search for (e.g., "STMTTRN").
//   - fileString: The string to search within.
//
// Returns:
//   - string: A slice of strings, where each string is the content found within the specified tag.
//   - error: error
func getItensFromTag(tag, fileString string) (string, error) {
	var regex *regexp.Regexp
	var results []string

	if isXMLFormat(fileString, tag) {
		// XML format (with closing tags)
		xmlPattern := fmt.Sprintf(`(?s)<%s>(.*?)</%s>`, tag, tag)
		regex = regexp.MustCompile(xmlPattern)
		matches := regex.FindAllStringSubmatch(fileString, -1)

		for _, match := range matches {
			results = append(results, strings.TrimSpace(match[1]))
		}
	} else {
		// SGML pattern: match <TAG>value until next < or newline
		sgmlPattern := fmt.Sprintf(`<%s>([^<\r\n]+)`, tag)
		regex = regexp.MustCompile(sgmlPattern)
		matches := regex.FindAllStringSubmatch(fileString, -1)

		for _, match := range matches {
			results = append(results, strings.TrimSpace(match[1]))
		}
	}

	if len(results) > 0 {
		return results[0], nil
	}

	return "", fmt.Errorf("%s not found", tag)
}

// getArrayItensFromTag extracts all occurrences of a tag and its content from a string and returns a slice of strings.
//
// Parameters:
//   - tag: The tag to search for (e.g., "STMTTRN").
//   - fileString: The string to search within.
//
// Returns:
//   - []string: A slice of strings, where each string is the content found within the specified tag.
func getArrayItensFromTag(tag, fileString string) []string {
	var regex *regexp.Regexp
	var results []string

	if isXMLFormat(fileString, tag) {
		// XML format (with closing tags)
		xmlPattern := fmt.Sprintf(`(?s)<%s>(.*?)</%s>`, tag, tag)
		regex = regexp.MustCompile(xmlPattern)
		matches := regex.FindAllStringSubmatch(fileString, -1)

		for _, match := range matches {
			results = append(results, strings.TrimSpace(match[1]))
		}
	} else {
		// For SGML format
		if tag == "STMTTRN" {
			// Split the content on STMTTRN tags and process each block
			blocks := strings.Split(fileString, "<STMTTRN>")
			for _, block := range blocks[1:] { // Skip the first split which is before any STMTTRN
				// Find where the next STMTTRN starts or end of content
				endIdx := strings.Index(block, "<STMTTRN>")
				if endIdx == -1 {
					// If no next STMTTRN, take until end of block
					results = append(results, strings.TrimSpace(block))
				} else {
					// If there is a next STMTTRN, take only until that point
					results = append(results, strings.TrimSpace(block[:endIdx]))
				}
			}
		} else {
			// For simple tags, match until next < or newline
			sgmlPattern := fmt.Sprintf(`<%s>([^<\r\n]+)`, tag)
			regex = regexp.MustCompile(sgmlPattern)
			matches := regex.FindAllStringSubmatch(fileString, -1)
			for _, match := range matches {
				results = append(results, strings.TrimSpace(match[1]))
			}
		}
	}

	return results
}

// parseSTMTTRNIntoTransaction parses a STMTTRN string into a Transaction struct.
//
// Parameters:
//   - stmttrn: The STMTTRN string to parse.
//
// Returns:
//   - databaseSqlc.Transaction: A Transaction struct containing the parsed data.
func parseSTMTTRNIntoTransaction(stmttrn string) (databaseSqlc.CreateTransactionParams, error) {
	var transaction databaseSqlc.CreateTransactionParams

	value, err := getItensFromTag("TRNAMT", stmttrn)
	if err != nil {
		return transaction, err
	}
	tType, err := getItensFromTag("TRNTYPE", stmttrn)
	if err != nil {
		return transaction, err
	}
	if types.TransactionType(tType).IsValid() == false {
		return transaction, fmt.Errorf("Invalid Type")
	}

	id, err := getItensFromTag("FITID", stmttrn)
	if err != nil {
		return transaction, err
	}
	desc, err := getItensFromTag("MEMO", stmttrn)
	if err != nil {
		return transaction, err
	}
	date, err := getItensFromTag("DTPOSTED", stmttrn)
	if err != nil {
		return transaction, err
	}

	transaction.Value, _ = strconv.ParseFloat(value, 64)
	transaction.Type = types.TransactionType(tType)
	transaction.ID = id
	transaction.Desc = desc
	transaction.Date, _ = parseOfxDate(date)

	return transaction, nil
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
//   - databaseSqlc.CreateBankParams: A Bank struct containing the parsed bank information.
func parseBankInfo(file string) (databaseSqlc.CreateBankParams, error) {
	var Bank databaseSqlc.CreateBankParams

	name, err := getItensFromTag("ORG", file)
	if err != nil {
		return Bank, err
	}
	accountId, err := getItensFromTag("ACCTID", file)
	if err != nil {
		return Bank, err
	}
	fId, err := getItensFromTag("FID", file)
	if err != nil {
		return Bank, err
	}
	bankId, err := getItensFromTag("BANKID", file)
	if err != nil {
		return Bank, err
	}
	branchId, err := getItensFromTag("BRANCHID", file)
	if err != nil {
		branchId = "1"
	}
	accountType, err := getItensFromTag("ACCTTYPE", file)
	if err != nil {
		return Bank, err
	}

	if types.AccountType(accountType).IsValid() == false {
		return Bank, fmt.Errorf("Invalid AccountType")
	}

	Bank.Name = fmt.Sprintf("Bank %s", name)
	Bank.AccountID = accountId
	Bank.FID = fId
	Bank.BankID = bankId
	Bank.BranchID = branchId
	Bank.AccountType = types.AccountType(accountType)
	return Bank, nil
}

func parseCardInfo(file string) (databaseSqlc.CreateCardParams, error) {
	var Card databaseSqlc.CreateCardParams

	_, err := getItensFromTag("CCACCTFROM", file)
	if err != nil {
		return Card, err
	}

	name, err := getItensFromTag("ORG", file)
	if err != nil {
		return Card, err
	}

	Card.Name = fmt.Sprintf("Card %s", name)

	Card.AccountID, err = getItensFromTag("ACCTID", file)
	if err != nil {
		return Card, err
	}

	Card.FID, err = getItensFromTag("FID", file)
	if err != nil {
		return Card, err
	}

	return Card, nil
}

// parseStatement parses statement information from an OFX file string.
//
// Parameters:
//   - fileString: The string containing the OFX data.
//
// Returns:
//   - databaseSqlc.Statement: A Statement struct containing the parsed statement information.
//   - error: An error if any occurred during the parsing process, or nil if parsing was successful.
func parseStatement(fileString string) (databaseSqlc.StatementYields, error) {
	var statement databaseSqlc.StatementYields

	tagDtStart, err := getItensFromTag("DTSTART", fileString)
	if err != nil {
		return statement, err
	}
	dtStart, err := parseOfxDate(tagDtStart)
	if err != nil {
		return statement, err
	}

	tagDtEnd, err := getItensFromTag("DTEND", fileString)
	if err != nil {
		return statement, err
	}
	dtEnd, err := parseOfxDate(tagDtEnd)
	if err != nil {
		return statement, err
	}

	tagDtAsOf, err := getItensFromTag("DTASOF", fileString)
	if err != nil {
		return statement, err
	}
	dtasof, err := parseOfxDate(tagDtAsOf)
	if err != nil {
		return statement, err
	}

	tagDtServer, err := getItensFromTag("DTSERVER", fileString)
	if err != nil {
		return statement, err
	}
	dtserver, err := parseOfxDate(tagDtServer)
	if err != nil {
		return statement, err
	}

	tagBalamt, err := getItensFromTag("BALAMT", fileString)
	if err != nil {
		return statement, err
	}
	balamt, err := strconv.ParseFloat(tagBalamt, 64)
	if err != nil {
		return statement, err
	}

	language := "ENG"
	tagLang, err := getItensFromTag("LANGUAGE", fileString)
	if err == nil {
		language = tagLang
	}

	statement.Statement.StartDate = dtStart
	statement.Statement.EndDate = dtEnd
	statement.Statement.BalanceDate = dtasof
	statement.Statement.ServerDate = dtserver
	statement.Statement.LedgerBalance = balamt
	statement.Statement.Language = language

	statement.Yields = parseBalance(fileString)
	return statement, nil
}

// parseBalance parses balance information from an OFX file string.
//
// Parameters:
//   - fileString: The string containing the OFX data.
//
// Returns:
//   - []databaseSqlc.Balance: A slice of Balance structs containing the parsed balance information.
func parseBalance(fileString string) []databaseSqlc.Balance {
	balItems := getArrayItensFromTag("BAL", fileString)
	var balances []databaseSqlc.Balance
	for _, balItem := range balItems {

		name, err := getItensFromTag("NAME", balItem)
		if err != nil {
			continue
		}
		desc, err := getItensFromTag("DESC", balItem)
		if err != nil {
			continue
		}
		balType, err := getItensFromTag("BALTYPE", balItem)
		if err != nil {
			continue
		}

		value, err := getItensFromTag("VALUE", balItem)
		if err != nil {
			continue
		}

		floatValue, err := strconv.ParseFloat(value, 64)
		if err != nil {
			continue
		}

		balances = append(balances, databaseSqlc.Balance{
			Name: name,
			Description: sql.NullString{
				String: desc,
				Valid:  desc != "",
			},
			BalanceType: balType,
			Value:       floatValue,
		})
	}

	return balances
}
