package middleware

import (
	"context"
	"net/http"
	"strconv"

	"main/database/databaseSQL"
	"main/types"

	"github.com/gorilla/mux"
)

func CheckStatementExists(next http.HandlerFunc) func(http.ResponseWriter, *http.Request) {
	return func(w http.ResponseWriter, r *http.Request) {
		vars := mux.Vars(r)

		statementId, err := strconv.ParseInt(vars["statement_id"], 10, 64)
		if err != nil {
			http.Error(w, types.InvalidValue.Error(), http.StatusBadRequest)
			return
		}

		queries := r.Context().Value("queries").(*databaseSQL.Queries)
		_, err = queries.CheckStatement(r.Context(), statementId)
		if err != nil {
			http.Error(w, "Statement does not exist", http.StatusBadRequest)
			return
		}

		ctx := context.WithValue(r.Context(), "statementId", statementId)

		next(w, r.WithContext(ctx))
	}
}
