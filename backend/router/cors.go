package router

import "github.com/gorilla/handlers"

func HandleCors() []handlers.CORSOption {
	return []handlers.CORSOption{
		handlers.AllowedHeaders([]string{
			"X-Requested-With",
			"Content-Type",
			"Authorization",
			"Accept",
		}),
		handlers.AllowedOrigins([]string{"*"}),
		handlers.AllowedMethods([]string{"GET", "HEAD", "POST", "PUT", "DELETE", "OPTIONS"}),
		handlers.AllowCredentials(),
		handlers.ExposedHeaders([]string{"Content-Length", "Content-Type"}),
	}
}
