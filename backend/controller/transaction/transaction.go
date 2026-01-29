package TransactionController

import (
	"encoding/json"
	"net/http"
	"net/url"
	"strconv"
	"strings"

	"main/database/databaseSQL"
	BalanceService "main/services/balance"
	ofxService "main/services/ofx"
	sourceService "main/services/source"
	StatementService "main/services/statement"
	transactionService "main/services/transaction"
	"main/types"

	"github.com/gorilla/mux"
)

// InsertItems handles the insertion of transaction and bank data from an OFX file.
// It parses the OFX file, extracts transaction and bank information, and inserts them into the database.
// @Summary Insert transaction items from OFX file
// @Description Upload an OFX file to insert transaction and bank data into the database
// @Param w http.ResponseWriter - The response writer
// @Param r *http.Request - The request object, containing the OFX file
// @Return void
func InsertItems(w http.ResponseWriter, r *http.Request) {
	queries := r.Context().Value("queries").(*databaseSQL.Queries)
	err := r.ParseMultipartForm(10 << 20) // limit memory usage to 10 MB
	if err != nil {
		http.Error(w, "Unable to parse form", http.StatusBadRequest)
		return
	}

	files := r.MultipartForm.File["file"]

	if len(files) == 0 {
		http.Error(w, "No files uploaded", http.StatusBadRequest)
		return
	}

	for _, fileHeader := range files {
		file, err := fileHeader.Open()
		if err != nil {
			http.Error(w, "Error opening file", http.StatusInternalServerError)
			return
		}
		defer file.Close()

		if !strings.Contains(fileHeader.Filename, ".ofx") {
			http.Error(w, "File should be .ofx", http.StatusBadRequest)
			return
		}

		transactions, statement, Bank, Card, err := ofxService.ParseOfx(file)
		if err != nil {
			http.Error(w, "Error parsing file", http.StatusBadRequest)
			return
		}

		SourceId, err := sourceService.InsertItem(queries, r.Context(), Bank, Card)
		if err != nil {
			http.Error(w, "Error saving items", http.StatusBadRequest)
			return
		}

		err = transactionService.InsertTransaction(queries, r.Context(), transactions, SourceId)
		if err != nil {
			http.Error(w, "Error saving transaction", http.StatusBadRequest)
			return
		}

		StatementId, err := StatementService.InsertItems(queries, r.Context(), statement, SourceId)
		if err != nil {
			http.Error(w, "Error saving statement", http.StatusBadRequest)
			return
		}

		for _, item := range statement.Yields {
			err = BalanceService.InsertItems(queries, r.Context(), databaseSQL.CreateBalanceParams{
				StatementID: item.StatementID,
				Name:        item.Name,
				Description: item.Description,
				BalanceType: item.BalanceType,
				Value:       item.Value,
			}, StatementId)
			if err != nil {
				http.Error(w, "Error saving yields", http.StatusBadRequest)
				return
			}
		}

	}

	json.NewEncoder(w)
}

// GetTransactionInfos retrieves aggregate transaction information (positive, negative, total value) from the database based on provided filters.
// It handles pagination, sorting, and filtering of transactions.
// @Summary Get aggregate transaction information
// @Description Retrieve summary information about transactions based on various filters.
// @Param w http.ResponseWriter - The response writer
// @Param r *http.Request - The request object, containing filter parameters
// @Return void
func GetTransactionInfos(w http.ResponseWriter, r *http.Request) {
	queries := r.Context().Value("queries").(*databaseSQL.Queries)
	params := r.URL.Query()

	filter := ParseUrlValues(params)

	if filter.SourceId == 0 {
		http.Error(w, "source_id is required", http.StatusBadRequest)
		return
	}

	positive, negative, value, err := transactionService.GetTransactionInfos(queries, r.Context(), filter)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	returnInfo := types.ReturnTransactionInfo{
		Positive: positive,
		Negative: negative,
		Value:    value,
	}

	json.NewEncoder(w).Encode(returnInfo)
}

// DeleteTransactions handles the deletion of transactions from the database based on bank ID.
// @Summary Delete transactions by bank ID
// @Description Delete transactions associated with a specific bank from the database.
// @Param w http.ResponseWriter - The response writer
// @Param r *http.Request - The request object, containing the bank ID
// @Return void
func DeleteTransactions(w http.ResponseWriter, r *http.Request) {
	queries := r.Context().Value("queries").(*databaseSQL.Queries)
	vars := mux.Vars(r)

	bankId, err := strconv.ParseInt(vars["bank_id"], 10, 64)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	err = transactionService.DeleteTransaction(queries, r.Context(), bankId)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	json.NewEncoder(w)
}

// GetItems retrieves transactions from the database with pagination.
// It fetches transactions based on the provided page number and items per page.
// @Summary Get transaction items with pagination
// @Description Retrieve transactions from the database with pagination support
// @Param w http.ResponseWriter - The response writer
// @Param r *http.Request - The request object, containing pagination parameters
// @Return void
func GetItems(w http.ResponseWriter, r *http.Request) {
	queries := r.Context().Value("queries").(*databaseSQL.Queries)
	params := r.URL.Query()

	filter := ParseUrlValues(params)

	if filter.SourceId == 0 {
		http.Error(w, "source_id is required", http.StatusBadRequest)
		return
	}

	items, totalItems, lastpage, err := transactionService.GetTransactions(queries, r.Context(), filter)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	response := types.ReturnPagination{
		Data:        items,
		Total:       totalItems,
		LastPage:    lastpage,
		CurrentPage: int(filter.CurrentPage),
		PerPage:     int(filter.PerPage),
	}

	json.NewEncoder(w).Encode(response)
}

func ParseUrlValues(params url.Values) types.TransactionSearch {
	currentPage, err := strconv.ParseInt(params.Get("current_page"), 10, 64)
	if err != nil {
		currentPage = 1
	}

	perPage, err := strconv.ParseInt(params.Get("per_page"), 10, 64)
	if err != nil {
		perPage = 5
	}

	minValue, err := strconv.ParseInt(params.Get("min_value"), 10, 64)
	if err != nil {
		minValue = 0
	}

	maxValue, err := strconv.ParseInt(params.Get("max_value"), 10, 64)
	if err != nil {
		maxValue = 0
	}

	sourceId, err := strconv.ParseInt(params.Get("source_id"), 10, 64)
	if err != nil {
		sourceId = 0
	}

	order := params.Get("order")
	if order == "" {
		order = "date"
	}

	direction := params.Get("direction")
	if direction == "" {
		direction = "DESC"
	}

	return types.TransactionSearch{
		DefaultSearch: types.DefaultSearch{
			CurrentPage: currentPage,
			PerPage:     perPage,
			Order:       order,
			Direction:   direction,
			Search:      params.Get("search"),
		},
		MinValue: minValue,
		MaxValue: maxValue,
		From:     params.Get("from"),
		To:       params.Get("to"),
		Type:     types.TransactionType(params.Get("type")).OrEmpty(),
		SourceId: sourceId,
	}
}
