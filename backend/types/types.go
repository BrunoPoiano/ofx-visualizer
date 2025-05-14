package types

type Transaction struct {
	Id    string
	Date  string
	Type  string
	Value float64
	Desc  string
}

type Banc struct {
	Id        int64
	Name      string
	AccountId string
}

type TransactionPagination struct {
	Data        []Transaction `json:"items"`
	Total       string        `json:"totalItems"`
	CurrentPage int64         `json:"currentPage"`
	PerPage     int64         `json:"perPage"`
}
