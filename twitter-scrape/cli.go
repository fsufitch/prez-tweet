package scrape

import (
	"fmt"
	"os"

	"github.com/urfave/cli"
)

func cliAction(ctx *cli.Context) error {
	users := ctx.StringSlice("user")
	maxTweets := ctx.Int("max")
	pretty := ctx.Bool("pretty")

	tweets, multiErr := Many(users, maxTweets)
	if multiErr != nil {
		for _, err := range multiErr.Errors {
			fmt.Fprintf(os.Stderr, "%v\n", err)
		}
		panic(multiErr)
	}

	export, err := tweets.exportJSON(pretty)
	if err != nil {
		panic(err)
	}

	fmt.Println(string(export))

	return nil
}

// Run is a function to trigger command line functionality
func Run() {
	app := cli.NewApp()
	app.Name = "twitter-scraper"
	app.Usage = "scrape old tweets from Twitter"
	app.Flags = []cli.Flag{
		cli.StringSliceFlag{
			Name:  "user, u",
			Usage: "Twitter screen name of user to look up (can be specified multiple times)",
		},
		cli.IntFlag{
			Name:  "max",
			Usage: "maximum number of tweets to retrieve per screen name",
			Value: 0,
		},
		cli.BoolFlag{
			Name:  "pretty, p",
			Usage: "turn on pretty-print for JSON output",
		},
	}
	app.Action = cliAction
	app.Run(os.Args)
}
