package sourceService

import (
	"database/sql"

	databaseSqlc "main/database/databaseSQL"
)

func returnSourceParams(bankId, cardId int) databaseSqlc.FindSourceParams {
	return databaseSqlc.FindSourceParams{
		BankID: sql.NullInt64{
			Int64: int64(bankId),
			Valid: bankId > 0,
		},
		CardID: sql.NullInt64{
			Int64: int64(cardId),
			Valid: cardId > 0,
		},
	}
}
