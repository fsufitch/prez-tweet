import { TweetAPIEffects } from './tweet.effects';
import { StatusAPIEffects } from './status.effects';
import { ControlSynchronizedEffects } from './control-synchronized.effects';
import { TweetPairAPIEffects } from './tweet-pair.effects';

export const EFFECTS = [
  TweetAPIEffects,
  StatusAPIEffects,
  ControlSynchronizedEffects,
  TweetPairAPIEffects,
]
