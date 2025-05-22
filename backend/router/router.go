package router

import (
	"database/sql"
	BankController "main/controller/bank"
	transactionController "main/controller/transaction"
	"main/middleware"

	"github.com/gorilla/mux"
)

func AppRoutes(db *sql.DB) *mux.Router {

	router := mux.NewRouter()
	router.HandleFunc("/transactions", middleware.DatabaseMiddleware(db, transactionController.GetItems)).Methods("GET")
	router.HandleFunc("/transactions", middleware.DatabaseMiddleware(db, transactionController.InsertItems)).Methods("POST")
	router.HandleFunc("/transactions_info", middleware.DatabaseMiddleware(db, transactionController.GetTransactionInfos)).Methods("GET")
	router.HandleFunc("/transaction/{bank_id}", middleware.DatabaseMiddleware(db, transactionController.DeleteTransactions)).Methods("DELETE")

	router.HandleFunc("/banks", middleware.DatabaseMiddleware(db, BankController.GetItems)).Methods("GET")

	return router
}
