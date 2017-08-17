import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'tweet-nav',
  template: require('./tweet-nav.component.html'),
})
export class TweetNavComponent {
  @Input() prevTweetID: string;
  @Input() nextTweetID: string;
  @Output() tweetSelected = new EventEmitter<string>();

  prevClicked() {
    this.tweetSelected.emit(this.prevTweetID);
  }

  nextClicked() {
    this.tweetSelected.emit(this.nextTweetID);
  }
}
