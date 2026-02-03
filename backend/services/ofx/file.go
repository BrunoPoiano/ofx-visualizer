package ofxService

import (
	"context"
	"mime/multipart"
	"strings"

	"main/database/databaseSQL"
	BalanceService "main/services/balance"
	sourceService "main/services/source"
	StatementService "main/services/statement"
	transactionService "main/services/transaction"
	"main/types"
)

func FileReader(files []*multipart.FileHeader, queries *databaseSQL.Queries, ctx context.Context) error {
	for _, fileHeader := range files {
		file, err := fileHeader.Open()
		if err != nil {
			return err
		}
		defer file.Close()

		if !strings.Contains(fileHeader.Filename, ".ofx") {
			return types.InvalidOfx
		}

		transactions, statement, Bank, Card, err := ParseOfx(file)
		if err != nil {
			return types.ErrorParsingFile
		}

		SourceId, err := sourceService.InsertItem(queries, ctx, Bank, Card)
		if err != nil {
			return types.ErrorSavingFileSource
		}

		err = transactionService.InsertTransaction(queries, ctx, transactions, SourceId)
		if err != nil {
			return types.ErrorSavingTransaction
		}

		StatementId, err := StatementService.InsertItems(queries, ctx, statement, SourceId)
		if err != nil {
			return types.ErrorSavingStatement
		}

		for _, item := range statement.Yields {
			err = BalanceService.InsertItems(queries, ctx, databaseSQL.CreateBalanceParams{
				StatementID: item.StatementID,
				Name:        item.Name,
				Description: item.Description,
				BalanceType: item.BalanceType,
				Value:       item.Value,
			}, StatementId)
			if err != nil {
				return types.ErrorSavingYields
			}
		}
	}

	return nil
}
