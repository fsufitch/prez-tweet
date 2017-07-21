package scrape

import "time"

// Tweet is a struct representing a scraped tweet
type Tweet struct {
	IDStr      string
	ScreenName string
	CreatedAt  time.Time
	Body       string
}

// TweetCollection is a slice of tweets with extra functionality
type TweetCollection []Tweet

// Oldest returns the oldest tweet in the collection
func (tc TweetCollection) Oldest() *Tweet {
	var oldest *Tweet
	for _, tweet := range tc {
		if oldest == nil || tweet.CreatedAt.Before(oldest.CreatedAt) {
			oldest = &tweet
		}
	}
	return oldest
}

// Unique returns a copy collection that contains only tweets with unique IDs
func (tc TweetCollection) Unique() TweetCollection {
	result := TweetCollection{}
	seenSet := map[string]bool{}
	for _, tweet := range tc {
		if _, ok := seenSet[tweet.IDStr]; !ok {
			result = append(result, tweet)
			seenSet[tweet.IDStr] = true
		}
	}
	return result
}

// Subtract subtracts the second collection from the first in a set-like manner
func (tc TweetCollection) Subtract(other TweetCollection) TweetCollection {
	found := map[string]bool{}
	for _, tweet := range other {
		found[tweet.IDStr] = true
	}

	result := TweetCollection{}
	for _, tweet := range tc {
		if f, ok := found[tweet.IDStr]; !ok || !f {
			result = append(result, tweet)
		}
	}
	return result
}
