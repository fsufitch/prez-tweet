package model

// TweetAuthor represents a conceptual presidential tweet author
// This can correspond to multiple actual Twitter accounts
type TweetAuthor struct {
	ScreenNames []string
	ModernDay   bool
}

// Obama is Barack Obama
var Obama = TweetAuthor{
	ScreenNames: []string{"BarackObama", "POTUS44"},
	ModernDay:   false,
}

// Trump is Donald Trump
var Trump = TweetAuthor{
	ScreenNames: []string{"realDonaldTrump", "POTUS"},
	ModernDay:   true,
}
