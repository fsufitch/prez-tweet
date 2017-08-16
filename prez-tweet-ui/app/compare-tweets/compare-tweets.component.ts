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

  tweetPair$ = this.route.data.map(({tweetPair}) => <TweetPair>tweetPair)
  obamaTweetID$ = this.tweetPair$.map(pair => !!pair ? pair.obamaTweetID : null);
  trumpTweetID$ = this.tweetPair$.map(pair => !!pair ? pair.trumpTweetID : null);
}
