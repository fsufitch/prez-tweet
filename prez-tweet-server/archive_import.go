package server

import (
	"encoding/json"
	"errors"
	"io/ioutil"
	"log"
	"os"
	"time"

	"github.com/fsufitch/prez-tweet/prez-tweet-server/db"
	scrape "github.com/fsufitch/prez-tweet/twitter-scrape"
)

// ImportProgress is a struct that encapsulates reporting progress of the import
type ImportProgress struct {
	Complete int
	Total    int
	Error    error
}

// AsyncImportArchive imports a JSON tweet archive from the path to the DB
func AsyncImportArchive(path string) (progressChan chan ImportProgress) {
	progressChan = make(chan ImportProgress)
	go importArchive(path, progressChan)
	return progressChan
}

func importArchive(path string, progressChan chan<- ImportProgress) {
	var err error
	data, err := ioutil.ReadFile(path)
	if err != nil {
		progressChan <- ImportProgress{Error: err}
		close(progressChan)
		return
	}

	archive := scrape.TweetCollectionExportJSON{}
	err = json.Unmarshal(data, &archive)
	if err != nil {
		progressChan <- ImportProgress{Error: err}
		close(progressChan)
		return
	}
	log.Println("Loaded archive with timestamp: ", archive.ExportTimestamp)

	err = setupImportEnvironment()
	if err != nil {
		progressChan <- ImportProgress{Error: err}
		close(progressChan)
		return
	}
	tx, err := db.NewTransaction()
	if err != nil {
		progressChan <- ImportProgress{Error: err}
		close(progressChan)
		return
	}
	log.Println("Set up import environment")

	complete := 0
	total := len(archive.Tweets)
	progressChan <- ImportProgress{Complete: complete, Total: total}

	for _, tw := range archive.Tweets {
		createdAtTime := time.Unix(tw.CreatedAt, 0)
		_, err = tx.Exec(`
			INSERT INTO tweets (tweet_id_str, screen_name, created_at, body)
			VALUES ($1, $2, $3, $4)
			ON CONFLICT DO NOTHING;
		`, tw.IDStr, tw.ScreenName, createdAtTime, tw.Body)
		if err != nil {
			tx.Rollback()
			progressChan <- ImportProgress{Complete: complete, Total: total, Error: err}
			close(progressChan)
			return
		}
		complete++
		progressChan <- ImportProgress{Complete: complete, Total: total}
	}

	err = tx.Commit()
	if err != nil {
		progressChan <- ImportProgress{Complete: complete, Total: total, Error: err}
		close(progressChan)
		return
	}

	close(progressChan)
}

func setupImportEnvironment() error {
	dbURL = os.Getenv("DATABASE_URL")
	if dbURL == "" {
		return errors.New("Could not determine database URL")
	}
	return db.CreateConnection(dbURL)
}
