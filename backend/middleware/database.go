package middleware

import (
	"context"
	"database/sql"
	"net/http"
)

// DatabaseMiddleware adds the database connection to the request context.
//
// Parameters:
//   - db: The database connection.
//   - next: The next handler in the chain.
//
// Returns:
//   - An http.HandlerFunc that adds the database connection to the request context and calls the next handler.
func DatabaseMiddleware(db *sql.DB, next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		ctx := context.WithValue(r.Context(), "db", db)
		next(w, r.WithContext(ctx))
	}
}
