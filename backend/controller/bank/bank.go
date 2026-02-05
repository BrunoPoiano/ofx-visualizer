package BankController

import (
	"encoding/json"
	"net/http"

	BankService "main/services/bank"
	"main/services/utils"
	"main/types"

	databaseSqlc "main/database/databaseSQL"
)

// GetItems retrieves a paginated list of bank records.
// @Summary Get banks with pagination
// @Description Fetches bank records from the database using provided pagination parameters.
// @Param w http.ResponseWriter - The http.ResponseWriter used to write the response.
// @Param r *http.Request - The http.Request containing the URL query parameters.
// @Return void
func GetItems(w http.ResponseWriter, r *http.Request) {
	params := r.URL.Query()

	values := utils.CheckRequestParams[databaseSqlc.ListBanksParams](params)
	items, totalItems, lastPage, err := BankService.GetItems(r.Context(), values)
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
	bankId := r.Context().Value("bankId").(int64)

	bankBody, err := ParseUpdateBody(r.Body)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	err = BankService.UpdateItems(r.Context(), databaseSqlc.UpdateBankNameParams{
		Name: bankBody.Name,
		ID:   bankId,
	})
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
}

func DeleteItem(w http.ResponseWriter, r *http.Request) {
	bankId := r.Context().Value("bankId").(int64)

	err := BankService.DeleteItem(r.Context(), bankId)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
}
