import { Component, ViewEncapsulation } from '@angular/core';


@Component({
  selector: 'ng2app',
  template: require('./app.component.html'),
  styles: [
    require('./app.component.scss'),
  ],
  encapsulation: ViewEncapsulation.None,
})
export class AppComponent {
  ngOnInit() {
    let twitterWidgetsScript = document.createElement('script');
    twitterWidgetsScript.setAttribute('src', '//platform.twitter.com/widgets.js');
    document.querySelector('body').appendChild(twitterWidgetsScript);
  }
}
