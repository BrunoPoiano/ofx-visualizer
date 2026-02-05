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
	appRouters := router.AppRoutes(queries)

	println("Serving frontend")
	fs := http.FileServer(http.Dir("./frontend/dist"))
	appRouters.PathPrefix("/").Handler(fs)

	println("Serving on port 8247")
	log.Fatal(http.ListenAndServe("0.0.0.0:8247", handlers.CORS(router.HandleCors()...)(appRouters)))
}
