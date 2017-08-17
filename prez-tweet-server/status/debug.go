package status

import (
	"fmt"
	"os"
)

func getDebugIdentifier() string {
	appID := os.Getenv("HEROKU_APP_ID")
	if appID == "" {
		appID = "no-app-id"
	}

	commit := os.Getenv("HEROKU_SLUG_COMMIT")
	if commit == "" {
		commit = "000000"
	}

	version := os.Getenv("HEROKU_RELEASE_VERSION")
	if version == "" {
		version = "v0"
	}

	return fmt.Sprintf("%s++%s.%s", commit, appID, version)
}
