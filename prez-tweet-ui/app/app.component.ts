
import { Component, ViewEncapsulation } from '@angular/core';

import { TweetService } from './shared';

@Component({
  selector: 'ng2app',
  template: require('./app.component.html'),
  styles: [
    require('./app.component.scss'),
  ],
  encapsulation: ViewEncapsulation.None,
})
export class AppComponent {}
