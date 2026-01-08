package sourceService

import (
	"context"
	"database/sql"
	"fmt"

	databaseSqlc "main/database/databaseSQL"
	BankService "main/services/bank"

	CardService "main/services/card"
	"main/services/utils"
	"main/types"
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

func GetItems(database *sql.DB) ([]types.ReturnSource, error) {
	var items []types.ReturnSource

	query := fmt.Sprintf(`SELECT source.id, cards.name
FROM source
JOIN cards ON cards.id = source.card_id
 UNION ALL
 SELECT source.id, banks.name
FROM source
JOIN banks ON banks.id = source.bank_id `)

	items, err := utils.MakeQueryCall(database, query, func(rows *sql.Rows) ([]types.ReturnSource, error) {
		var s []types.ReturnSource
		for rows.Next() {
			var item types.ReturnSource
			err := rows.Scan(&item.Id, &item.Name)
			if err != nil {
				return nil, err
			}
			s = append(s, item)
		}
		return s, rows.Err()
	})
	if err != nil {
		return nil, err
	}

	return items, nil
}
