package BankController

import (
	"encoding/json"
	"errors"
	"io"

	databaseSqlc "main/database/databaseSQL"
)

func ParseUpdateBody(body io.ReadCloser) (databaseSqlc.Bank, error) {
	var bankBody databaseSqlc.Bank

	reqBody, err := io.ReadAll(body)
	defer body.Close()
	if err != nil {
		return bankBody, err
	}

	err = json.Unmarshal(reqBody, &bankBody)
	if err != nil {
		return bankBody, err
	}
	if bankBody.Name == "" {
		return bankBody, errors.New("Name field is required")
	}

	return bankBody, nil
}
