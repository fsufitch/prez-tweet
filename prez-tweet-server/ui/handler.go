package ui

import (
	"fmt"
	"net/http"
	"strings"
)

// Handler handles displaying the basics of the user interface
type Handler struct {
	APIHost  string
	JSBundle string
}

func (h Handler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	body := uiBody
	body = strings.Replace(body, "__API_HOST__", h.APIHost, -1)
	body = strings.Replace(body, "__JS_BUNDLE__", h.JSBundle, -1)
	fmt.Fprint(w, body)
}
