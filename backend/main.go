package main

import (
	"log"
	"main/controller/transaction"
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
	router.HandleFunc("/transactions", middleware.DatabaseMiddleware(db, transaction.GetItems)).Methods("GET")
	log.Fatal(http.ListenAndServe(":8080", router))

}
