package SourceController

import (
	"encoding/json"
	"net/http"

	sourceService "main/services/source"
)

func GetItems(w http.ResponseWriter, r *http.Request) {
	items, err := sourceService.GetItems(r.Context())
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	json.NewEncoder(w).Encode(items)
}
