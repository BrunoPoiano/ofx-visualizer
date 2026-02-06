package databaseSQL

type StatementYields struct {
	Statement Statement `json:"statement"`
	Yields    []Balance `json:"yields"`
}
