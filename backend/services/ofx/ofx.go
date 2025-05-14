package ofx

import (
	"fmt"
	"main/types"
	"os"
	"regexp"
	"strconv"
	"strings"
	"time"
)

func ParseOfx(filepath string) ([]types.Transaction, types.Banc, error) {

	file, err := os.ReadFile(filepath)
	if err != nil {
		return nil, types.Banc{}, err
	}

	var lines []types.Transaction

	stmttrn := getItensFromTag("STMTTRN", string(file))
	banc := parseBancInfo(string(file))
	for _, item := range stmttrn {
		line := parseSTMTTRNIntoTransaction(item)
		lines = append(lines, line)
	}

	return lines, banc, nil
}

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

func parseBancInfo(file string) types.Banc {

	var banc types.Banc

	banc.Name = getItensFromTag("ORG", file)[0]
	banc.AccountId = getItensFromTag("ACCTID", file)[0]

	return banc

}
