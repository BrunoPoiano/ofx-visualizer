package BalanceController

import (
	"net/url"
	"strconv"

	"main/types"
)

func ParseUrlValues(params url.Values) types.DefaultSearch {
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
		order = "id"
	}

	direction := params.Get("direction")
	if direction == "" {
		direction = "ASC"
	}

	return types.DefaultSearch{
		CurrentPage: currentPage,
		PerPage:     perPage,
		Order:       order,
		Direction:   direction,
		Search:      params.Get("search"),
	}
}
