package TransactionController

import (
	"encoding/json"
	"net/http"
	"strconv"

	"main/database/databaseSQL"
	ofxService "main/services/ofx"
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

	err = ofxService.FileReader(files, queries, r.Context())
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
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

	json.NewEncoder(w).Encode(types.ReturnTransactionInfo{
		Positive: positive,
		Negative: negative,
		Value:    value,
	})
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

	json.NewEncoder(w).Encode(types.ReturnPagination{
		Data:        items,
		Total:       totalItems,
		LastPage:    lastpage,
		CurrentPage: int(filter.CurrentPage),
		PerPage:     int(filter.PerPage),
	})
}
