package types

type Transaction struct {
	Id     string  `json:"id"`
	BankId int     `json:"bank_id"`
	Date   string  `json:"date"`
	Type   string  `json:"type"`
	Value  float64 `json:"value"`
	Desc   string  `json:"desc"`
}

type Bank struct {
	Id        int    `json:"id"`
	Name      string `json:"name"`
	AccountId string `json:"account_id"`
}

type ReturnPagination struct {
	Data        any `json:"data"`
	Total       int `json:"total_items"`
	CurrentPage int `json:"current_page"`
	PerPage     int `json:"per_page"`
}
