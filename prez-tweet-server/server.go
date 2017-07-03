package server

import (
	"log"
	"net/http"

	"github.com/fsufitch/prez-tweet/prez-tweet-server/ui"
	"github.com/gorilla/mux"
)

func createRoutes() *mux.Router {
	router := mux.NewRouter()

	router.Handle("/", ui.Handler{
		APIHost:  apiHost,
		JSBundle: jsBundleURL,
	})

	return router
}

// StartServer starts the prez-tweet server
func StartServer() (err error) {
	err = initEnv()
	if err != nil {
		return err
	}
	serveAddress := getServeAddress()
	log.Println("Serving... " + serveAddress)
	err = http.ListenAndServe(getServeAddress(), createRoutes())
	return
}
