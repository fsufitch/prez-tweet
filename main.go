package main

import (
	"log"
	"math/rand"
	"os"
	"os/signal"
	"time"

	"github.com/fsufitch/prez-tweet/prez-tweet-server"
)

func main() {
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
		break
	case err := <-serverQuitChan:
		log.Fatal(err)
	}
}
