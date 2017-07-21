package scrape

import (
	"encoding/json"
	"errors"
	"log"
	"regexp"
	"strconv"
	"strings"
	"time"

	"github.com/PuerkitoBio/goquery"
)

type tweetJSONData struct {
	MinPosition  string `json:"min_position"`
	HasMoreItems bool   `json:"has_more_items"`
	ItemsHTML    string `json:"items_html"`
}

func parseScrapeData(data []byte) (tweets TweetCollection, hasMore bool, nextMaxID string, err error) {
	jsonData := tweetJSONData{}
	err = json.Unmarshal(data, &jsonData)
	if err != nil {
		return
	}

	doc, err := goquery.NewDocumentFromReader(strings.NewReader(jsonData.ItemsHTML))
	if err != nil {
		return
	}

	tweets = TweetCollection{}
	doc.Find("div.js-stream-tweet").EachWithBreak(func(_ int, tweetSelection *goquery.Selection) bool {
		tweetIDStr, ok := tweetSelection.Attr("data-tweet-id")
		if !ok {
			html, _ := tweetSelection.Html()
			log.Printf("[SKIP] tweet without ID found\nHTML: %s", html)
			err = errors.New("tweet without ID found")
			return true
		}
		tweetUsername := tweetSelection.Find("span.username.u-dir b").First().Text()
		timeStr, _ := tweetSelection.Find("small.time span.js-short-timestamp").Attr("data-time")
		timeInt, convErr := strconv.Atoi(timeStr)
		if convErr != nil {
			html, _ := tweetSelection.Html()
			log.Printf("[SKIP] Error converting time `%s`: %v\nHTML: %s", timeStr, convErr, html)
			return true
		}

		tweetText := tweetSelection.Find("p.js-tweet-text").Text()
		tweetText = regexp.MustCompile("\\s+").ReplaceAllString(tweetText, " ")
		tweetText = strings.Replace(tweetText, "# ", "#", -1)
		tweetText = strings.Replace(tweetText, "@ ", "@", -1)

		tweet := Tweet{
			IDStr:      tweetIDStr,
			ScreenName: tweetUsername,
			CreatedAt:  time.Unix(int64(timeInt), 0),
			Body:       tweetText,
		}
		tweets = append(tweets, tweet)
		return true
	})
	if err != nil {
		return
	}

	hasMore = jsonData.HasMoreItems
	nextMaxID = jsonData.MinPosition

	return
}
