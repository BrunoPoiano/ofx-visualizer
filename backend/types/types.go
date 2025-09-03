package types

type Transaction struct {
	Id       string          `json:"id"`
	SourceId int             `json:"source_id"`
	Date     string          `json:"date"`
	Type     TransactionType `json:"type"`
	Value    float64         `json:"value"`
	Desc     string          `json:"desc"`
}

type Bank struct {
	Id          int         `json:"id"`
	Name        string      `json:"name"`
	AccountId   string      `json:"account_id"`
	AccountType AccountType `json:"account_type"`
	FId         string      `json:"f_id"`
	BankId      string      `json:"bank_id"`
	BranchId    string      `json:"branch_id"`
}

type ReturnPagination struct {
	Data        any `json:"data"`
	Total       int `json:"total_items"`
	LastPage    int `json:"last_page"`
	CurrentPage int `json:"current_page"`
	PerPage     int `json:"per_page"`
}

type ReturnTransactionInfo struct {
	Positive float64 `json:"positive"`
	Negative float64 `json:"negative"`
	Value    float64 `json:"value"`
}

type Statement struct {
	Id            int       `json:"id"`
	SourceId      int       `json:"source_id"`
	StartDate     string    `json:"start_date"`
	EndDate       string    `json:"end_date"`
	LedgerBalance float64   `json:"ledger_balance"`
	BalanceDate   string    `json:"balance_date"`
	ServerDate    string    `json:"server_date"`
	Language      string    `json:"language"`
	Yields        []Balance `json:"yields"`
}

type Balance struct {
	Id          int     `json:"id"`
	StatementId int     `json:"statement_id"`
	Name        string  `json:"name"`
	Desc        string  `json:"desc"`
	BalType     string  `json:"bal_type"`
	Value       float64 `json:"value"`
}

type Card struct {
	Id        int    `json:"id"`
	AccountId string `json:"account_id"`
	Name      string `json:"name"`
	FId       string `json:"f_id"`
}

type Source struct {
	Id     int    `json:"id"`
	CardId string `json:"card_id"`
	BankId string `json:"bank_id"`
}

type ReturnSource struct {
	Id   int    `json:"id"`
	Name string `json:"name"`
}

type DefaultSearch struct {
	CurrentPage int64
	PerPage     int64
	Direction   string
	Order       string
	Search      string
}

type StatementSearch struct {
	DefaultSearch
	From     string
	To       string
	MinValue string
	MaxValue string
	SourceId string
}

type TransactionSearch struct {
	DefaultSearch
	MinValue string
	MaxValue string
	From     string
	To       string
	Type     TransactionType
	SourceId string
}
