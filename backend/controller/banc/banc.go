package bancController

import (
	"database/sql"
	"encoding/json"
	bancService "main/services/banc"
	"main/types"
	"net/http"
	"strconv"
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

	currentPage, err := strconv.ParseInt(params.Get("currentPage"), 10, 64)
	if err != nil {
		currentPage = 1
	}

	perPage, err := strconv.ParseInt(params.Get("perPage"), 10, 64)
	if err != nil {
		perPage = 5
	}

	items, totalItems, err := bancService.GetItems(database, int(perPage), int(currentPage))
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
