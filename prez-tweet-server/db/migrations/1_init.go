package migrations

import (
	"database/sql"

	"github.com/pressly/goose"
)

func init() {
	goose.AddMigration(Up1, Down1)
}

// Up1 updates the database to the new requirements
func Up1(tx *sql.Tx) error {
	_, err := tx.Exec(`
		CREATE TABLE tweets (
			tweet_id_str VARCHAR(24) PRIMARY KEY,
      screen_name  VARCHAR(24) NOT NULL,
			created_at   TIMESTAMP NOT NULL,
			body         TEXT NOT NULL
		);

    CREATE TABLE tweet_pairs (
      tweet_pair_id      INT PRIMARY KEY,
      short_id           VARCHAR(10) UNIQUE NOT NULL,
      tweet1_id_str      VARCHAR(24) NOT NULL REFERENCES tweets (tweet_id_str) ON DELETE CASCADE,
      tweet1_screen_name VARCHAR(24) NOT NULL,
      tweet2_id_str      VARCHAR(24) NOT NULL REFERENCES tweets (tweet_id_str) ON DELETE CASCADE,
      tweet2_screen_name VARCHAR(24) NOT NULL,
      UNIQUE(tweet1_id_str, tweet2_screen_name),
      UNIQUE(tweet2_id_str, tweet1_screen_name)
    );
    CREATE INDEX tweet_pairs_short_id_idx ON tweet_pairs (short_id);
    CREATE SEQUENCE tweet_pair_id_seq;
		ALTER TABLE tweet_pairs ALTER tweet_pair_id SET DEFAULT NEXTVAL('tweet_pair_id_seq');
	`)
	return err
}

// Down1 should send the database back to the state it was from before Up was ran
func Down1(tx *sql.Tx) error {
	_, err := tx.Exec(`
		DROP SEQUENCE tweet_pair_id_seq;
    DROP TABLE tweet_pairs;
    DROP TABLE tweets;
	`)
	return err
}
