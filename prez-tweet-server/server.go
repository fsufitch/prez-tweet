package server

import (
	"log"
	"net/http"

	"github.com/fsufitch/prez-tweet/prez-tweet-server/status"
	"github.com/fsufitch/prez-tweet/prez-tweet-server/ui"
	"github.com/gorilla/mux"
)

func createRoutes() (*mux.Router, error) {
	router := mux.NewRouter()
	router.StrictSlash(true)

	err := ui.ApplyUIProxyRoutes(router, apiHost, uiResURL)
	if err != nil {
		return nil, err
	}

	api := router.PathPrefix("/api").Subrouter()
	api.Handle("/status", status.NewHandler(apiHost, uiResURL))

	return router, nil
}

// StartServer starts the prez-tweet server
func StartServer() (err error) {
	err = initEnv()
	if err != nil {
		return
	}
	router, err := createRoutes()
	if err != nil {
		return
	}

	serveAddress := getServeAddress()
	log.Println("Serving... " + serveAddress)

	err = http.ListenAndServe(serveAddress, router)
	return
}
