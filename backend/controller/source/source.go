package SourceController

import (
	"encoding/json"
	"net/http"

	"main/database/databaseSQL"
	sourceService "main/services/source"
)

func GetItems(w http.ResponseWriter, r *http.Request) {
	queries := r.Context().Value("queries").(*databaseSQL.Queries)

	items, err := sourceService.GetItems(queries, r.Context())
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	json.NewEncoder(w).Encode(items)
}
