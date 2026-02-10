package StatementController

import (
	"encoding/json"
	"net/http"

	databaseSqlc "main/database/databaseSQL"
	StatementService "main/services/statement"
	"main/types"
)

// GetStatements retrieves a paginated list of statements based on provided search criteria and bank ID.
// @Summary Get statements by bank ID
// @Description Retrieves a paginated list of statements for a specific bank, allowing for filtering and ordering.
// @Param w http.ResponseWriter - The response writer
// @Param r *http.Request - The request object, containing the bank ID and query parameters
// @Return void
func GetStatements(w http.ResponseWriter, r *http.Request) {
	search, err := ParseUrlValues(r.URL.Query())
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	items, totalItems, lastpage, err := StatementService.GetItems(r.Context(), search)
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
	largestBalance, currentBalance, err := StatementService.GetInfo(r.Context())
	if err != nil {
		http.Error(w, "Error getting balance", http.StatusInternalServerError)
		return
	}

	json.NewEncoder(w).Encode(ReturnType{
		LargestBalance: largestBalance,
		CurrentBalance: currentBalance,
	})
}
