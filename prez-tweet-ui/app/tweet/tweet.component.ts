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
  private tweetElement: HTMLElement = null;
  tweetReady: boolean;

  constructor(
    private twttrService: TwttrService,
    private zone: NgZone
  ) {}

  ngOnChanges() {
    this.tweetReady = false;
    this.updateTweet(this.idStr);
  }

  private updateTweet(id: string) {
    let container: HTMLDivElement = document.createElement("div");

    this.twttrService.runWithTwttr((twttr) =>
      twttr.widgets.createTweet(id, container, {align: 'center'})
        .then(tweet => this.zone.run(() =>{
          if (!!this.tweetElement) {
            this.tweetElement.remove();
          }
          (<HTMLDivElement>this.tweetContainer.nativeElement).appendChild(tweet);
          this.tweetElement = tweet;
          this.tweetReady = true;
        }))
    );
  }


}
