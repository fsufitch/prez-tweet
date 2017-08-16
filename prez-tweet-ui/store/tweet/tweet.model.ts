import * as Moment from 'moment';

export type TweetAuthor = 'obama' | 'trump' | 'unknown';

export interface Tweet {
  idStr: string;
  screenName: string;
  author: TweetAuthor;
  body: string;
  timestamp: Moment.Moment;
  previousIDStr: string;
  nextIDStr: string;
}

export interface TweetPair {
  id: string;
  shortID: string;
  obamaTweetID: string;
  trumpTweetID: string;
}

export function createTweetPairLongID(obamaTweetID: string, trumpTweetID: string) {
  return `${obamaTweetID}::${trumpTweetID}`;
}
