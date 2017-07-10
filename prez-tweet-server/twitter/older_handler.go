package twitter

import (
	"database/sql"
	"encoding/json"
	"log"
	"net/http"

	"github.com/fsufitch/prez-tweet/prez-tweet-server/db"
	"github.com/fsufitch/prez-tweet/prez-tweet-server/model"
	"github.com/fsufitch/prez-tweet/prez-tweet-server/util"
)

type olderTweetsResponse struct {
	ObamaTweetIDStr string `json:"obama_tweet_id_str"`
	TrumpTweetIDStr string `json:"trump_tweet_id_str"`
}

// OlderTweetsHandler is a handler that receives two tweets and replaces
// the newer one with the next older one by the same author.
type OlderTweetsHandler struct{}

func (h OlderTweetsHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	query := r.URL.Query()
	tweet1StrID := query.Get("tweet1")
	tweet2StrID := query.Get("tweet2")
	offsetYearsStr := query.Get("tweet1_offset_years")

	if tweet1StrID == "" || tweet2StrID == "" || offsetYearsStr == "" {
		util.WriteHTTPErrorResponse(w, 400, "Invalid query")
		return
	}

	tx, _ := db.NewTransaction()
	defer tx.Rollback()
	tweetMap, err := db.GetTweetsFromIDs(tx, []string{tweet1StrID, tweet2StrID})
	if err != nil {
		util.WriteHTTPErrorResponse(w, 500, err.Error())
		log.Print(err)
		return
	}

	tweet1, ok := tweetMap[tweet1StrID]
	if !ok {
		util.WriteHTTPErrorResponse(w, 400, "Invalid tweet ID: "+tweet1StrID)
		return
	}

	tweet2, ok := tweetMap[tweet2StrID]
	if !ok {
		util.WriteHTTPErrorResponse(w, 400, "Invalid tweet ID: "+tweet2StrID)
		return
	}

	olderTweet := tweet1
	newerTweet := tweet2
	if newerTweet.CreatedAt.Before(olderTweet.CreatedAt) {
		olderTweet, newerTweet = newerTweet, olderTweet
	}

	otherTweet := olderTweet
	resultTweet, err := getOlder(tx, newerTweet)
	if err == sql.ErrNoRows {
		resultTweet, err = getOlder(tx, olderTweet)
		if err == sql.ErrNoRows {
			util.WriteHTTPErrorResponse(w, 404, "No older tweets found")
			return
		}
		otherTweet = newerTweet
		err = nil
	}
	if err != nil {
		util.WriteHTTPErrorResponse(w, 500, err.Error())
		return
	}

	obamaTweet, trumpTweet, err := model.SeparateObamaTrump(resultTweet, otherTweet)
	if err != nil {
		util.WriteHTTPErrorResponse(w, 500, err.Error())
		return
	}

	response := olderTweetsResponse{
		ObamaTweetIDStr: obamaTweet.IDStr,
		TrumpTweetIDStr: trumpTweet.IDStr,
	}
	data, _ := json.Marshal(response)

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(200)
	w.Write(data)
}

func getOlder(tx *sql.Tx, tweet model.DBTweet) (result model.DBTweet, err error) {
	author, err := model.GetAuthorByScreenName(tweet.ScreenName)
	if err != nil {
		return
	}

	result, err = db.GetOlderTweet(tx, tweet, *author)
	return
}
