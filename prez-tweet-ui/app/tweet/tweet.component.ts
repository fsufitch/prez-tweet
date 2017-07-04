import { Component, Input, ElementRef, OnChanges } from '@angular/core';

import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'tweet',
  template: require('./tweet.component.html'),
})
export class TweetComponent implements OnChanges {
  @Input() idStr: string;
  private tweetReady = false;

  constructor(private element: ElementRef) {}

  private idStr$ = new BehaviorSubject<string>('');
  ngOnChanges() {
    this.idStr$.next(this.idStr);
  }

  private tweetUpdateSub = this.idStr$.asObservable()
    .filter(id => !!id)
    .subscribe(id => {
      let el: HTMLElement = this.element.nativeElement;
      while (el.children.length > 0) {
        el.removeChild(el.children[0]);
      }

      window.twttr.ready(() => {
        window.twttr.widgets.createTweet(this.idStr, el, {align: 'center'})
          .then(() => this.tweetReady = true);
      })
    });

  tweetUrl$ = this.idStr$.asObservable()
    .filter(id => !!id)
    .map(id => `https://twitter.com/status/${id}`);

}