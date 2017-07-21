package server

import (
	"log"
	"net/http"
	"time"

	"github.com/fsufitch/prez-tweet/prez-tweet-server/db"
	"github.com/fsufitch/prez-tweet/prez-tweet-server/model"
	"github.com/fsufitch/prez-tweet/prez-tweet-server/status"
	"github.com/fsufitch/prez-tweet/prez-tweet-server/tweetpair"
	"github.com/fsufitch/prez-tweet/prez-tweet-server/twitter"
	"github.com/fsufitch/prez-tweet/prez-tweet-server/ui"
	"github.com/gorilla/mux"
)

var defaultCrawlAuthors = []model.TweetAuthor{model.Obama, model.Trump}

func createRoutes() (*mux.Router, error) {
	router := mux.NewRouter()
	router.StrictSlash(true)

	err := ui.ApplyUIProxyRoutes(router, apiHost, uiResURL, proxyCacheTTL)
	if err != nil {
		return nil, err
	}

	api := router.PathPrefix("/api").Subrouter()
	api.StrictSlash(true)
	api.Handle("/status", status.NewHandler(apiHost, uiResURL))
	api.Handle("/latest", twitter.LatestTweetsHandler{})
	api.Handle("/syncOlder", twitter.OlderTweetsHandler{})
	api.Handle("/syncNewer", twitter.NewerTweetsHandler{})
	api.Handle("/syncApplyOffset", twitter.ApplyOffsetHandler{})

	tweetpair.RegisterTweetPairRoutes(api.PathPrefix("/pair").Subrouter())

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

	go runRepeatCrawls(10 * time.Minute)

	router, err := createRoutes()
	if err != nil {
		return
	}

	serveAddress := getServeAddress()
	log.Println("Serving... " + serveAddress)

	err = http.ListenAndServe(serveAddress, router)
	return
}

func runCrawl() (err error) {
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

func runRepeatCrawls(delay time.Duration) {
	for {
		runCrawl()
		time.Sleep(delay)
	}
}
