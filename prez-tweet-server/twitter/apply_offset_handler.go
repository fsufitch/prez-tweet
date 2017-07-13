package twitter

import (
	"database/sql"
	"encoding/json"
	"net/http"
	"strconv"

	"github.com/fsufitch/prez-tweet/prez-tweet-server/db"
	"github.com/fsufitch/prez-tweet/prez-tweet-server/model"
	"github.com/fsufitch/prez-tweet/prez-tweet-server/util"
)

type applyOffsetResponse struct {
	ObamaTweetIDStr string `json:"obama_tweet_id_str"`
	TrumpTweetIDStr string `json:"trump_tweet_id_str"`
}

// ApplyOffsetHandler is a handler that receives two tweets and replaces
// the first one with newest one after applying an offset to the second one.
type ApplyOffsetHandler struct{}

func (h ApplyOffsetHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	query := r.URL.Query()
	tweet1StrID := query.Get("tweet1")
	tweet2StrID := query.Get("tweet2")
	offsetYearsStr := query.Get("tweet1_offset_years")

	if tweet1StrID == "" || tweet2StrID == "" || offsetYearsStr == "" {
		util.WriteHTTPErrorResponse(w, 400, "Invalid query")
		return
	}

	offsetYears, err := strconv.Atoi(offsetYearsStr)
	if err != nil {
		util.WriteHTTPErrorResponse(w, 400, "Invalid offset "+err.Error())
		return
	}

	tx, _ := db.NewTransaction()
	defer tx.Rollback()

	tweetMap, err := db.GetTweetsFromIDs(tx, []string{tweet1StrID, tweet2StrID})
	if err != nil {
		util.WriteHTTPErrorResponse(w, 500, err.Error())
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

	author, err := model.GetAuthorByScreenName(tweet1.ScreenName)
	if err != nil {
		util.WriteHTTPErrorResponse(w, 400, "Invalid tweet author: "+tweet1.ScreenName)
		return
	}
	before := tweet2.CreatedAt.AddDate(-1*offsetYears, 0, 0)

	resultTweet, err := db.GetMostRecentTweet(tx, *author, before)
	if err == sql.ErrNoRows {
		util.WriteHTTPErrorResponse(w, 404, "No tweet found before offset time")
		return
	}

	obamaTweet, trumpTweet, err := model.SeparateObamaTrump(resultTweet, tweet2)
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
