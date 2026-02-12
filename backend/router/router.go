package router

import (
	BankController "main/controller/bank"
	SourceController "main/controller/source"
	StatementController "main/controller/statement"
	TagController "main/controller/tag"
	TransactionController "main/controller/transaction"
	databaseSqlc "main/database/databaseSQL"
	"main/middleware"

	"github.com/gorilla/mux"
)

func AppRoutes(queries *databaseSqlc.Queries) *mux.Router {
	router := mux.NewRouter()

	router.Use(middleware.DatabaseMiddleware(queries))

	transactions(router)
	source(router)
	banks(router)
	statements(router)
	tags(router)

	return router
}

func transactions(router *mux.Router) {
	router.HandleFunc("/transactions", TransactionController.GetItems).Methods("GET")
	router.HandleFunc("/transactions", TransactionController.InsertItems).Methods("POST")
	router.HandleFunc("/transactions/info", TransactionController.GetTransactionInfos).Methods("GET")
}

func banks(router *mux.Router) {
	router.HandleFunc("/banks", BankController.GetItems).Methods("GET")
	router.HandleFunc("/banks/{bank_id}", middleware.CheckBankExists(BankController.UpdateItems)).Methods("PUT")
	router.HandleFunc("/banks/{bank_id}", middleware.CheckBankExists(BankController.DeleteItem)).Methods("DELETE")
}

func source(router *mux.Router) {
	router.HandleFunc("/source", SourceController.GetItems).Methods("GET")
}

func statements(router *mux.Router) {
	router.HandleFunc("/statements", StatementController.GetStatements).Methods("GET")
	router.HandleFunc("/statements/{source_id}/info", middleware.CheckSourceExists(StatementController.GetStatementsInfo)).Methods("GET")
}

func tags(router *mux.Router) {
	router.HandleFunc("/tags", TagController.GetItems).Methods("GET")
	router.HandleFunc("/tags", TagController.InsertItems).Methods("POST")
	router.HandleFunc("/tags/{tag_id}", middleware.CheckTagExists(TagController.DeleteItem)).Methods("DELETE")
}
