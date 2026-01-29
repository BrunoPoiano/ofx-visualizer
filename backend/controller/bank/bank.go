package BankController

import (
	"encoding/json"
	"io"
	"net/http"
	"strconv"

	"main/database/databaseSQL"
	BankService "main/services/bank"
	"main/services/utils"
	"main/types"

	databaseSqlc "main/database/databaseSQL"

	"github.com/gorilla/mux"
)

// GetItems retrieves a paginated list of bank records.
// @Summary Get banks with pagination
// @Description Fetches bank records from the database using provided pagination parameters.
// @Param w http.ResponseWriter - The http.ResponseWriter used to write the response.
// @Param r *http.Request - The http.Request containing the URL query parameters.
// @Return void
func GetItems(w http.ResponseWriter, r *http.Request) {
	queries := r.Context().Value("queries").(*databaseSQL.Queries)
	params := r.URL.Query()

	values := utils.CheckRequestParams[databaseSqlc.ListBanksParams](params)
	items, totalItems, lastPage, err := BankService.GetItems(queries, r.Context(), values)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	json.NewEncoder(w).Encode(types.ReturnPagination{
		Data:        items,
		Total:       totalItems,
		CurrentPage: int(values.Offset),
		PerPage:     int(values.Limit),
		LastPage:    lastPage,
	})
}

// UpdateItems updates the details of a specific bank record.
// @Summary Update bank by ID
// @Description Updates an existing bank record using the ID from the URL path and details from the request body.
// @Param w http.ResponseWriter - The http.ResponseWriter used to write the response.
// @Param r *http.Request - The http.Request containing the bank_id and update payload.
// @Return void
func UpdateItems(w http.ResponseWriter, r *http.Request) {
	queries := r.Context().Value("queries").(*databaseSQL.Queries)
	var bankBody databaseSqlc.UpdateBankParams

	vars := mux.Vars(r)

	bankId, err := strconv.ParseInt(vars["bank_id"], 10, 64)
	if err != nil {
		http.Error(w, "bank_id is required", http.StatusBadRequest)
		return
	}

	bankBody.ID = int64(bankId)

	reqBody, err := io.ReadAll(r.Body)
	defer r.Body.Close()
	if err != nil {
		http.Error(w, "Failed to read body", http.StatusInternalServerError)
		return
	}

	err = json.Unmarshal(reqBody, &bankBody)
	if err != nil {
		http.Error(w, "Failed to read body", http.StatusInternalServerError)
		return
	}

	err = BankService.UpdateItems(queries, r.Context(), bankBody)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
}
