package db

import (
	"database/sql"

	"github.com/fsufitch/prez-tweet/prez-tweet-server/model"
	"github.com/lib/pq"
)

// InsertTweet inserts a tweet into the transaction
func InsertTweet(tx *sql.Tx, tw model.DBTweet) error {
	_, err := tx.Exec(`
    INSERT INTO tweets (tweet_id_str, screen_name, created_at, body)
    VALUES ($1, $2, $3, $4);
  `, tw.IDStr, tw.ScreenName, tw.CreatedAt, tw.Body)
	return err
}

// GetTweetsFromIDs recovers any tweets available for the given IDs
func GetTweetsFromIDs(tx *sql.Tx, StrIDs []string) (tweetMap map[string]model.DBTweet, err error) {
	rows, err := tx.Query(`
    SELECT t.tweet_id_str, t.screen_name, t.created_at, t.body
    FROM tweets t
    WHERE t.tweet_id_str IN ($1)`, pq.Array(StrIDs),
	)
	if err != nil {
		return
	}
	defer rows.Close()

	for rows.Next() {
		var t model.DBTweet
		rows.Scan(&t.IDStr, &t.ScreenName, &t.CreatedAt, &t.Body)
		tweetMap[t.IDStr] = t
	}
	return
}
