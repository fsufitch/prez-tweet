package model

import "time"

// DBTweet is a representation of a row in the tweets table in the local DB
type DBTweet struct {
	IDStr      string
	ScreenName string
	CreatedAt  time.Time
	Body       string
}
