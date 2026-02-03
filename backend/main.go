package main

import (
	"context"
	"log"
	"net/http"

	"main/database"
	"main/router"

	_ "github.com/glebarez/go-sqlite"
	"github.com/gorilla/handlers"
)

func main() {
	println("Connecting to database")
	ctx := context.Background()
	database, queries, err := database.ConnectDatabase(ctx)
	if err != nil {
		println(err.Error())
		return
	}
	defer database.Close()
	router := router.AppRoutes(queries)

	println("Serving frontend")
	fs := http.FileServer(http.Dir("./frontend/dist"))
	router.PathPrefix("/").Handler(fs)

	println("Serving on port 8247")
	log.Fatal(http.ListenAndServe("0.0.0.0:8247", handlers.CORS(handleCors()...)(router)))
}

func handleCors() []handlers.CORSOption {
	return []handlers.CORSOption{
		handlers.AllowedHeaders([]string{
			"X-Requested-With",
			"Content-Type",
			"Authorization",
			"Accept",
		}),
		handlers.AllowedOrigins([]string{"*"}),
		handlers.AllowedMethods([]string{"GET", "HEAD", "POST", "PUT", "OPTIONS"}),
		handlers.AllowCredentials(),
		handlers.ExposedHeaders([]string{"Content-Length", "Content-Type"}),
	}
}
