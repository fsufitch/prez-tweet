package util

import "net/http"

// WriteHTTPErrorResponse is a boilerplate function for writing a plain HTTP error
func WriteHTTPErrorResponse(w http.ResponseWriter, code int, message string) {
	w.Header().Set("Content-type", "text/plain")
	w.WriteHeader(code)
	w.Write([]byte(message))
}
