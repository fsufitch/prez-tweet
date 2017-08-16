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
  tweetReady = false;

  private tweetElement: HTMLElement;

  constructor(
    private twttrService: TwttrService,
    private zone: NgZone
  ) {}

  ngOnChanges() {
    this.updateTweet(this.idStr, this.options);
  }

  private updateTweet(id: string, options: TwttrOptions={}) {
    this.tweetReady = false;
    if (!id) return;
    options.dnt = options.dnt === undefined ? true: options.dnt;
    let cb = (newTweet: HTMLElement) => this.zone.run(() => {
      if (!!this.tweetElement) {
        this.tweetContainer.nativeElement.removeChild(this.tweetElement);
      }
      this.tweetElement = newTweet;
      this.tweetReady = true;
    })

    this.twttrService.runWithTwttr(twttr => twttr.widgets.createTweet(id, this.tweetContainer.nativeElement, options).then(cb));
  }
}
