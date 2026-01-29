package BalanceController

import (
	"encoding/json"
	"net/http"
	"strconv"

	"main/database/databaseSQL"
	BalanceService "main/services/balance"
	"main/types"

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
	queries := r.Context().Value("queries").(*databaseSQL.Queries)

	params := r.URL.Query()
	DefaultSearch := ParseUrlValues(params)

	vars := mux.Vars(r)

	statementId, err := strconv.ParseInt(vars["statement_id"], 10, 64)
	if err != nil {
		statementId = 0
	}

	items, totalItems, lastpage, err := BalanceService.GetItems(queries, r.Context(), DefaultSearch, statementId)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	json.NewEncoder(w).Encode(types.ReturnPagination{
		Data:        items,
		Total:       totalItems,
		LastPage:    lastpage,
		CurrentPage: int(DefaultSearch.CurrentPage),
		PerPage:     int(DefaultSearch.PerPage),
	})
}
