package migrations

import (
	"database/sql"
	"encoding/csv"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"strings"
	"time"

	pb "gopkg.in/cheggaaa/pb.v1"

	scrape "github.com/fsufitch/prez-tweet/twitter-scrape"
	"github.com/pressly/goose"
)

func init() {
	goose.AddMigration(Up2, Down2)
}

// Up2 imports the old pre-generated tweet archive
func Up2(tx *sql.Tx) error {
	archive, err := loadArchiveJSON([]byte(tweetArchiveJSON))
	if err != nil {
		return err
	}
	log.Println("Archive timestamp: ", archive.ExportTimestamp)
	log.Println(archive.UserCounts, "total:", len(archive.Tweets))
	bar := pb.StartNew(len(archive.Tweets))

	for _, tw := range archive.Tweets {
		createdAtTime := time.Unix(tw.CreatedAt, 0)
		_, err = tx.Exec(`
			INSERT INTO tweets (tweet_id_str, screen_name, created_at, body)
			VALUES ($1, $2, $3, $4)
			ON CONFLICT DO NOTHING;
		`, tw.IDStr, tw.ScreenName, createdAtTime, tw.Body)
		if err != nil {
			bar.Finish()
			return err
		}
		bar.Increment()
	}
	bar.Finish()

	return nil
}

// Down2 removes all tweets in the old archive
func Down2(tx *sql.Tx) error {

	return nil
}

type tweetCSVRecord struct {
	IDStr      string
	ScreenName string
	CreatedAt  time.Time
	Body       string
}

func parseRecord(raw []string) (*tweetCSVRecord, error) {
	record := tweetCSVRecord{
		IDStr:      raw[8],
		ScreenName: raw[0],
		Body:       raw[4],
	}

	createdAt, err := time.Parse("2006-01-02 15:04", raw[1])
	if err != nil {
		return nil, err
	}

	record.CreatedAt = createdAt

	return &record, nil
}

func asyncLoadCSV(data string) (chan []string, chan error) {
	reader := csv.NewReader(strings.NewReader(data))
	reader.Comma = ';'
	reader.LazyQuotes = true
	records := make(chan []string)
	errChan := make(chan error)
	go func() {
		var err error
		var record []string
		_, err = reader.Read() // Skip first line
	doneReading:
		for {
			if err == nil {
				if record != nil {
					records <- record
				}
			} else if err == io.EOF {
				break doneReading
			} else {
				switch err.(*csv.ParseError).Err {
				case csv.ErrFieldCount:
					// ignore
				default:
					errChan <- fmt.Errorf("CSV parse error: %v", err)
					break doneReading
				}
			}
			record, err = reader.Read()
		}
		close(records)
		close(errChan)
	}()
	return records, errChan
}

func loadArchiveJSON(data []byte) (*scrape.TweetCollectionExportJSON, error) {
	result := &scrape.TweetCollectionExportJSON{}
	err := json.Unmarshal(data, result)
	if err != nil {
		return nil, err
	}
	return result, nil
}
