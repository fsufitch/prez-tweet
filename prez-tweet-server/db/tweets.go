package db

import (
	"database/sql"

	"github.com/fsufitch/prez-tweet/prez-tweet-server/model"
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
	queryArgsStr, iArgs := stringQueryArgsList(StrIDs)

	rows, err := tx.Query(`
    SELECT t.tweet_id_str, t.screen_name, t.created_at, t.body
    FROM tweets t
    WHERE t.tweet_id_str IN (`+queryArgsStr+`)
	`, iArgs...)
	if err != nil {
		return
	}
	defer rows.Close()

	tweetMap = map[string]model.DBTweet{}
	for rows.Next() {
		var t model.DBTweet
		rows.Scan(&t.IDStr, &t.ScreenName, &t.CreatedAt, &t.Body)
		tweetMap[t.IDStr] = t
	}
	return
}

// GetMostRecentTweet recovers the most recent tweet for a given presidential author
func GetMostRecentTweet(tx *sql.Tx, author model.TweetAuthor) (t model.DBTweet, err error) {
	queryArgsStr, iArgs := stringQueryArgsList(author.ScreenNames)
	row := tx.QueryRow(`
		SELECT t.tweet_id_str, t.screen_name, t.created_at, t.body
		FROM tweets t
		WHERE t.screen_name IN (`+queryArgsStr+`)
		ORDER BY t.created_at DESC
		LIMIT 1;
	`, iArgs...)
	err = row.Scan(&t.IDStr, &t.ScreenName, &t.CreatedAt, &t.Body)
	return
}
