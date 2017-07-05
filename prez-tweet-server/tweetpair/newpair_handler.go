package tweetpair

import (
	"encoding/json"
	"io/ioutil"
	"net/http"

	"github.com/fsufitch/prez-tweet/prez-tweet-server/db"
	"github.com/fsufitch/r9kd/server/util"
)

type newPairHandlerRequest struct {
	Tweet1IDStr string `json:"tweet1_id_str"`
	Tweet2IDStr string `json:"tweet2_id_str"`
}

type newPairHandlerResponse struct {
	PairID           int    `json:"pair_id"`
	ShortID          string `json:"short_id"`
	Tweet1IDStr      string `json:"tweet1_id_str"`
	Tweet1ScreenName string `json:"tweet1_screen_name"`
	Tweet2IDStr      string `json:"tweet2_id_str"`
	Tweet2ScreenName string `json:"tweet2_screen_name"`
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

	response := newPairHandlerResponse{
		PairID:           pair.ID,
		ShortID:          pair.ShortID,
		Tweet1IDStr:      pair.Tweet1IDStr,
		Tweet1ScreenName: pair.Tweet1ScreenName,
		Tweet2IDStr:      pair.Tweet2IDStr,
		Tweet2ScreenName: pair.Tweet2ScreenName,
	}
	responseData, _ := json.Marshal(response)

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(200)
	w.Write(responseData)
	tx.Commit()
}
