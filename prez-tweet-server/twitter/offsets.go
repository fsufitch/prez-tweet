package twitter

import "github.com/fsufitch/prez-tweet/prez-tweet-server/model"

func beforeWithOffset(tweet1 model.DBTweet, tweet2 model.DBTweet, tweet1OffsetYears int) bool {
	time1 := tweet1.CreatedAt.AddDate(-1*tweet1OffsetYears, 0, 0)
	time2 := tweet2.CreatedAt
	return time1.Before(time2)
}
