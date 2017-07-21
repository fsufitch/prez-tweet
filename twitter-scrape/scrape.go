package scrape

import (
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"net/url"
	"os"
	"strings"
	"time"
)

// MultiError is a collection of errors that may have occurred during a parallel operation
type MultiError struct {
	Errors []error
}

func (e *MultiError) Error() string {
	return "Error occurred during scrape. See .Errors property for details"
}

// Many returns the most recent tweets for a given collection of screen names
func Many(screenNames []string, maxPerScreenName int) (TweetCollection, *MultiError) {
	errChannel := make(chan error)
	resultChannel := make(chan TweetCollection)

	for _, screenName := range screenNames {
		screenNameCopy := screenName
		go func() {
			tweets, err := Single(screenNameCopy, maxPerScreenName)
			if err != nil {
				errChannel <- err
			} else {
				resultChannel <- tweets
			}
		}()
	}

	screenNamesComplete := 0
	resultTweets := TweetCollection{}
	resultErrors := []error{}
	for screenNamesComplete < len(screenNames) {
		select {
		case tweets := <-resultChannel:
			resultTweets = append(resultTweets, tweets...)
			screenNamesComplete++
		case err := <-errChannel:
			resultErrors = append(resultErrors, err)
			screenNamesComplete++
		}
	}

	if len(resultErrors) > 0 {
		return resultTweets, &MultiError{Errors: resultErrors}
	}

	return resultTweets, nil
}

// Single scrapes most recent tweets from a single user, up to a maximum
func Single(screenName string, maxTweets int) (collection TweetCollection, err error) {
	collection = TweetCollection{}
	before := time.Now()
	maxPosition := ""
	done := false
	reSearch := false

	for !done {
		query := scrapeQuery{
			ScreenName:  screenName,
			Before:      &before,
			MaxPosition: maxPosition,
		}
		url := query.buildTwitterURL()

		var response *http.Response
		response, err = http.Get(url.String())
		if err != nil {
			return
		}
		data, _ := ioutil.ReadAll(response.Body)
		tweets, hasMore, nextMaxID, parseErr := parseScrapeData(data)
		if parseErr != nil {
			err = parseErr
			fmt.Fprintln(os.Stderr, "Scrape parse error", err.Error())
			return
		}

		newTweets := tweets.Subtract(collection)
		if len(newTweets) == 0 {
			done = true
		}

		collection = append(collection, newTweets...)
		if maxTweets > 0 && len(collection) >= maxTweets {
			done = true
		}
		log.Printf(" ... Got %d new tweets for %s (now: %d)", len(newTweets), screenName, len(collection))

		if hasMore {
			maxPosition = nextMaxID
			reSearch = true
		} else if reSearch && len(tweets) > 0 {
			maxPosition = ""
			before = tweets.Oldest().CreatedAt
		} else {
			done = true
		}
	}

	collection = collection.Unique()

	return
}

type scrapeQuery struct {
	ScreenName  string
	Before      *time.Time
	After       *time.Time
	MaxPosition string
}

func (q scrapeQuery) buildTwitterURL() url.URL {
	u := url.URL{
		Scheme: "https",
		Host:   "twitter.com",
		Path:   "/i/search/timeline",
	}

	queryValues := url.Values{}

	queryValues.Set("f", "tweets")
	queryValues.Set("src", "typd")
	queryValues.Set("max_position", q.MaxPosition)

	qArgParts := []string{}
	if q.ScreenName != "" {
		qArgParts = append(qArgParts, "from:"+q.ScreenName)
	}
	if q.Before != nil {
		dateStr := q.Before.Format("2006-01-02")
		qArgParts = append(qArgParts, "until:"+dateStr)
	}
	if q.After != nil {
		dateStr := q.After.Format("2006-01-02")
		qArgParts = append(qArgParts, "since:"+dateStr)
	}

	qArg := strings.Join(qArgParts, " ")
	queryValues.Set("q", qArg)

	u.RawQuery = queryValues.Encode()

	return u
}
