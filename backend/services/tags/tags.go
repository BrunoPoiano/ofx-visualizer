package tagsService

import (
	"context"
	"math"

	"main/database/databaseSQL"
	databaseSqlc "main/database/databaseSQL"
	"main/types"
)

func InsertTags(ctx context.Context, item databaseSqlc.Tag) error {
	queries := ctx.Value("queries").(*databaseSQL.Queries)

	_, err := queries.CreateTag(ctx, item.Name)
	if err != nil {
		return err
	}

	return nil
}

func GetTags(ctx context.Context, filter types.DefaultSearch) ([]databaseSqlc.Tag, int, int, error) {
	queries := ctx.Value("queries").(*databaseSQL.Queries)
	offset := filter.PerPage * (filter.CurrentPage - 1)

	items, err := queries.ListTags(ctx, databaseSqlc.ListTagsParams{
		Offset: offset,
		Limit:  filter.PerPage,
		Search: filter.Search,
	})
	if err != nil {
		return nil, 0, 0, err
	}

	totalItems, err := queries.CountTags(ctx, filter.Search)
	if err != nil {
		return nil, 0, 0, err
	}

	last_page := math.Ceil(float64(totalItems) / float64(filter.PerPage))

	return items, int(totalItems), int(last_page), nil
}

func DeleteTags(ctx context.Context) error {
	queries := ctx.Value("queries").(*databaseSQL.Queries)
	tagId := ctx.Value("tagId").(int64)
	return queries.DeleteTag(ctx, tagId)
}
