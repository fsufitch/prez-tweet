package main

import (
	"errors"
	"log"
	"math/rand"
	"os"
	"os/signal"
	"time"

	pb "gopkg.in/cheggaaa/pb.v1"

	"github.com/fsufitch/prez-tweet/prez-tweet-server"
	"github.com/urfave/cli"
)

func serve(ctx *cli.Context) error {
	rand.Seed(time.Now().Unix())
	interruptChan := make(chan os.Signal)
	signal.Notify(interruptChan, os.Interrupt)

	serverQuitChan := make(chan error)
	go func() {
		serverQuitChan <- server.StartServer()
	}()

	select {
	case <-interruptChan:
		log.Println("Received interrupt. Quitting.")
		return nil
	case err := <-serverQuitChan:
		return err
	}
}

func importArchive(ctx *cli.Context) error {
	path := ctx.Args().First()
	if path == "" {
		return errors.New("No JSON tweet archive specified")
	}

	bar := pb.New(0)
	bar.Start()
	for progress := range server.AsyncImportArchive(path) {
		if progress.Error != nil {
			bar.Finish()
			return progress.Error
		}
		bar.SetTotal(int64(progress.Total))
		bar.SetCurrent(int64(progress.Complete))
	}
	bar.Finish()
	return nil
}

func main() {
	app := cli.NewApp()
	app.Name = "prez-tweet"
	app.Usage = "API backend for a webapp comparatively displaying presidential tweets"
	app.Commands = []cli.Command{
		cli.Command{
			Name:   "serve",
			Usage:  "start the prez-tweet server using configuration from the environment",
			Action: serve,
		},
		cli.Command{
			Name:      "import-archive",
			Aliases:   []string{"ia"},
			Usage:     "import a JSON archive of historical tweets",
			Action:    importArchive,
			ArgsUsage: "jsonFile",
		},
	}
	app.RunAndExitOnError()
}
