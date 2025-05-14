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
