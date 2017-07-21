package scrape

import (
	"encoding/json"
	"time"
)

// TweetJSON is the marshaling structure for a tweet
type TweetJSON struct {
	IDStr      string `json:"id_str"`
	ScreenName string `json:"screen_name"`
	CreatedAt  int64  `json:"created_at"`
	Body       string `json:"body"`
}

// TweetCollectionExportJSON is the marshaling structure for a tweet collection
type TweetCollectionExportJSON struct {
	ExportTimestamp int64          `json:"export_timestamp"`
	UserCounts      map[string]int `json:"user_counts"`
	Tweets          []TweetJSON    `json:"tweets"`
}

func (tc TweetCollection) exportJSON(indent bool) ([]byte, error) {
	exportData := TweetCollectionExportJSON{
		ExportTimestamp: time.Now().Unix(),
		UserCounts:      map[string]int{},
		Tweets:          []TweetJSON{},
	}
	for _, tweet := range tc {
		exportData.Tweets = append(exportData.Tweets, TweetJSON{
			IDStr:      tweet.IDStr,
			ScreenName: tweet.ScreenName,
			CreatedAt:  tweet.CreatedAt.Unix(),
			Body:       tweet.Body,
		})

		if _, ok := exportData.UserCounts[tweet.ScreenName]; !ok {
			exportData.UserCounts[tweet.ScreenName] = 0
		}
		exportData.UserCounts[tweet.ScreenName]++
	}

	if indent {
		return json.MarshalIndent(exportData, "", "  ")
	}
	return json.Marshal(exportData)
}
