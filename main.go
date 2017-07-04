package main

import (
	"log"

	"github.com/fsufitch/prez-tweet/prez-tweet-server"
)

func main() {
	log.Fatal(server.StartServer())
}
