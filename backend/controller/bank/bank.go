package BankController

import (
	"database/sql"
	"encoding/json"
	"io"
	BankService "main/services/bank"
	"main/types"
	"net/http"
	"strconv"

	"github.com/gorilla/mux"
)

// GetItems retrieves a paginated list of items.
// @Summary Get items with pagination
// @Description Get items from the database with pagination support
// @Param w http.ResponseWriter - The http.ResponseWriter to write the response to.
// @Param r *http.Request - The http.Request containing the request parameters.
// @Return void
func GetItems(w http.ResponseWriter, r *http.Request) {

	database := r.Context().Value("db").(*sql.DB)
	params := r.URL.Query()

	var filter types.DefaultSearch

	currentPage, err := strconv.ParseInt(params.Get("currentPage"), 10, 64)
	if err != nil {
		currentPage = 1
	}

	perPage, err := strconv.ParseInt(params.Get("perPage"), 10, 64)
	if err != nil {
		perPage = 5
	}

	order := params.Get("order")
	if err != nil {
		order = "id"
	}

	direction := params.Get("direction")
	if err != nil {
		direction = "ASC"
	}

	filter.PerPage = perPage
	filter.Order = order
	filter.Direction = direction
	filter.Search = params.Get("search")
	filter.CurrentPage = currentPage

	items, totalItems, err := BankService.GetItems(database, filter)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	response := types.ReturnPagination{
		Data:        items,
		Total:       totalItems,
		CurrentPage: int(currentPage),
		PerPage:     int(perPage),
	}

	json.NewEncoder(w).Encode(response)
}

func UpdateItems(w http.ResponseWriter, r *http.Request) {
	database := r.Context().Value("db").(*sql.DB)
	var bankBody types.Bank

	vars := mux.Vars(r)

	bankId, err := strconv.ParseInt(vars["bank_id"], 10, 64)
	if err != nil {
		http.Error(w, "bank_id is required", http.StatusBadRequest)
		return
	}

	bankBody.Id = int(bankId)

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

	err = BankService.UpdateItems(database, bankBody)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

}
