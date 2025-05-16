package main

import (
	"log"
	BankController "main/controller/bank"
	transactionController "main/controller/transaction"
	"main/database"
	"main/middleware"
	"net/http"

	_ "github.com/glebarez/go-sqlite"
	"github.com/gorilla/handlers"
	"github.com/gorilla/mux"
)

func main() {

	db, err := database.ConnectDatabase()
	if err != nil {
		println(err.Error())
		return
	}

	database.RunMigrations(db)
	defer db.Close()

	router := mux.NewRouter()
	router.HandleFunc("/transactions", middleware.DatabaseMiddleware(db, transactionController.GetItems)).Methods("GET")
	router.HandleFunc("/transactions", middleware.DatabaseMiddleware(db, transactionController.InsertItems)).Methods("POST")

	router.HandleFunc("/Banks", middleware.DatabaseMiddleware(db, BankController.GetItems)).Methods("GET")

	log.Fatal(http.ListenAndServe(":8080", handlers.CORS(handleCors())(router)))

}

func handleCors() (handlers.CORSOption, handlers.CORSOption, handlers.CORSOption) {
	headers := handlers.AllowedHeaders([]string{"X-Requested-With"})
	origins := handlers.AllowedOrigins([]string{"http://localhost:5173"})
	methods := handlers.AllowedMethods([]string{"GET", "HEAD", "POST", "PUT", "OPTIONS"})

	return headers, origins, methods
}
