package middleware

import (
	"context"
	"net/http"

	databaseSqlc "main/database/databaseSQL"
)

// DatabaseMiddleware adds the database connection to the request context.
//
// Parameters:
//   - db: The database connection.
//   - next: The next handler in the chain.
//
// Returns:
//   - An http.HandlerFunc that adds the database connection to the request context and calls the next handler.
func DatabaseMiddleware(queries *databaseSqlc.Queries, next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		ctx := context.WithValue(r.Context(), "queries", queries)
		next(w, r.WithContext(ctx))
	}
}
