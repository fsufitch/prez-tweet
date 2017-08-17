import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { TweetService } from '../shared';
import { TweetPair } from '../../store';

@Component({
  selector: 'compare-tweets',
  template: require('./compare-tweets.component.html'),
  styles: [require('./compare-tweets.component.scss')],
})
export class CompareTweetsComponent {
  constructor(
    private route: ActivatedRoute,
    private tweetService: TweetService,
  ) {}

  tweetPair$ = this.route.data.map(({tweetPair}) => <TweetPair>tweetPair);
  obamaTweetID$ = this.tweetPair$.map(pair => !!pair ? pair.obamaTweetID : null);
  trumpTweetID$ = this.tweetPair$.map(pair => !!pair ? pair.trumpTweetID : null);
  obamaTweet$ = this.obamaTweetID$.flatMap(id => this.tweetService.getTweet(id)).filter(tw => !!tw);
  trumpTweet$ = this.trumpTweetID$.flatMap(id => this.tweetService.getTweet(id)).filter(tw => !!tw);

  prevObamaTweetID$ = this.obamaTweet$.map(tw => tw.previousIDStr);
  nextObamaTweetID$ = this.obamaTweet$.map(tw => tw.nextIDStr);
  prevTrumpTweetID$ = this.trumpTweet$.map(tw => tw.previousIDStr);
  nextTrumpTweetID$ = this.trumpTweet$.map(tw => tw.nextIDStr);

  navigateTweet(tweetID: string, replace: 'obama' | 'trump') {
    this.tweetPair$.take(1)
      .map(pair => {
        switch(replace) {
          case 'obama': return {obama: tweetID, trump: pair.trumpTweetID};
          case 'trump': return {obama: pair.obamaTweetID, trump: tweetID};
          default: throw 'unknown replacement in pair ' + replace;
        }
      })
      .flatMap(({obama, trump}) => this.tweetService.getTweetPairFromTweets(obama, trump)
        .map(pair => ({obama, trump, pair}))
      )
      .do(({obama, trump, pair}) => {
        if (!pair) {
          this.tweetService.populateTweetPairFromTweets(obama, trump);
        }
      })
      .first(({pair}) => !!pair)
      .subscribe(({pair}) => this.tweetService.setCurrentTweetPairID(pair.shortID));
  }
}
