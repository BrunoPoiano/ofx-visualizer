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

// GetStatements retrieves a paginated list of statements based on provided search criteria and bank ID.
// @Summary Get statements by bank ID
// @Description Retrieves a paginated list of statements for a specific bank, allowing for filtering and ordering.
// @Param w http.ResponseWriter - The response writer
// @Param r *http.Request - The request object, containing the bank ID and query parameters
// @Return void
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
		order = "start_date"
	}

	direction := params.Get("direction")
	if direction == "" {
		direction = "DESC"
	}

	bank := params.Get("bank")
	if bank == "" {
		http.Error(w, "bank_id is required", http.StatusBadRequest)
		return
	}

	search := types.StatementSearch{
		DefaultSearch: types.DefaultSearch{
			CurrentPage: currentPage,
			PerPage:     perPage,
			Order:       order,
			Direction:   direction,
			Search:      params.Get("search"),
		},
		Bank:     bank,
		MinValue: params.Get("min_value"),
		MaxValue: params.Get("max_value"),
		From:     params.Get("from"),
		To:       params.Get("to"),
	}

	vars := mux.Vars(r)

	bankId, err := strconv.ParseInt(vars["bank_id"], 10, 64)
	if err != nil {
		http.Error(w, "bank_id is required", http.StatusBadRequest)
		return
	}

	items, totalItems, lastpage, err := StatementService.GetItems(database, search, bankId)

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

// GetStatementsInfo retrieves the largest and current balance information for a given bank ID.
// @Summary Get statements info by bank ID
// @Description Get the largest and current balance information for a specific bank.
// @Param w http.ResponseWriter - The response writer
// @Param r *http.Request - The request object, containing the bank ID
// @Return void
func GetStatementsInfo(w http.ResponseWriter, r *http.Request) {
	database := r.Context().Value("db").(*sql.DB)

	vars := mux.Vars(r)

	bankId, err := strconv.ParseInt(vars["bank_id"], 10, 64)
	if err != nil {
		http.Error(w, "bank_id is required", http.StatusBadRequest)
		return
	}

	largestBalance, currentBalance, err := StatementService.GetInfo(database, bankId)

	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	type ReturnType struct {
		LargestBalance types.Statement `json:"largestBalance"`
		CurrentBalance types.Statement `json:"currentBalance"`
	}

	json.NewEncoder(w).Encode(ReturnType{
		LargestBalance: largestBalance,
		CurrentBalance: currentBalance,
	})
}
