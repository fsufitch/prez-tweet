package tweetpair

import (
	"encoding/json"
	"io/ioutil"
	"net/http"

	"github.com/fsufitch/prez-tweet/prez-tweet-server/db"
	"github.com/fsufitch/prez-tweet/prez-tweet-server/model"
	"github.com/fsufitch/prez-tweet/prez-tweet-server/util"
)

type newPairHandlerRequest struct {
	Tweet1IDStr string `json:"tweet1_id_str"`
	Tweet2IDStr string `json:"tweet2_id_str"`
}

type newPairHandler struct{}

func (h newPairHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	var err error
	bodyData, _ := ioutil.ReadAll(r.Body)
	var requestData newPairHandlerRequest
	err = json.Unmarshal(bodyData, &requestData)
	if err != nil {
		util.WriteHTTPErrorResponse(w, http.StatusBadRequest, err.Error())
		return
	}

	tx, _ := db.NewTransaction()
	pair, err := db.CreateTweetPair(tx, requestData.Tweet1IDStr, requestData.Tweet2IDStr)
	if err != nil {
		tx.Rollback()
		util.WriteHTTPErrorResponse(w, http.StatusInternalServerError, err.Error())
		return
	}

	tweetMap, err := db.GetTweetsFromIDs(tx, []string{pair.Tweet1IDStr, pair.Tweet2IDStr})
	if err != nil {
		tx.Rollback()
		util.WriteHTTPErrorResponse(w, http.StatusInternalServerError, err.Error())
		return
	}

	tweet1 := tweetMap[pair.Tweet1IDStr]
	tweet2 := tweetMap[pair.Tweet2IDStr]
	obamaTweet, trumpTweet, err := model.SeparateObamaTrump(tweet1, tweet2)
	if err != nil {
		tx.Rollback()
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
	tx.Commit()
}
