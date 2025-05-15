package types

type Transaction struct {
	Id     string
	BancId int
	Date   string
	Type   string
	Value  float64
	Desc   string
}

type Banc struct {
	Id        int
	Name      string
	AccountId string
}

type ReturnPagination struct {
	Data        any `json:"items"`
	Total       int `json:"totalItems"`
	CurrentPage int `json:"currentPage"`
	PerPage     int `json:"perPage"`
}
