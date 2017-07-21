package migrations

import (
	"database/sql"
	"log"

	"github.com/pressly/goose"
)

func init() {
	goose.AddMigration(Up2, Down2)
}

// Up2 imports the old pre-generated tweet archive
func Up2(tx *sql.Tx) error {
	log.Println("2_import_archive has been removed, skipping")
	return nil
}

// Down2 removes all tweets in the old archive
func Down2(tx *sql.Tx) error {
	log.Println("2_import_archive has been removed, skipping")
	return nil
}
