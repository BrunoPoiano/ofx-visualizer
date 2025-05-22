package main

import (
	"log"
	"main/database"
	"main/router"
	"net/http"

	_ "github.com/glebarez/go-sqlite"
	"github.com/gorilla/handlers"
)

func main() {

	db, err := database.ConnectDatabase()
	if err != nil {
		println(err.Error())
		return
	}
	defer db.Close()

	database.RunMigrations(db)
	router := router.AppRoutes(db)
	fs := http.FileServer(http.Dir("./frontend/dist"))
	router.PathPrefix("/").Handler(fs)

	log.Fatal(http.ListenAndServe(":8080", handlers.CORS(handleCors())(router)))

}

func handleCors() (handlers.CORSOption, handlers.CORSOption, handlers.CORSOption) {
	headers := handlers.AllowedHeaders([]string{"X-Requested-With"})
	origins := handlers.AllowedOrigins([]string{"http://localhost:5173"})
	methods := handlers.AllowedMethods([]string{"GET", "HEAD", "POST", "PUT", "OPTIONS"})

	return headers, origins, methods
}
