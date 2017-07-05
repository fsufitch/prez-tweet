package server

import (
	"log"
	"net/http"

	"github.com/fsufitch/prez-tweet/prez-tweet-server/db"
	"github.com/fsufitch/prez-tweet/prez-tweet-server/model"
	"github.com/fsufitch/prez-tweet/prez-tweet-server/status"
	"github.com/fsufitch/prez-tweet/prez-tweet-server/twitter"
	"github.com/fsufitch/prez-tweet/prez-tweet-server/ui"
	"github.com/gorilla/mux"
)

var defaultCrawlAuthors = []model.TweetAuthor{model.Obama, model.Trump}

func createRoutes() (*mux.Router, error) {
	router := mux.NewRouter()
	router.StrictSlash(true)

	err := ui.ApplyUIProxyRoutes(router, apiHost, uiResURL)
	if err != nil {
		return nil, err
	}

	api := router.PathPrefix("/api").Subrouter()
	api.Handle("/status", status.NewHandler(apiHost, uiResURL))
	api.Handle("/latest", twitter.LatestTweetsHandler{})

	return router, nil
}

// StartServer starts the prez-tweet server
func StartServer() (err error) {
	err = initEnv()
	if err != nil {
		return
	}

	err = db.RunMigrations()
	if err != nil {
		return
	}

	err = runInitialCrawl()
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

func runInitialCrawl() (err error) {
	crawlAuthors := defaultCrawlAuthors
	done := make(chan error)
	for _, author := range crawlAuthors {
		go twitter.CrawlAuthorTweets(author, done)
	}
	for _ = range crawlAuthors {
		err = <-done
		if err != nil {
			return
		}
	}
	close(done)
	return
}
