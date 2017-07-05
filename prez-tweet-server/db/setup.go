package db

import (
	"database/sql"
	"errors"
	"log"

	_ "github.com/fsufitch/prez-tweet/prez-tweet-server/db/migrations" // Migrations for goose
	_ "github.com/lib/pq"                                              // Postgres database driver
	"github.com/pressly/goose"
)

var connection *sql.DB

// CreateConnection creates a re-useable global database connection
func CreateConnection(dburl string) error {
	newConn, err := sql.Open("postgres", dburl)

	if connection != nil {
		connection.Close()
	}
	connection = newConn
	return err
}

// NewTransaction creates a new transaction in the global database
func NewTransaction() (tx *sql.Tx, err error) {
	if connection == nil {
		err = errors.New("No database connection available")
		return
	}
	tx, err = connection.Begin()
	return
}

// RunMigrations attempts to run database migrations on the global database
func RunMigrations() (err error) {
	if connection == nil {
		return errors.New("No global database connection")
	}
	log.Println("Running database migrations...")
	err = goose.SetDialect("postgres")
	if err != nil {
		return
	}

	err = goose.Run("up", connection, ".")

	return
}
