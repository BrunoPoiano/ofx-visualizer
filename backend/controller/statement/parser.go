package StatementController

import (
	"errors"
	"net/url"
	"strconv"

	"main/types"
)

func ParseUrlValues(params url.Values) (types.StatementSearch, error) {
	sourceId, err := strconv.ParseInt(params.Get("source_id"), 10, 64)
	if err != nil || sourceId == 0 {
		return types.StatementSearch{}, errors.New("source_id is required")
	}

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
		order = "start_date"
	}

	direction := params.Get("direction")
	if direction == "" {
		direction = "DESC"
	}

	minValue, err := strconv.ParseInt(params.Get("min_value"), 10, 64)
	if err != nil {
		minValue = 0
	}

	maxValue, err := strconv.ParseInt(params.Get("max_value"), 10, 64)
	if err != nil {
		maxValue = 0
	}

	return types.StatementSearch{
		DefaultSearch: types.DefaultSearch{
			CurrentPage: currentPage,
			PerPage:     perPage,
			Order:       order,
			Direction:   direction,
			Search:      params.Get("search"),
		},
		SourceId: sourceId,
		MinValue: minValue,
		MaxValue: maxValue,
		From:     params.Get("from"),
		To:       params.Get("to"),
	}, nil
}
