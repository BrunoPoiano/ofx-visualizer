package TransactionController

import (
	"database/sql"
	"encoding/json"
	BalanceService "main/services/balance"
	BankService "main/services/bank"
	ofxService "main/services/ofx"
	StatementService "main/services/statement"
	transactionService "main/services/transaction"
	"main/types"
	"net/http"
	"strconv"
	"strings"

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

	database := r.Context().Value("db").(*sql.DB)
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

		transactions, Bank, statement, err := ofxService.ParseOfx(file)
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

		StatementId, err := StatementService.InsertItems(database, statement, BankId)
		if err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}

		for _, item := range statement.Yields {
			err = BalanceService.InsertItems(database, item, StatementId)
			if err != nil {
				http.Error(w, err.Error(), http.StatusBadRequest)
				return
			}
		}

	}

	json.NewEncoder(w)

}

func GetTransactionInfos(w http.ResponseWriter, r *http.Request) {
	database := r.Context().Value("db").(*sql.DB)

	params := r.URL.Query()

	currentPage, err := strconv.ParseInt(params.Get("current_page"), 10, 64)
	if err != nil {
		currentPage = 1
	}

	perPage, err := strconv.ParseInt(params.Get("per_page"), 10, 64)
	if err != nil {
		perPage = 5
	}

	order := params.Get("order")
	if order == "" {
		order = "date"
	}

	direction := params.Get("direction")
	if direction == "" {
		direction = "DESC"
	}

	filter := types.TransactionSearch{
		DefaultSearch: types.DefaultSearch{
			CurrentPage: currentPage,
			PerPage:     perPage,
			Order:       order,
			Direction:   direction,
			Search:      params.Get("search"),
		},
		MinValue: params.Get("min_value"),
		MaxValue: params.Get("max_value"),
		From:     params.Get("from"),
		To:       params.Get("to"),
		Type:     params.Get("type"),
		Bank:     params.Get("bank"),
	}

	positive, negative, value, err := transactionService.GetTransactionInfos(database, filter)
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

func DeleteTransactions(w http.ResponseWriter, r *http.Request) {
	database := r.Context().Value("db").(*sql.DB)
	vars := mux.Vars(r)

	bankId, err := strconv.ParseInt(vars["bank_id"], 10, 64)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	err = transactionService.DeleteTransaction(database, bankId)
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

	currentPage, err := strconv.ParseInt(params.Get("current_page"), 10, 64)
	if err != nil {
		currentPage = 1
	}

	perPage, err := strconv.ParseInt(params.Get("per_page"), 10, 64)
	if err != nil {
		perPage = 5
	}

	order := params.Get("order")
	if order == "" {
		order = "date"
	}

	direction := params.Get("direction")
	if direction == "" {
		direction = "ASC"
	}

	filter := types.TransactionSearch{
		DefaultSearch: types.DefaultSearch{
			CurrentPage: currentPage,
			PerPage:     perPage,
			Order:       order,
			Direction:   direction,
			Search:      params.Get("search"),
		},
		MinValue: params.Get("min_value"),
		MaxValue: params.Get("max_value"),
		From:     params.Get("from"),
		To:       params.Get("to"),
		Type:     params.Get("type"),
		Bank:     params.Get("bank"),
	}

	items, totalItems, lastpage, err := transactionService.GetTransactions(database, filter)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	response := types.ReturnPagination{
		Data:        items,
		Total:       totalItems,
		LastPage:    lastpage,
		CurrentPage: int(currentPage),
		PerPage:     int(perPage),
	}

	json.NewEncoder(w).Encode(response)
}
