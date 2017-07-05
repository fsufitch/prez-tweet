package twitter

import (
	"log"
	"time"

	"github.com/dghubble/go-twitter/twitter"
	"github.com/fsufitch/prez-tweet/prez-tweet-server/db"
	"github.com/fsufitch/prez-tweet/prez-tweet-server/model"
)

// CrawlAuthorTweets traverses the author's timeline(s) and populates the DB
// with the proper tweets
func CrawlAuthorTweets(author model.TweetAuthor, notifyDone chan<- error) {
	for _, screenName := range author.ScreenNames {
		err := crawlScreenNameTweets(screenName)
		if err != nil {
			notifyDone <- err
			return
		}
	}
	notifyDone <- nil
	return
}

const crawlBatchSize = 200

// Twitter time format: "Wed May 23 06:01:13 +0000 2007",
// Go reference time:    Mon Jan  2 15:04:05 -0700 MST 2006
const twitterTimeLayout = "Mon Jan 2 15:04:05 -0700 2006"

func crawlScreenNameTweets(screenName string) (err error) {
	user, err := GetUser(screenName)
	if err != nil {
		return
	}

	tx, err := db.NewTransaction()
	if err != nil {
		return
	}

	maxID := user.Status.ID
	insertedTweetIDs := map[string]bool{}
	for {
		trimUser := true // Hack?
		params := &twitter.UserTimelineParams{
			ScreenName: user.ScreenName,
			MaxID:      maxID,
			Count:      crawlBatchSize,
			TrimUser:   &trimUser,
		}

		log.Printf("[Twitter] Querying user timeline @%s for %d tweets starting at %d", params.ScreenName, params.Count, params.MaxID)

		var tweets []twitter.Tweet
		tweets, _, err = GetClient().Timelines.UserTimeline(params)
		if err != nil {
			tx.Rollback()
			return
		}

		// Filter by already inserted
		tweets = filterTweets(tweets, func(t twitter.Tweet) bool {
			_, found := insertedTweetIDs[t.IDStr]
			return !found
		})

		// Filter by already in DB
		tweetIDs := getTweetIDs(tweets)
		var dbTweetMap map[string]model.DBTweet
		dbTweetMap, err = db.GetTweetsFromIDs(tx, tweetIDs)
		if err != nil {
			tx.Rollback()
			return
		}
		tweets = filterTweets(tweets, func(t twitter.Tweet) bool {
			_, found := dbTweetMap[t.IDStr]
			return !found
		})

		if len(tweets) == 0 {
			break
		}

		log.Printf("Inserting %d tweets by @%s", len(tweets), params.ScreenName)
		for _, tweet := range tweets {
			var createdAt time.Time
			createdAt, err = time.Parse(twitterTimeLayout, tweet.CreatedAt)
			if err != nil {
				tx.Rollback()
				return
			}

			dbTweet := model.DBTweet{
				IDStr:      tweet.IDStr,
				ScreenName: user.ScreenName,
				CreatedAt:  createdAt,
				Body:       tweet.FullText,
			}
			err = db.InsertTweet(tx, dbTweet)
			insertedTweetIDs[dbTweet.IDStr] = true
			if err != nil {
				tx.Rollback()
				return
			}
			maxID = tweet.ID
		}
	}

	log.Println("Committing")
	err = tx.Commit()
	return
}

func filterTweets(tweets []twitter.Tweet, predicate func(twitter.Tweet) bool) []twitter.Tweet {
	filtered := []twitter.Tweet{}
	for _, tweet := range tweets {
		if predicate(tweet) {
			filtered = append(filtered, tweet)
		}
	}
	return filtered
}

func getTweetIDs(tweets []twitter.Tweet) []string {
	ids := []string{}
	for _, tweet := range tweets {
		ids = append(ids, tweet.IDStr)
	}
	return ids
}
