package main

import (
	"log"
	"os"
	"os/signal"

	"github.com/fsufitch/prez-tweet/prez-tweet-server"
)

func main() {
	interruptChan := make(chan os.Signal)
	signal.Notify(interruptChan, os.Interrupt)

	serverQuitChan := make(chan error)
	go func() {
		serverQuitChan <- server.StartServer()
	}()

	select {
	case <-interruptChan:
		log.Println("Received interrupt. Quitting.")
		break
	case err := <-serverQuitChan:
		log.Fatal(err)
	}
}
