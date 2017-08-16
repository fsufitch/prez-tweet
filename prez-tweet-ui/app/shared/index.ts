export * from './status.service';
export * from './tweet.service';
export * from './twttr';

import { AppStatusService } from './status.service';
import { TweetService } from './tweet.service';
import { TwttrService } from './twttr';

export const PROVIDERS = [
  AppStatusService,
  TweetService,
  TwttrService,
];

import { TweetEffects } from './tweet.effects';

export const EFFECTS = [TweetEffects];
