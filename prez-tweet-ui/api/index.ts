import { TweetAPIEffects } from './tweet.effects';
import { StatusAPIEffects } from './status.effects';
import { ControlSynchronizedEffects } from './control-synchronized.effects';

export const API_EFFECTS = [
  TweetAPIEffects,
  StatusAPIEffects,
  ControlSynchronizedEffects,
]
