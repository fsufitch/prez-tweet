package server

import (
	"errors"
	"fmt"
	"log"
	"os"
	"strconv"
)

var apiHost, jsBundleURL, dynoID, twitterAPIToken string
var webPort int

func initEnv() (err error) {
	twitterAPIToken = os.Getenv("TWITTER_TOKEN")
	webPort, err = strconv.Atoi(os.Getenv("PORT"))
	if err != nil || webPort == 0 {
		log.Println("PORT not set, using default")
		webPort = 8080
		err = nil
	}

	jsBundleURL = os.Getenv("JS_BUNDLE")
	if jsBundleURL == "" {
		return errors.New("Could not determing JS bundle URL")
	}

	dynoID = os.Getenv("HEROKU_DYNO_ID")

	apiHost = os.Getenv("API_HOST")
	if apiHost == "" {
		if dynoID == "" {
			return errors.New("Could not determine API URL")
		}
		apiHost = fmt.Sprintf("https://%s.herokuapp.com", dynoID)
		log.Println("API_HOST not set, using default: " + apiHost)
	}

	return
}

func getServeAddress() string {
	return fmt.Sprintf(":%d", webPort)
}
