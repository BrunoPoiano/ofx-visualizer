package sourceService

import (
	"database/sql"
	"fmt"
	BankService "main/services/bank"
	CardService "main/services/card"
	"main/services/utils"
	"main/types"
)

func InsertItem(database *sql.DB, bank types.Bank, card types.Card) (int, error) {

	err := fmt.Errorf("")
	bankId := int(0)
	cardId := int(0)

	if bank.FId != "" {
		bankId, err = BankService.InsertItems(database, bank)
		if err != nil {
			return 0, err
		}
	}

	if card.FId != "" {
		cardId, err = CardService.InsertItems(database, card)
		if err != nil {
			return 0, err
		}
	}

	var id int
	total, err := database.Query("SELECT id FROM source WHERE bank_id = ? AND card_id = ? OR bank_id = ? AND card_id = ?", bankId, 0, 0, cardId)
	if err != nil {
		return 0, err
	}
	defer total.Close()

	if err := total.Err(); err != nil {
		return 0, err
	}
	for total.Next() {
		total.Scan(&id)
	}

	if id != 0 {
		return id, nil
	}

	src, err := database.Prepare("INSERT INTO source(bank_id,card_id) values(?,?)")
	if err != nil {
		return 0, err
	}

	result, err := src.Exec(bankId, cardId)
	if err != nil {
		return 0, err
	}

	lastId, err := result.LastInsertId()
	if err != nil {
		return 0, err
	}

	return int(lastId), nil

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
