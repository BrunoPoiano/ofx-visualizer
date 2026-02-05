package middleware

import (
	"context"
	"net/http"
	"strconv"

	"main/database/databaseSQL"

	"github.com/gorilla/mux"
)

func CheckBankExists(next http.HandlerFunc) func(http.ResponseWriter, *http.Request) {
	return func(w http.ResponseWriter, r *http.Request) {
		vars := mux.Vars(r)

		bankId, err := strconv.ParseInt(vars["bank_id"], 10, 64)
		if err != nil {
			http.Error(w, "bank_id is invalid", http.StatusBadRequest)
			return
		}

		queries := r.Context().Value("queries").(*databaseSQL.Queries)
		_, err = queries.GetBank(r.Context(), bankId)
		if err != nil {
			http.Error(w, "Bank does not exist", http.StatusBadRequest)
			return
		}

		ctx := context.WithValue(r.Context(), "bankId", bankId)

		next(w, r.WithContext(ctx))
	}
}
