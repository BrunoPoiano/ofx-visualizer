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

	Bank, err := parseBankInfo(fileString)
	if err != nil {
		return nil, types.Bank{}, types.Statement{}, fmt.Errorf("error parsing banks: %w", err)
	}

	stmttrn := getArrayItensFromTag("STMTTRN", fileString)
	for _, item := range stmttrn {
		line, err := parseSTMTTRNIntoTransaction(item)
		if err == nil {
			lines = append(lines, line)
		}
	}

	return lines, Bank, statement, nil
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
//   - types.Transaction: A Transaction struct containing the parsed data.
func parseSTMTTRNIntoTransaction(stmttrn string) (types.Transaction, error) {

	var transaction types.Transaction

	value, err := getItensFromTag("TRNAMT", stmttrn)
	if err != nil {
		return transaction, err
	}
	tType, err := getItensFromTag("TRNTYPE", stmttrn)
	if err != nil {
		return transaction, err
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
	transaction.Type = tType
	transaction.Id = id
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
//   - types.Bank: A Bank struct containing the parsed bank information.
func parseBankInfo(file string) (types.Bank, error) {

	var Bank types.Bank

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

	Bank.Name = name
	Bank.AccountId = accountId
	Bank.FId = fId
	Bank.BankId = bankId
	Bank.BranchId = branchId
	Bank.AccountType = accountType
	return Bank, nil
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

	statement.StartDate = dtStart
	statement.EndDate = dtEnd
	statement.BalanceDate = dtasof
	statement.ServerDate = dtserver
	statement.LedgerBalance = balamt
	statement.Language = language

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

	balItems := getArrayItensFromTag("BAL", fileString)
	var balances []types.Balance
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

		balances = append(balances, types.Balance{
			Name:    name,
			Desc:    desc,
			BalType: balType,
			Value:   floatValue,
		})
	}

	return balances
}
