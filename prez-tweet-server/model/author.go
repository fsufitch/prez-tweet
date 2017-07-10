package model

import (
	"errors"
	"strings"
)

// TweetAuthor represents a conceptual presidential tweet author
// This can correspond to multiple actual Twitter accounts
type TweetAuthor struct {
	Name        string
	ScreenNames []string
	ModernDay   bool
}

// Obama is Barack Obama
var Obama = TweetAuthor{
	Name:        "Barack Hussein Obama",
	ScreenNames: []string{"BarackObama", "POTUS44"},
	ModernDay:   false,
}

// Trump is Donald Trump
var Trump = TweetAuthor{
	Name:        "Donald John Trump",
	ScreenNames: []string{"realDonaldTrump", "POTUS"},
	ModernDay:   true,
}

// GetAuthorByScreenName picks out which author uses the given screen name
func GetAuthorByScreenName(screenName string) (*TweetAuthor, error) {
	for _, author := range []TweetAuthor{Obama, Trump} {
		for _, searchSN := range author.ScreenNames {
			if strings.ToLower(screenName) == strings.ToLower(searchSN) {
				return &author, nil
			}
		}
	}
	return nil, errors.New("Tweet author not found with that screen name")
}

// SeparateObamaTrump takes two tweets and discerns which is Obama and which is Trump, if possible
func SeparateObamaTrump(tweet1 DBTweet, tweet2 DBTweet) (obamaTweet, trumpTweet DBTweet, err error) {
	author1, err := GetAuthorByScreenName(tweet1.ScreenName)
	if err != nil {
		return
	}
	author2, err := GetAuthorByScreenName(tweet2.ScreenName)
	if err != nil {
		return
	}

	if author1.Name == author2.Name {
		err = errors.New("authors of these tweets are the same")
		return
	}

	if author1.Name == Obama.Name && author2.Name == Trump.Name {
		obamaTweet = tweet1
		trumpTweet = tweet2
	} else if author1.Name == Trump.Name && author2.Name == Obama.Name {
		trumpTweet = tweet1
		obamaTweet = tweet2
	} else {
		err = errors.New("bizarre state, twilight zone confirmed")
	}
	return
}
