import { Component, Input, ElementRef, NgZone, OnChanges, ViewChild } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

import { TwttrService } from '../shared';

@Component({
  selector: 'tweet',
  template: require('./tweet.component.html'),
  styles: [require('./tweet.component.scss')],
})
export class TweetComponent implements OnChanges {
  @Input() idStr: string;
  @ViewChild("tweetContainer") private tweetContainer: ElementRef;
  tweetReady$ = new BehaviorSubject(false);

  private idStr$ = new BehaviorSubject<string>('');
  private tweetElement$ = this.idStr$
    .do(() => this.tweetReady$.next(false))
    .switchMap(id => {
      if (!id) {
        return Observable.of<HTMLElement>(null);
      }
      let result = new Subject<HTMLElement>();
      this.twttrService.runWithTwttr((twttr) => {
        twttr.widgets.createTweet(id, this.tweetContainer.nativeElement, {})
          .then(tweet => {
            console.log('got tweet', tweet)
            this.zone.run(() => result.next(tweet));
          });
        });
      return result;
    });

  private currentTweetSubscription  = this.tweetElement$
    .pairwise()
    .map(([prev, curr]) => {
      console.log(prev, curr);
      if (!!prev) {
        prev.parentNode.replaceChild(curr, prev);
        return true;
      } else if (!!curr) {
        this.tweetContainer.nativeElement.appendChild(curr);
        return true;
      }
      return false;
    })
    .filter(success => success)
    .subscribe(() => {
          this.tweetReady$.next(true);
    });


  constructor(
    private twttrService: TwttrService,
    private zone: NgZone
  ) {}

  ngOnChanges() {
    this.idStr$.next(this.idStr);
  }
}
