package middleware

import (
	"context"
	"net/http"
	"strconv"

	"main/database/databaseSQL"
	"main/types"

	"github.com/gorilla/mux"
)

func CheckTagExists(next http.HandlerFunc) func(http.ResponseWriter, *http.Request) {
	return func(w http.ResponseWriter, r *http.Request) {
		vars := mux.Vars(r)

		tagId, err := strconv.ParseInt(vars["tag_id"], 10, 64)
		if err != nil {
			http.Error(w, types.InvalidValue.Error(), http.StatusBadRequest)
			return
		}

		queries := r.Context().Value("queries").(*databaseSQL.Queries)
		_, err = queries.GetTag(r.Context(), tagId)
		if err != nil {
			http.Error(w, "Tag does not exist", http.StatusBadRequest)
			return
		}

		ctx := context.WithValue(r.Context(), "tagId", tagId)

		next(w, r.WithContext(ctx))
	}
}
