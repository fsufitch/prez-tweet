package tweetpair

import (
	"database/sql"
	"encoding/json"
	"net/http"

	"github.com/fsufitch/prez-tweet/prez-tweet-server/db"
	"github.com/fsufitch/prez-tweet/prez-tweet-server/model"
	"github.com/fsufitch/prez-tweet/prez-tweet-server/util"
	"github.com/gorilla/mux"
)

type getPairHandler struct{}

func (h getPairHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	shortID, ok := mux.Vars(r)["shortID"]
	if !ok {
		util.WriteHTTPErrorResponse(w, http.StatusNotFound, "Pair ID not found")
		return
	}

	tx, _ := db.NewTransaction()
	defer tx.Rollback() // Safe since read-only operations

	pair, err := db.GetTweetPairByShortID(tx, shortID)
	if err == sql.ErrNoRows {
		util.WriteHTTPErrorResponse(w, http.StatusNotFound, "Pair ID not found")
		return
	} else if err != nil {
		util.WriteHTTPErrorResponse(w, http.StatusInternalServerError, err.Error())
		return
	}

	tweetMap, err := db.GetTweetsFromIDs(tx, []string{pair.Tweet1IDStr, pair.Tweet2IDStr})
	if err != nil {
		util.WriteHTTPErrorResponse(w, http.StatusInternalServerError, err.Error())
		return
	}

	tweet1 := tweetMap[pair.Tweet1IDStr]
	tweet2 := tweetMap[pair.Tweet2IDStr]
	obamaTweet, trumpTweet, err := model.SeparateObamaTrump(tweet1, tweet2)
	if err != nil {
		util.WriteHTTPErrorResponse(w, http.StatusInternalServerError, err.Error())
		return
	}

	response := tweetPairResponse{
		PairID:          pair.ID,
		ShortID:         pair.ShortID,
		ObamaTweetIDStr: obamaTweet.IDStr,
		TrumpTweetIDStr: trumpTweet.IDStr,
	}
	responseData, _ := json.Marshal(response)
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(200)
	w.Write(responseData)
}
