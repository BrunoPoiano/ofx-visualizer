package middleware

import (
	"context"
	"net/http"
	"strconv"

	"main/database/databaseSQL"
	"main/types"

	"github.com/gorilla/mux"
)

func CheckSourceExists(next http.HandlerFunc) func(http.ResponseWriter, *http.Request) {
	return func(w http.ResponseWriter, r *http.Request) {
		vars := mux.Vars(r)

		sourceId, err := strconv.ParseInt(vars["source_id"], 10, 64)
		if err != nil {
			http.Error(w, types.InvalidValue.Error(), http.StatusBadRequest)
			return
		}

		queries := r.Context().Value("queries").(*databaseSQL.Queries)
		_, err = queries.GetSource(r.Context(), sourceId)
		if err != nil {
			http.Error(w, "Source does not exist", http.StatusBadRequest)
			return
		}

		ctx := context.WithValue(r.Context(), "sourceId", sourceId)

		next(w, r.WithContext(ctx))
	}
}
