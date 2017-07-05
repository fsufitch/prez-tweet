package tweetpair

import "github.com/gorilla/mux"

// RegisterTweetPairRoutes registers the appropriate tweet pair routes to the given router
func RegisterTweetPairRoutes(r *mux.Router) {
	r.StrictSlash(true)
	r.Handle("", newPairHandler{}).Methods("POST")
	r.Handle("/{shortID}", getPairHandler{})
}
