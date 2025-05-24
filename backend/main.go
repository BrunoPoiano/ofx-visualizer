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

	println("Connecting to database")
	db, err := database.ConnectDatabase()
	if err != nil {
		println(err.Error())
		return
	}
	defer db.Close()

	println("Running migrations")
	database.RunMigrations(db)
	router := router.AppRoutes(db)

	println("Serving frontend")
	fs := http.FileServer(http.Dir("./frontend/dist"))
	router.PathPrefix("/").Handler(fs)

	println("Serving on port 8247")
	log.Fatal(http.ListenAndServe("0.0.0.0:8247", handlers.CORS(handleCors())(router)))

}

func handleCors() (handlers.CORSOption, handlers.CORSOption, handlers.CORSOption) {
	headers := handlers.AllowedHeaders([]string{"X-Requested-With"})
	origins := handlers.AllowedOrigins([]string{"*"})
	methods := handlers.AllowedMethods([]string{"GET", "HEAD", "POST", "PUT", "OPTIONS"})

	return headers, origins, methods
}
