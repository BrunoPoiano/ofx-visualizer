package TransactionController

import (
	"errors"
	"net/url"
	"strconv"

	"main/types"
)

func ParseUrlValues(params url.Values) (types.TransactionSearch, error) {
	sourceId, err := strconv.ParseInt(params.Get("source_id"), 10, 64)
	if err != nil || sourceId == 0 {
		return types.TransactionSearch{}, errors.New("source_id is required")
	}

	currentPage, err := strconv.ParseInt(params.Get("current_page"), 10, 64)
	if err != nil {
		currentPage = 1
	}

	perPage, err := strconv.ParseInt(params.Get("per_page"), 10, 64)
	if err != nil {
		perPage = 5
	}

	minValue, err := strconv.ParseInt(params.Get("min_value"), 10, 64)
	if err != nil {
		minValue = 0
	}

	maxValue, err := strconv.ParseInt(params.Get("max_value"), 10, 64)
	if err != nil {
		maxValue = 0
	}

	order := params.Get("order")
	if order == "" {
		order = "date"
	}

	direction := params.Get("direction")
	if direction == "" {
		direction = "DESC"
	}

	return types.TransactionSearch{
		DefaultSearch: types.DefaultSearch{
			CurrentPage: currentPage,
			PerPage:     perPage,
			Order:       order,
			Direction:   direction,
			Search:      params.Get("search"),
		},
		MinValue: minValue,
		MaxValue: maxValue,
		From:     params.Get("from"),
		To:       params.Get("to"),
		Tag:      params.Get("tag"),
		Type:     types.TransactionType(params.Get("type")).OrEmpty(),
		SourceId: sourceId,
	}, nil
}
