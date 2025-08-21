package router

import (
	"database/sql"
	BalanceController "main/controller/balance"
	BankController "main/controller/bank"
	StatementsController "main/controller/statements"
	TransactionController "main/controller/transaction"
	"main/middleware"

	"github.com/gorilla/mux"
)

func AppRoutes(db *sql.DB) *mux.Router {

	router := mux.NewRouter()

	transactions(db, router)
	statements(db, router)
	balances(db, router)
	banks(db, router)

	return router
}

func transactions(db *sql.DB, router *mux.Router) {

	router.HandleFunc("/transactions", middleware.DatabaseMiddleware(db, TransactionController.GetItems)).Methods("GET")
	router.HandleFunc("/transactions", middleware.DatabaseMiddleware(db, TransactionController.InsertItems)).Methods("POST")
	router.HandleFunc("/transactions/info", middleware.DatabaseMiddleware(db, TransactionController.GetTransactionInfos)).Methods("GET")
	router.HandleFunc("/transaction/{bank_id}", middleware.DatabaseMiddleware(db, TransactionController.DeleteTransactions)).Methods("DELETE")
}

func banks(db *sql.DB, router *mux.Router) {
	router.HandleFunc("/banks", middleware.DatabaseMiddleware(db, BankController.GetItems)).Methods("GET")
	router.HandleFunc("/banks", middleware.DatabaseMiddleware(db, BankController.UpdateItems)).Methods("PUT")
}

func statements(db *sql.DB, router *mux.Router) {
	router.HandleFunc("/statements", middleware.DatabaseMiddleware(db, StatementsController.GetStatements)).Methods("GET")
	router.HandleFunc("/statements/{bank_id}", middleware.DatabaseMiddleware(db, StatementsController.GetStatements)).Methods("GET")
	router.HandleFunc("/statements/{bank_id}/info", middleware.DatabaseMiddleware(db, StatementsController.GetStatementsInfo)).Methods("GET")
}

func balances(db *sql.DB, router *mux.Router) {
	router.HandleFunc("/balances", middleware.DatabaseMiddleware(db, BalanceController.GetBalances)).Methods("GET")
	router.HandleFunc("/balances/{statement_id}", middleware.DatabaseMiddleware(db, BalanceController.GetBalances)).Methods("GET")
}
