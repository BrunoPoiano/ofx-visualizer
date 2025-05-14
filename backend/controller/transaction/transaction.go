package transaction

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"log"
	"main/types"
	"net/http"
	"strconv"
)

func InsertItems(items []types.Transaction, db *sql.DB) {

	stmt, err := db.Prepare("INSERT INTO transactions(id,date,value,desc,type) values(?,?,?,?,?)")
	if err != nil {
		return
	}

	for _, item := range items {
		_, err = stmt.Exec(item.Id, item.Date, item.Value, item.Desc, item.Type)
	}

}

func GetItems(w http.ResponseWriter, r *http.Request) {
	database := r.Context().Value("db").(*sql.DB)
	params := r.URL.Query()

	currentPage, err := strconv.ParseInt(params.Get("currentPage"), 10, 64)
	if err != nil {
		currentPage = 1
	}

	perPage, err := strconv.ParseInt(params.Get("perPage"), 10, 64)
	if err != nil {
		perPage = 5
	}

	offset := perPage * (currentPage - 1)

	query := fmt.Sprintf("SELECT * FROM transactions LIMIT %v OFFSET %v", perPage, offset)

	rows, err := database.Query(query)
	if err != nil {
		log.Println(err)
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	var totalItems string
	total, _ := database.Query("SELECT count(id) as totalItems FROM transactions")
	for total.Next() {
		total.Scan(&totalItems)
	}

	defer rows.Close()

	var items []types.Transaction

	for rows.Next() {
		var item types.Transaction
		if err := rows.Scan(&item.Id, &item.Date, &item.Value, &item.Type, &item.Desc); err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		items = append(items, item)
	}

	if err := rows.Err(); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	response := types.TransactionPagination{
		Data:        items,
		Total:       totalItems,
		CurrentPage: currentPage,
		PerPage:     perPage,
	}

	json.NewEncoder(w).Encode(response)

}
