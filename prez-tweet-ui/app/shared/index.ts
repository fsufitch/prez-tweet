export * from './status.service';
export * from './tweet.service';
export * from './twttr';
export * from './compare-tweets.service';

import { AppStatusService } from './status.service';
import { TweetService } from './tweet.service';
import { TwttrService } from './twttr';
import { CompareTweetsService } from './compare-tweets.service';

export const PROVIDERS = [
  AppStatusService,
  TweetService,
  TwttrService,
  CompareTweetsService,
];
