package main

import (
	"fmt"
	"log"
	"main/controller/transaction"
	"main/database"
	"net/http"

	_ "github.com/glebarez/go-sqlite"
)

func main() {
	http.HandleFunc("/", handler)
	log.Fatal(http.ListenAndServe(":8080", nil))
}

func handler(w http.ResponseWriter, r *http.Request) {
	db, err := database.ConnectDatabase()
	if err != nil {
		println(err.Error())
		return
	}

	transactionsInfo, err := transaction.GetItems(db)
	if err != nil {
		println(err.Error())
		return
	}

	fmt.Fprint(w, "hello world", transactionsInfo)
	defer db.Close()

}

/*
func main() {

	db, err := database.ConnectDatabase()
	if err != nil {
		println(err.Error())
		return
	}

	//table, err := csv.ParseCsv("./NU_248402601_01ABR2025_30ABR2025.csv")
	transactionsInfo, bancInfo, err := ofx.ParseOfx("./NU_248402601_01ABR2025_30ABR2025.ofx")
	//transactionsInfo, err := transaction.GetItems(db)
	if err != nil {
		println(err.Error())
		return
	}

	for _, item := range transactionsInfo {
		value := fmt.Sprintf("%.2f", item.Value)
		println(item.Id, value, item.Type)
	}

	print(bancInfo.Name, bancInfo.AccountId)

	transaction.InsertItems(transactionsInfo, db)
	banc.InsertItems(bancInfo, db)
	defer db.Close()

}
*/
