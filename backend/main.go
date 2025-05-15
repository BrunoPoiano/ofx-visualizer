package main

import (
	"log"
	bancController "main/controller/banc"
	transactionController "main/controller/transaction"
	"main/database"
	"main/middleware"
	"net/http"

	_ "github.com/glebarez/go-sqlite"
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

	router.HandleFunc("/bancs", middleware.DatabaseMiddleware(db, bancController.GetItems)).Methods("GET")

	log.Fatal(http.ListenAndServe(":8080", router))

}
