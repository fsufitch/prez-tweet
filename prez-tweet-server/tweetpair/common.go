package tweetpair

// interface PairAPIResponse {
//   short_id: TweetPairShortID;
//   obama_tweet_id_str: TweetID;
//   trump_tweet_id_str: TweetID;
// }

type tweetPairResponse struct {
	PairID          int    `json:"pair_id"`
	ShortID         string `json:"short_id"`
	ObamaTweetIDStr string `json:"obama_tweet_id_str"`
	TrumpTweetIDStr string `json:"trump_tweet_id_str"`
}
