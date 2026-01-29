package StatementsController

import (
	"encoding/json"
	"net/http"
	"strconv"

	"main/database/databaseSQL"
	databaseSqlc "main/database/databaseSQL"
	StatementService "main/services/statement"
	"main/types"

	"github.com/gorilla/mux"
)

// GetStatements retrieves a paginated list of statements based on provided search criteria and bank ID.
// @Summary Get statements by bank ID
// @Description Retrieves a paginated list of statements for a specific bank, allowing for filtering and ordering.
// @Param w http.ResponseWriter - The response writer
// @Param r *http.Request - The request object, containing the bank ID and query parameters
// @Return void
func GetStatements(w http.ResponseWriter, r *http.Request) {
	queries := r.Context().Value("queries").(*databaseSQL.Queries)
	params := r.URL.Query()

	search := ParseUrlValues(params)

	if search.SourceId == 0 {
		http.Error(w, "source_id is required", http.StatusBadRequest)
		return
	}

	items, totalItems, lastpage, err := StatementService.GetItems(queries, r.Context(), search)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	json.NewEncoder(w).Encode(types.ReturnPagination{
		Data:        items,
		Total:       totalItems,
		LastPage:    lastpage,
		CurrentPage: int(search.CurrentPage),
		PerPage:     int(search.PerPage),
	})
}

type ReturnType struct {
	LargestBalance databaseSqlc.Statement `json:"largestBalance"`
	CurrentBalance databaseSqlc.Statement `json:"currentBalance"`
}

// GetStatementsInfo retrieves the largest and current balance information for a given bank ID.
// @Summary Get statements info by bank ID
// @Description Get the largest and current balance information for a specific bank.
// @Param w http.ResponseWriter - The response writer
// @Param r *http.Request - The request object, containing the bank ID
// @Return void
func GetStatementsInfo(w http.ResponseWriter, r *http.Request) {
	queries := r.Context().Value("queries").(*databaseSQL.Queries)
	vars := mux.Vars(r)

	bankId, err := strconv.ParseInt(vars["bank_id"], 10, 64)
	if err != nil {
		http.Error(w, "bank_id is required", http.StatusBadRequest)
		return
	}

	largestBalance, currentBalance, err := StatementService.GetInfo(queries, r.Context(), bankId)
	if err != nil {
		http.Error(w, "Error getting balance", http.StatusInternalServerError)
		return
	}

	json.NewEncoder(w).Encode(ReturnType{
		LargestBalance: largestBalance,
		CurrentBalance: currentBalance,
	})
}
