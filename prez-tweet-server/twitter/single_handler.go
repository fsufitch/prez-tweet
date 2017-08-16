package twitter

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/fsufitch/prez-tweet/prez-tweet-server/db"
	"github.com/fsufitch/prez-tweet/prez-tweet-server/model"
	"github.com/fsufitch/prez-tweet/prez-tweet-server/util"
	"github.com/gorilla/mux"
)

type singleTweetResponse struct {
	TweetIDStr    string  `json:"tweet_id_str"`
	PreviousIDStr *string `json:"prev_id_str"` // Use pointer to enable default `null`
	NextIDStr     *string `json:"next_id_str"` // Use pointer to enable default `null`
	ScreenName    string  `json:"screen_name"`
	IsTrump       bool    `json:"is_trump"`
	IsObama       bool    `json:"is_obama"`
	Timestamp     int64   `json:"timestamp"`
}

// GetSingleTweetHandler is a handler for retrieving details about a single tweet
type GetSingleTweetHandler struct{}

func (h GetSingleTweetHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	tweetID, _ := mux.Vars(r)["tweetID"]
	if tweetID == "" {
		util.WriteHTTPErrorResponse(w, 404, "No tweet ID specified")
		return
	}

	tx, _ := db.NewTransaction()
	defer tx.Rollback() // Read only transaction

	var tweet *model.DBTweet
	tweetMap, _ := db.GetTweetsFromIDs(tx, []string{tweetID})
	if foundTweet, ok := tweetMap[tweetID]; ok {
		tweet = &foundTweet
	}

	if tweet == nil {
		util.WriteHTTPErrorResponse(w, 404, fmt.Sprintf("Tweet with ID `%s` not found in the presidential tweet database", tweetID))
		return
	}

	author, err := model.GetAuthorByScreenName(tweet.ScreenName)
	if err != nil {
		util.WriteHTTPErrorResponse(w, 500, fmt.Sprintf("Unrecognized screen name: %s", tweet.ScreenName))
		return
	}

	older, olderErr := db.GetOlderTweet(tx, *tweet, *author)
	if olderErr != nil && olderErr != sql.ErrNoRows {
		util.WriteHTTPErrorResponse(w, 500, olderErr.Error())
		return
	}

	newer, newerErr := db.GetNewerTweet(tx, *tweet, *author)
	if newerErr != nil && newerErr != sql.ErrNoRows {
		util.WriteHTTPErrorResponse(w, 500, newerErr.Error())
		return
	}

	response := singleTweetResponse{
		TweetIDStr: tweet.IDStr,
		Timestamp:  tweet.CreatedAt.Unix(),
		ScreenName: tweet.ScreenName,
		IsTrump:    author.ModernDay,
		IsObama:    !author.ModernDay,
	}

	if olderErr == nil {
		response.PreviousIDStr = &older.IDStr
	}
	if newerErr == nil {
		response.NextIDStr = &newer.IDStr
	}

	responseData, _ := json.Marshal(response)
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(200)
	w.Write(responseData)
}
