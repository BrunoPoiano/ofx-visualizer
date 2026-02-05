package router

import (
	BalanceController "main/controller/balance"
	BankController "main/controller/bank"
	SourceController "main/controller/source"
	StatementsController "main/controller/statements"
	TransactionController "main/controller/transaction"
	"main/middleware"

	databaseSqlc "main/database/databaseSQL"

	"github.com/gorilla/mux"
)

func AppRoutes(queries *databaseSqlc.Queries) *mux.Router {
	router := mux.NewRouter()

	router.Use(middleware.DatabaseMiddleware(queries))

	transactions(router)
	source(router)
	balances(router)
	banks(router)
	statements(router)

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
	router.HandleFunc("/statements", StatementsController.GetStatements).Methods("GET")
	router.HandleFunc("/statements/{source_id}/info", middleware.CheckSourceExists(StatementsController.GetStatementsInfo)).Methods("GET")
}

func balances(router *mux.Router) {
	router.HandleFunc("/balances", BalanceController.GetBalances).Methods("GET")
	router.HandleFunc("/balances/{statement_id}", middleware.CheckStatementExists(BalanceController.GetBalances)).Methods("GET")
}
