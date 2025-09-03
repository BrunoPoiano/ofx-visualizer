package SourceController

import (
	"database/sql"
	"encoding/json"
	sourceService "main/services/source"
	"net/http"
)

func GetItems(w http.ResponseWriter, r *http.Request) {

	database := r.Context().Value("db").(*sql.DB)

	items, err := sourceService.GetItems(database)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	json.NewEncoder(w).Encode(items)
}
