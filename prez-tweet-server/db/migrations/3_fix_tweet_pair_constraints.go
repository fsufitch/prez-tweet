package migrations

import (
	"database/sql"

	"github.com/pressly/goose"
)

func init() {
	goose.AddMigration(Up3, Down3)
}

// Up3 fixes the constraint on tweet pairs to actually make sense
func Up3(tx *sql.Tx) error {
	_, err := tx.Exec(`
    ALTER TABLE tweet_pairs DROP CONSTRAINT tweet_pairs_tweet1_id_str_tweet2_screen_name_key;
    ALTER TABLE tweet_pairs DROP CONSTRAINT tweet_pairs_tweet2_id_str_tweet1_screen_name_key;
    ALTER TABLE tweet_pairs ADD CONSTRAINT unique1 UNIQUE(tweet1_id_str, tweet2_id_str);
    ALTER TABLE tweet_pairs ADD CONSTRAINT unique2 UNIQUE(tweet2_id_str, tweet1_id_str);
  `)
	return err
}

// Down3 unfixes the constraints on tweet pairs
func Down3(tx *sql.Tx) error {
	_, err := tx.Exec(`
    ALTER TABLE tweet_pairs DROP CONSTRAINT unique1;
    ALTER TABLE tweet_pairs DROP CONSTRAINT unique2;
    ALTER TABLE tweet_pairs ADD CONSTRAINT tweet_pairs_tweet1_id_str_tweet2_screen_name_key UNIQUE(tweet1_id_str, tweet2_screen_name);
    ALTER TABLE tweet_pairs ADD CONSTRAINT tweet_pairs_tweet2_id_str_tweet1_screen_name_key UNIQUE(tweet2_id_str, tweet1_screen_name);
  `)
	return err
}
