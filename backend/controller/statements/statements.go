package StatementsController

import (
	"database/sql"
	"encoding/json"
	StatementService "main/services/statement"
	"main/types"
	"net/http"
	"strconv"

	"github.com/gorilla/mux"
)

func GetStatements(w http.ResponseWriter, r *http.Request) {
	database := r.Context().Value("db").(*sql.DB)

	params := r.URL.Query()

	currentPage, err := strconv.ParseInt(params.Get("current_page"), 10, 64)
	if err != nil {
		currentPage = 1
	}

	perPage, err := strconv.ParseInt(params.Get("per_page"), 10, 64)
	if err != nil {
		perPage = 5
	}

	order := params.Get("order")
	if order == "" {
		order = "id"
	}

	direction := params.Get("direction")
	if direction == "" {
		direction = "ASC"
	}

	DefaultSearch := types.DefaultSearch{
		CurrentPage: currentPage,
		PerPage:     perPage,
		Order:       order,
		Direction:   direction,
		Search:      params.Get("search"),
	}

	vars := mux.Vars(r)

	bankId, err := strconv.ParseInt(vars["bank_id"], 10, 64)
	if err != nil {
		bankId = 0
	}

	items, totalItems, lastpage, err := StatementService.GetItems(database, DefaultSearch, bankId)

	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	response := types.ReturnPagination{
		Data:        items,
		Total:       totalItems,
		LastPage:    lastpage,
		CurrentPage: int(currentPage),
		PerPage:     int(perPage),
	}

	json.NewEncoder(w).Encode(response)
}
