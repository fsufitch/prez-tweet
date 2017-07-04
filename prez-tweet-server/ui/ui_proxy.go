package ui

import (
	"log"

	"github.com/gorilla/mux"
)

var uiJSFiles = []string{
	"polyfills.bundle.js",
	"vendor.bundle.js",
	"app.bundle.js",
}

var uiIndexFile = "index.html"
var uiIndexRoutes = []string{"", "index.htm", "index.html"}

// ApplyUIProxyRoutes adds the UI file proxy routes to the router
func ApplyUIProxyRoutes(r *mux.Router, uiResURL string) error {
	for _, jsFile := range uiJSFiles {
		err := applyProxyRoute(r, uiResURL, jsFile, jsFile)
		if err != nil {
			return err
		}
	}

	for _, indexRoute := range uiIndexRoutes {
		err := applyProxyRoute(r, uiResURL, uiIndexFile, indexRoute)
		if err != nil {
			return err
		}
	}
	return nil
}

func applyProxyRoute(r *mux.Router, uiResURL string, resFile string, route string) error {
	resURL := uiResURL + "/" + resFile
	h, err := NewProxyHandler(resURL)
	if err != nil {
		return err
	}

	fullRoute := "/" + route
	log.Println(fullRoute, "==>", resURL)
	r.Handle(fullRoute, h)
	return nil
}
