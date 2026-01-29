package sourceService

import databaseSqlc "main/database/databaseSQL"

func returnSourceParams(bankId, cardId int) databaseSqlc.FindSourceParams {
	if bankId == 0 {
		return databaseSqlc.FindSourceParams{
			BankID: nil,
			CardID: cardId,
		}
	}

	return databaseSqlc.FindSourceParams{
		BankID: bankId,
		CardID: nil,
	}
}
