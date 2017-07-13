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
  @Input() options: TwttrOptions = {dnt: true};
  @ViewChild("tweetContainer") private tweetContainer: ElementRef;
  tweetReady$ = new BehaviorSubject(false);

  private idStr$ = new BehaviorSubject<string>('');
  private options$ = new BehaviorSubject<TwttrOptions>({});
  private processedOptions$ = this.options$
    .map(opt => <TwttrOptions>Object.assign(opt, {dnt: true}));

  private tweetElement$ = Observable
    .zip(this.idStr$.distinctUntilChanged(), this.processedOptions$.distinctUntilChanged())
    .do(() => this.tweetReady$.next(false))
    .switchMap(([id, options]) => {
      if (!id) {
        return Observable.of<HTMLElement>(null);
      }
      let result = new Subject<HTMLElement>();
      this.twttrService.runWithTwttr(
        (twttr) => twttr.widgets.createTweet(id, this.tweetContainer.nativeElement, options)
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
    this.options$.next(this.options);
  }
}
