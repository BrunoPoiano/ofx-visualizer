package types

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
	MinValue int64
	MaxValue int64
	From     string
	To       string
	Type     TransactionType
	SourceId int64
}
