package tweetpair

import (
	"database/sql"
	"encoding/json"
	"net/http"

	"github.com/fsufitch/prez-tweet/prez-tweet-server/db"
	"github.com/fsufitch/r9kd/server/util"
	"github.com/gorilla/mux"
)

type getPairHandler struct{}

type getPairHandlerResponse struct {
	PairID           int    `json:"pair_id"`
	ShortID          string `json:"short_id"`
	Tweet1IDStr      string `json:"tweet1_id_str"`
	Tweet1ScreenName string `json:"tweet1_screen_name"`
	Tweet2IDStr      string `json:"tweet2_id_str"`
	Tweet2ScreenName string `json:"tweet2_screen_name"`
}

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
}
