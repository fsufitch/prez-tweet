package server

import (
	"errors"
	"fmt"
	"log"
	"os"
	"strconv"
)

var apiHost, uiResURL, herokuAppName, twitterAPIToken string
var webPort int

func initEnv() (err error) {
	twitterAPIToken = os.Getenv("TWITTER_TOKEN")
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
