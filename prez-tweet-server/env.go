package server

import (
	"errors"
	"fmt"
	"log"
	"os"
	"strconv"

	"github.com/fsufitch/prez-tweet/prez-tweet-server/db"
	"github.com/fsufitch/prez-tweet/prez-tweet-server/twitter"
)

var apiHost, uiResURL, herokuAppName, twitterAPIToken, dbURL string
var webPort int

func initEnv() (err error) {
	twitterAPIToken = os.Getenv("TWITTER_AUTH")
	if twitterAPIToken == "" {
		return errors.New("Could not determine Twitter authentication string")
	}
	twitter.CreateClient(twitterAPIToken)

	dbURL = os.Getenv("DATABASE_URL")
	if dbURL == "" {
		return errors.New("Could not determine database URL")
	}
	err = db.CreateConnection(dbURL)
	if err != nil {
		return
	}

	webPort, err = strconv.Atoi(os.Getenv("PORT"))
	if err != nil || webPort == 0 {
		log.Println("PORT not set, using default")
		webPort = 8080
		err = nil
	}

	uiResURL = os.Getenv("UI_RES_URL")
	if uiResURL == "" {
		return errors.New("Could not determine UI resources URL")
	}

	herokuAppName = os.Getenv("HEROKU_APP_NAME")

	apiHost = os.Getenv("API_HOST")
	if apiHost == "" {
		if herokuAppName == "" {
			return errors.New("Could not determine API URL")
		}
		apiHost = herokuAppName + ".herokuapp.com"
		log.Println("API_HOST not set, using default: " + apiHost)
	}

	return
}

func getServeAddress() string {
	return fmt.Sprintf(":%d", webPort)
}
