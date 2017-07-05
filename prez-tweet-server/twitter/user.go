package twitter

import (
	"log"
	"time"

	"github.com/dghubble/go-twitter/twitter"
)

type getUserCacheEntry struct {
	User      *twitter.User
	Timestamp time.Time
}

type getUserCache struct {
	Life  time.Duration
	cache map[string]getUserCacheEntry
}

func (c getUserCache) Get(key string) *twitter.User {
	cacheEntry, ok := c.cache[key]
	if !ok {
		return nil
	}

	if time.Now().Sub(cacheEntry.Timestamp) > c.Life {
		delete(c.cache, key)
		return nil
	}

	return cacheEntry.User
}

func (c getUserCache) Set(key string, user *twitter.User) {
	c.cache[key] = getUserCacheEntry{
		User:      user,
		Timestamp: time.Now(),
	}
}

var globalGetUserCache = getUserCache{
	Life:  1 * time.Minute,
	cache: map[string]getUserCacheEntry{},
}

// GetUser gets a user from Twitter for a certain screen name
// Results are cached for a minute
func GetUser(screenName string) (user *twitter.User, err error) {
	user = globalGetUserCache.Get(screenName)
	if user != nil {
		return
	}

	log.Printf("[Twitter] Getting user for screen name: %s", screenName)
	user, _, err = GetClient().Users.Show(&twitter.UserShowParams{ScreenName: screenName})

	if user != nil && err == nil {
		globalGetUserCache.Set(screenName, user)
	}

	return
}
