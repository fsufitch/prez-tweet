package model

// TweetPair represents a unique pairing of two tweets
type TweetPair struct {
	ID               int
	ShortID          string
	Tweet1IDStr      string
	Tweet1ScreenName string
	Tweet2IDStr      string
	Tweet2ScreenName string
}
