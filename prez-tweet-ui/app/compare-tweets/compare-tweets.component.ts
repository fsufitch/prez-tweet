import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { CompareTweetsService } from '../shared';

@Component({
  selector: 'compare-tweets',
  template: require('./compare-tweets.component.html'),
  styles: [require('./compare-tweets.component.scss')],
})
export class CompareTweetsComponent {
  constructor(
    private route: ActivatedRoute,
    private compareTweetsService: CompareTweetsService,
  ) {}

  pairShortId$ = this.route.data.map(({pairShortId}) => <string>pairShortId);
  tweetPair$ = this.pairShortId$.flatMap(id => this.compareTweetsService.getTweetPairByShortId(id));
  obamaTweetID$ = this.tweetPair$.map(pair => !!pair ? pair.obamaTweetID : null);
  trumpTweetID$ = this.tweetPair$.map(pair => !!pair ? pair.trumpTweetID : null);
}
