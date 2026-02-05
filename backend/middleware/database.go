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
func DatabaseMiddleware(queries *databaseSqlc.Queries) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			ctx := context.WithValue(r.Context(), "queries", queries)
			next.ServeHTTP(w, r.WithContext(ctx))
		})
	}
}
