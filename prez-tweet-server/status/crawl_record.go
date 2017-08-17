package status

import "time"

var lastCrawlAt time.Time

// RecordCrawlFinished updates the in-memory timestamp of the last crawl
func RecordCrawlFinished() {
	lastCrawlAt = time.Now()
}
