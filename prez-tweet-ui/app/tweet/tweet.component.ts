import { Component, Input, ElementRef, NgZone, OnChanges, ViewChild, ViewEncapsulation } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

import { TwttrService } from '../shared';

@Component({
  selector: 'tweet',
  template: require('./tweet.component.html'),
  styles: [require('./tweet.component.scss')],
  encapsulation: ViewEncapsulation.None, // Necessary to prevent flicker
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
      this.twttrService.runWithTwttr(
        (twttr) => twttr.widgets.createTweet(id, this.tweetContainer.nativeElement, {})
          .then(tweet => this.zone.run(() => result.next(tweet)))
      );
      return result;
    });

  private currentTweetSubscription  = this.tweetElement$
    .pairwise()
    .map(([prev, curr]) => {
      if (!!curr && !!prev) {
        (<HTMLDivElement>this.tweetContainer.nativeElement).removeChild(prev);
      }
      return !!curr;
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
