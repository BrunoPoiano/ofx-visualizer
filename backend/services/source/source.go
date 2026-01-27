package sourceService

import (
	"context"
	"fmt"

	databaseSqlc "main/database/databaseSQL"
	BankService "main/services/bank"

	CardService "main/services/card"
)

func InsertItem(queries *databaseSqlc.Queries, ctx context.Context, bank databaseSqlc.CreateBankParams, card databaseSqlc.CreateCardParams) (int, error) {
	err := fmt.Errorf("")
	bankId := int(0)
	cardId := int(0)

	if bank.FID != "" {
		bankId, err = BankService.InsertItems(queries, ctx, bank)
		if err != nil {
			return 0, err
		}
	}

	if card.FID != "" {
		cardId, err = CardService.InsertItems(queries, ctx, card)
		if err != nil {
			return 0, err
		}
	}

	ids := databaseSqlc.FindSourceParams{
		BankID: bankId,
		CardID: cardId,
	}

	sourceID, err := queries.FindSource(ctx, ids)
	if err != nil {
		return 0, err
	}

	if sourceID > 0 {
		return int(sourceID), nil
	}

	newSource, err := queries.CreateSource(ctx, databaseSqlc.CreateSourceParams{
		BankID: bankId,
		CardID: cardId,
	})
	if err != nil {
		return 0, err
	}

	return int(newSource.ID), nil
}

func GetItems(queries *databaseSqlc.Queries, ctx context.Context) ([]databaseSqlc.GetSourcesRow, error) {
	return queries.GetSources(ctx)
}
