package twitter

import (
	"strings"

	"github.com/dghubble/go-twitter/twitter"
	"github.com/dghubble/oauth1"
)

var client *twitter.Client

// CreateClient creates a reusable Twitter client using the given token
func CreateClient(tokenStr string) *twitter.Client {
	// config := &oauth2.Config{}
	// token := &oauth2.Token{AccessToken: tokenStr}
	// httpClient := config.Client(oauth2.NoContext, token)

	tokens := strings.Split(tokenStr, "::")
	tokens = append(tokens, "", "", "", "") // Just in case split fails

	config := oauth1.NewConfig(tokens[0], tokens[1]) // ("consumerKey", "consumerSecret")
	token := oauth1.NewToken(tokens[2], tokens[3])   // ("accessToken", "accessSecret")
	httpClient := config.Client(oauth1.NoContext, token)

	client = twitter.NewClient(httpClient)
	return GetClient()
}

// GetClient returns a reusable Twitter client, if initialized
func GetClient() *twitter.Client {
	return client
}

//2ht6wUw37uOEKjrhukgg1fBuS::76ZXVt5fEmRRztkxyADP6PI69qdvsJDArEhE456FwlSuskLQEu::14752754-HLdU8XRsN03c6rFDf11UTzUhUGbBTBce5WDVi197j::LQlR3G7IyYK6jyBbjuleV6ExSjrKx7V8QGKGTK4VBRSCU
