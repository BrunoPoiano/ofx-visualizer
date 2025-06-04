package BalanceController

import (
	"database/sql"
	"encoding/json"
	BalanceService "main/services/balance"
	"main/types"
	"net/http"
	"strconv"

	"github.com/gorilla/mux"
)

// GetBalances handles the retrieval of balances from the database with pagination and sorting.
// @Summary Get balances
// @Description Retrieves a paginated list of balances, allowing for sorting and searching.
// @Param w http.ResponseWriter - The response writer
// @Param r *http.Request - The request object, containing pagination, sorting, and search parameters
// @Param statement_id path int true "Statement ID"
// @Return 200 {object} types.ReturnPagination
func GetBalances(w http.ResponseWriter, r *http.Request) {
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

	statementId, err := strconv.ParseInt(vars["statement_id"], 10, 64)
	if err != nil {
		statementId = 0
	}

	items, totalItems, lastpage, err := BalanceService.GetItems(database, DefaultSearch, statementId)

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
