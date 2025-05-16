package transactionController

import (
	"database/sql"
	"encoding/json"
	BankService "main/services/bank"
	ofxService "main/services/ofx"
	transactionService "main/services/transaction"
	"main/types"
	"net/http"
	"strconv"
	"strings"
)

const MAX_UPLOAD_SIZE = 1024 * 1024 // 1MB

// InsertItems handles the insertion of transaction and bank data from an OFX file.
// It parses the OFX file, extracts transaction and bank information, and inserts them into the database.
// @Summary Insert transaction items from OFX file
// @Description Upload an OFX file to insert transaction and bank data into the database
// @Param w http.ResponseWriter - The response writer
// @Param r *http.Request - The request object, containing the OFX file
// @Return void
func InsertItems(w http.ResponseWriter, r *http.Request) {

	database := r.Context().Value("db").(*sql.DB)

	file, fileHeader, err := r.FormFile("file")
	if err != nil {
		http.Error(w, "FIle is required", http.StatusBadRequest)
		return
	}
	defer file.Close()

	if fileHeader.Size > MAX_UPLOAD_SIZE {
		http.Error(w, "File Too Big", http.StatusBadRequest)
		return
	}

	if !strings.Contains(fileHeader.Filename, ".ofx") {
		http.Error(w, "File should be .ofx", http.StatusBadRequest)
		return
	}

	transactions, Bank, err := ofxService.ParseOfx(file)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	BankId, err := BankService.InsertItems(database, Bank)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	err = transactionService.InsertTransaction(database, transactions, BankId)
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

	items, totalItems, err := transactionService.GetTransactions(database, int(perPage), int(currentPage))
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
