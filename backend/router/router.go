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

	transactions(queries, router)
	statements(queries, router)
	balances(queries, router)
	banks(queries, router)
	source(queries, router)

	return router
}

func transactions(queries *databaseSqlc.Queries, router *mux.Router) {
	router.HandleFunc("/transactions", middleware.DatabaseMiddleware(queries, TransactionController.GetItems)).Methods("GET")
	router.HandleFunc("/transactions", middleware.DatabaseMiddleware(queries, TransactionController.InsertItems)).Methods("POST")
	router.HandleFunc("/transactions/info", middleware.DatabaseMiddleware(queries, TransactionController.GetTransactionInfos)).Methods("GET")
	router.HandleFunc("/transaction/{bank_id}", middleware.DatabaseMiddleware(queries, TransactionController.DeleteTransactions)).Methods("DELETE")
}

func banks(queries *databaseSqlc.Queries, router *mux.Router) {
	router.HandleFunc("/banks", middleware.DatabaseMiddleware(queries, BankController.GetItems)).Methods("GET")
	router.HandleFunc("/banks/{bank_id}", middleware.DatabaseMiddleware(queries, BankController.UpdateItems)).Methods("PUT")
}

func source(queries *databaseSqlc.Queries, router *mux.Router) {
	router.HandleFunc("/source", middleware.DatabaseMiddleware(queries, SourceController.GetItems)).Methods("GET")
}

func statements(queries *databaseSqlc.Queries, router *mux.Router) {
	router.HandleFunc("/statements", middleware.DatabaseMiddleware(queries, StatementsController.GetStatements)).Methods("GET")
	router.HandleFunc("/statements/{bank_id}", middleware.DatabaseMiddleware(queries, StatementsController.GetStatements)).Methods("GET")
	router.HandleFunc("/statements/{bank_id}/info", middleware.DatabaseMiddleware(queries, StatementsController.GetStatementsInfo)).Methods("GET")
}

func balances(queries *databaseSqlc.Queries, router *mux.Router) {
	router.HandleFunc("/balances", middleware.DatabaseMiddleware(queries, BalanceController.GetBalances)).Methods("GET")
	router.HandleFunc("/balances/{statement_id}", middleware.DatabaseMiddleware(queries, BalanceController.GetBalances)).Methods("GET")
}
