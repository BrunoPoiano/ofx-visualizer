package TagController

import (
	"encoding/json"
	"net/http"

	tagsService "main/services/tags"
	"main/types"
)

func GetItems(w http.ResponseWriter, r *http.Request) {
	filter, err := ParseUrlValues(r.URL.Query())
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	items, totalItems, lastpage, err := tagsService.GetTags(r.Context(), filter)
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

func InsertItems(w http.ResponseWriter, r *http.Request) {
	tagBody, err := ParseCreateBody(r.Body)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	err = tagsService.InsertTags(r.Context(), tagBody)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
}

func DeleteItem(w http.ResponseWriter, r *http.Request) {
	err := tagsService.DeleteTags(r.Context())
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
}
