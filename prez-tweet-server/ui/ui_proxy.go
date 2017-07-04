package ui

import (
	"log"

	"github.com/gorilla/mux"
)

var uiJSFiles = []string{
	"polyfill.bundle.js",
	"vendor.bundle.js",
	"app.bundle.js",
}

var uiIndexFile = "index.html"
var uiIndexRoutes = []string{"", "index.htm", "index.html"}

// ApplyUIProxyRoutes adds the UI file proxy routes to the router
func ApplyUIProxyRoutes(r *mux.Router, apiHost string, uiResURL string) error {
	for _, jsFile := range uiJSFiles {
		err := applyProxyRoute(r, uiResURL, jsFile, jsFile, map[string]string{})
		if err != nil {
			return err
		}
	}

	indexReplacements := map[string]string{}
	indexReplacements["__API_HOST__"] = apiHost
	for _, indexRoute := range uiIndexRoutes {
		err := applyProxyRoute(r, uiResURL, uiIndexFile, indexRoute, indexReplacements)
		if err != nil {
			return err
		}
	}
	return nil
}

func applyProxyRoute(r *mux.Router, uiResURL string, resFile string, route string,
	contentReplacements map[string]string,
) error {
	resURL := uiResURL + "/" + resFile
	h, err := NewProxyHandler(resURL, contentReplacements)
	if err != nil {
		return err
	}

	fullRoute := "/" + route
	log.Println(fullRoute, "==>", resURL)
	r.Handle(fullRoute, h)
	return nil
}
