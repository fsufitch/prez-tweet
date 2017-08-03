export type TweetID = string;
export type TweetPairLongID = string;
export type TweetPairShortID = string;

export function createTweetPairLongID(obamaTweetID: TweetID, trumpTweetID: TweetID): TweetPairLongID {
  return `${obamaTweetID}::${trumpTweetID}`;
}

export function extractTweetIDs(longID: TweetPairLongID): {obamaTweetID: TweetID, trumpTweetID: TweetID} {
  let [obamaTweetID, trumpTweetID] = longID.split('::');
  return {obamaTweetID, trumpTweetID};
}
