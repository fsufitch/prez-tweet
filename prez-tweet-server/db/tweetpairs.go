package db

import (
	"database/sql"
	"fmt"
	"log"
	"math/rand"

	"github.com/fsufitch/prez-tweet/prez-tweet-server/model"
)

const shortIDLength = 6

// GetTweetPairByTweets looks up a tweet pair by its two constituent tweets
func GetTweetPairByTweets(tx *sql.Tx, tweet1IDStr string, tweet2IDStr string) (pair model.TweetPair, err error) {
	row := tx.QueryRow(`
    SELECT p.tweet_pair_id, p.short_id, p.tweet1_id_str, p.tweet1_screen_name, p.tweet2_id_str, p.tweet2_screen_name
    FROM tweet_pairs p
    WHERE (p.tweet1_id_str=$1 AND p.tweet2_id_str=$2) OR (p.tweet1_id_str=$2 AND p.tweet2_id_str=$1);
  `, tweet1IDStr, tweet2IDStr)

	err = row.Scan(
		&pair.ID,
		&pair.ShortID,
		&pair.Tweet1IDStr,
		&pair.Tweet1ScreenName,
		&pair.Tweet2IDStr,
		&pair.Tweet2ScreenName,
	)
	return
}

// GetTweetPairByShortID looks up a tweet pair by the pair's short ID
func GetTweetPairByShortID(tx *sql.Tx, shortID string) (pair model.TweetPair, err error) {
	row := tx.QueryRow(`
    SELECT p.tweet_pair_id, p.short_id, p.tweet1_id_str, p.tweet1_screen_name, p.tweet2_id_str, p.tweet2_screen_name
    FROM tweet_pairs p
    WHERE p.short_id=$1;
  `, shortID)

	err = row.Scan(
		&pair.ID,
		&pair.ShortID,
		&pair.Tweet1IDStr,
		&pair.Tweet1ScreenName,
		&pair.Tweet2IDStr,
		&pair.Tweet2ScreenName,
	)
	return
}

// CreateTweetPair creates a new pair given the two tweet IDs, if necessary
func CreateTweetPair(tx *sql.Tx, tweet1IDStr string, tweet2IDStr string) (pair model.TweetPair, err error) {
	tweetMap, err := GetTweetsFromIDs(tx, []string{tweet1IDStr, tweet2IDStr})
	if err != nil {
		return
	}

	pair, err = GetTweetPairByTweets(tx, tweet1IDStr, tweet2IDStr)
	if err != sql.ErrNoRows {
		return
	}

	var tw1, tw2 model.DBTweet
	var ok bool
	if tw1, ok = tweetMap[tweet1IDStr]; !ok {
		err = fmt.Errorf("Tweet not found: %s", tweet1IDStr)
		return
	}
	if tw2, ok = tweetMap[tweet2IDStr]; !ok {
		err = fmt.Errorf("Tweet not found: %s", tweet2IDStr)
		return
	}

	shortID, err := createUniqueShortID(tx, shortIDLength)
	if err != nil {
		return
	}
	newID, err := insertTweetPair(tx, shortID, tw1, tw2)
	if err != nil {
		return
	}

	pair.ID = newID
	pair.ShortID = shortID
	pair.Tweet1IDStr = tw1.IDStr
	pair.Tweet1ScreenName = tw1.ScreenName
	pair.Tweet2IDStr = tw2.IDStr
	pair.Tweet2ScreenName = tw2.ScreenName

	return
}

func insertTweetPair(tx *sql.Tx, shortID string, tweet1 model.DBTweet, tweet2 model.DBTweet) (newID int, err error) {
	row := tx.QueryRow(`
    INSERT INTO tweet_pairs (short_id, tweet1_id_str, tweet1_screen_name, tweet2_id_str, tweet2_screen_name)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING tweet_pair_id;
  `, shortID, tweet1.IDStr, tweet1.ScreenName, tweet2.IDStr, tweet2.ScreenName)

	err = row.Scan(&newID)
	return
}

var shortIDAlphabet = []rune("0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz")

func createUniqueShortID(tx *sql.Tx, length int) (shortID string, err error) {
	foundID := false
	buildID := make([]rune, length)
	for !foundID {
		for i := 0; i < length; i++ {
			index := int(rand.Float64() * float64(len(shortIDAlphabet)))
			buildID[i] = shortIDAlphabet[index]
		}

		log.Println("Trying", string(buildID), buildID)
		_, err = GetTweetPairByShortID(tx, string(buildID))
		if err == sql.ErrNoRows {
			foundID = true
			shortID = string(buildID)
			err = nil
		}
		if err != nil {
			return
		}
	}
	return
}
