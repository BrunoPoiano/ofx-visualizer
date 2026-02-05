package sourceService

import (
	"context"

	"main/database/databaseSQL"
	databaseSqlc "main/database/databaseSQL"
	BankService "main/services/bank"
	"main/services/utils"

	CardService "main/services/card"
)

func InsertItem(ctx context.Context, bank databaseSqlc.CreateBankParams, card databaseSqlc.CreateCardParams) (int, error) {
	var bankId int
	var cardId int
	var err error

	queries := ctx.Value("queries").(*databaseSQL.Queries)

	if utils.InterfaceToString(bank.FID) != "" {
		bankId, err = BankService.InsertItems(ctx, bank)
		if err != nil {
			return 0, err
		}
	} else if utils.InterfaceToString(card.FID) != "" {
		cardId, err = CardService.InsertItems(ctx, card)
		if err != nil {
			return 0, err
		}
	}

	params := returnSourceParams(bankId, cardId)
	sourceID, _ := queries.FindSource(ctx, params)

	if sourceID > 0 {
		return int(sourceID), nil
	}

	newSource, err := queries.CreateSource(ctx, databaseSqlc.CreateSourceParams{
		CardID: params.CardID,
		BankID: params.BankID,
	})
	if err != nil {
		return 0, err
	}

	return int(newSource.ID), nil
}

func GetItems(ctx context.Context) ([]databaseSqlc.GetSourcesRow, error) {
	queries := ctx.Value("queries").(*databaseSQL.Queries)

	return queries.GetSources(ctx)
}

func nullableInt(v int) interface{} {
	if v == 0 {
		return nil
	}
	return v
}
