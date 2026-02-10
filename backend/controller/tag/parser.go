package TagController

import (
	"encoding/json"
	"errors"
	"io"
	"net/url"
	"strconv"

	databaseSqlc "main/database/databaseSQL"
	"main/types"
)

func ParseUrlValues(params url.Values) (types.DefaultSearch, error) {
	currentPage, err := strconv.ParseInt(params.Get("current_page"), 10, 64)
	if err != nil {
		currentPage = 1
	}

	perPage, err := strconv.ParseInt(params.Get("per_page"), 10, 64)
	if err != nil {
		perPage = 5
	}

	return types.DefaultSearch{
		CurrentPage: currentPage,
		PerPage:     perPage,
		Search:      params.Get("search"),
	}, nil
}

func ParseCreateBody(body io.ReadCloser) (databaseSqlc.Tag, error) {
	var tagBody databaseSqlc.Tag

	reqBody, err := io.ReadAll(body)
	defer body.Close()
	if err != nil {
		return tagBody, err
	}

	err = json.Unmarshal(reqBody, &tagBody)
	if err != nil {
		return tagBody, err
	}
	if tagBody.Name == "" {
		return tagBody, errors.New("Name field is required")
	}

	return tagBody, nil
}
