package twitter

import (
	"encoding/json"
	"net/http"

	"github.com/fsufitch/prez-tweet/prez-tweet-server/db"
	"github.com/fsufitch/prez-tweet/prez-tweet-server/model"
	"github.com/fsufitch/prez-tweet/prez-tweet-server/util"
)

type latestTweetsResponse struct {
	ObamaTweetIDStr string `json:"obama_tweet_id_str"`
	TrumpTweetIDStr string `json:"trump_tweet_id_str"`
}

// LatestTweetsHandler is a handler for getting the IDs of the latest presidential tweets
type LatestTweetsHandler struct{}

func (h LatestTweetsHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	tx, err := db.NewTransaction()
	if err != nil {
		util.WriteHTTPErrorResponse(w, 500, err.Error())
		return
	}
	defer tx.Rollback()

	latestObamaTweet, err := db.GetMostRecentTweet(tx, model.Obama)
	if err != nil {
		util.WriteHTTPErrorResponse(w, 500, err.Error())
		return
	}

	latestTrumpTweet, err := db.GetMostRecentTweet(tx, model.Trump)
	if err != nil {
		util.WriteHTTPErrorResponse(w, 500, err.Error())
		return
	}

	response := latestTweetsResponse{
		ObamaTweetIDStr: latestObamaTweet.IDStr,
		TrumpTweetIDStr: latestTrumpTweet.IDStr,
	}

	data, _ := json.Marshal(response)

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(200)
	w.Write(data)
}
