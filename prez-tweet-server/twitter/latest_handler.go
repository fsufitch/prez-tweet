package twitter

import (
	"encoding/json"
	"net/http"
	"strconv"
	"time"

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

	offsetYearsStr := r.URL.Query().Get("obama_offset")
	offsetYears := 0
	if offsetYearsStr != "" {
		offsetYears, err = strconv.Atoi(offsetYearsStr)
		if err != nil {
			util.WriteHTTPErrorResponse(w, 400, err.Error())
			return
		}
	}

	obamaTweetBefore := time.Now().AddDate(-1*offsetYears, 0, 0)
	latestObamaTweet, err := db.GetMostRecentTweet(tx, model.Obama, obamaTweetBefore)
	if err != nil {
		util.WriteHTTPErrorResponse(w, 500, err.Error())
		return
	}

	latestTrumpTweet, err := db.GetMostRecentTweet(tx, model.Trump, time.Now().AddDate(1, 0, 0)) // Add some nice buffer to account for timezones
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
