package main

import (
	"fmt"
	moviments "main/controller"
	"main/database"
	csv "main/services"

	_ "github.com/glebarez/go-sqlite"
)

func main() {

	db, err := database.ConnectDatabase()
	if err != nil {
		return
	}
	defer db.Close()

	table, err := csv.ParseCsv("./NU_248402601_01ABR2025_30ABR2025.csv")
	if err != nil {
		return
	}

	for _, item := range table {
		value := fmt.Sprintf("%.2f", item.Value)
		println(item.Id, value, item.Date)
	}

	moviments.InsetItems(table, db)

}
