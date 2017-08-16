import { Injectable } from '@angular/core';

import { Actions, Effect } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Observable } from 'rxjs';

import * as Moment from 'moment';

import {
  Tweet,
  TweetAuthor,
  TriggerSynchronizedNewerAction,
  TriggerSynchronizedOlderAction,
  UpdateTweetPairFromPairAction,
  SetCurrentTweetPairAction,
} from '../../store';

import { TweetService } from '../shared';

interface NextTweetIDs { obama: string; trump: string }

@Injectable()
export class ControlsEffects {
  constructor(
    private actions: Actions,
    private tweetService: TweetService,
  ) {}

  private triggerSyncOlder$ = this.actions
  .ofType(TriggerSynchronizedOlderAction.type)
  .map(action => (<TriggerSynchronizedOlderAction>action).payload)
  .map(({obamaTweet, trumpTweet, offsetYears}) => this.isTrumpOlder(obamaTweet.timestamp, trumpTweet.timestamp, offsetYears)
    ? this.getOlderTweetIDs(obamaTweet, trumpTweet, 'obama')
    : this.getOlderTweetIDs(obamaTweet, trumpTweet, 'trump')
  );

  private triggerSyncNewer$ = this.actions
  .ofType(TriggerSynchronizedNewerAction.type)
  .map(action => (<TriggerSynchronizedNewerAction>action).payload)
  .map(({obamaTweet, trumpTweet, offsetYears}) => this.isTrumpOlder(obamaTweet.timestamp, trumpTweet.timestamp, offsetYears)
    ? this.getNewerTweetIDs(obamaTweet, trumpTweet, 'trump')
    : this.getNewerTweetIDs(obamaTweet, trumpTweet, 'obama')
  );

  @Effect() populateNextTweetPair$ = Observable.merge(this.triggerSyncOlder$, this.triggerSyncNewer$)
    .flatMap(({obama, trump}) => this.tweetService.getTweetPairFromTweets(obama, trump)
      .map(pair => ({obama, trump, pairExists: !!pair}))
    )
    .filter(({pairExists}) => !pairExists)
    .map(({obama, trump}) => new UpdateTweetPairFromPairAction({obamaTweetID: obama, trumpTweetID: trump}));

  @Effect() setNextTweetPair$ = Observable.merge(this.triggerSyncOlder$, this.triggerSyncNewer$)
    .flatMap(({obama, trump}) => this.tweetService.getTweetPairFromTweets(obama, trump))
    .filter(pair => !!pair)
    .map(pair => new SetCurrentTweetPairAction({id: pair.shortID}));

  private isTrumpOlder(obamaTimestamp: Moment.Moment, trumpTimestamp: Moment.Moment, obamaOffsetYears: number) {
    return obamaTimestamp.add(Moment.duration(obamaOffsetYears, 'years')).isAfter(trumpTimestamp);
  }

  private getOlderTweetIDs(obamaTweet: Tweet, trumpTweet: Tweet, priority: TweetAuthor) {
    let result: NextTweetIDs = {obama: obamaTweet.idStr, trump: trumpTweet.idStr}
    if (priority == 'obama') {
      if (obamaTweet.previousIDStr) {
        result.obama = obamaTweet.previousIDStr;
      } else if (trumpTweet.previousIDStr) {
        result.trump = trumpTweet.previousIDStr;
      }
    } else if (priority == 'trump') {
      if (trumpTweet.previousIDStr) {
        result.trump = trumpTweet.previousIDStr;
      }
      else if (obamaTweet.previousIDStr) {
        result.obama = obamaTweet.previousIDStr;
      }
    }
    return result;
  }

  private getNewerTweetIDs(obamaTweet: Tweet, trumpTweet: Tweet, priority: TweetAuthor) {
    let result: NextTweetIDs = {obama: obamaTweet.idStr, trump: trumpTweet.idStr}
    if (priority == 'obama') {
      if (obamaTweet.nextIDStr) {
        result.obama = obamaTweet.nextIDStr;
      } else if (trumpTweet.nextIDStr) {
        result.trump = trumpTweet.nextIDStr;
      }
    } else if (priority == 'trump') {
      if (trumpTweet.nextIDStr) {
        result.trump = trumpTweet.nextIDStr;
      }
      else if (obamaTweet.nextIDStr) {
        result.obama = obamaTweet.nextIDStr;
      }
    }
    return result;
  }}
