import { Component } from '@angular/core';

import { AppStatusService } from '../shared';

@Component({
  selector: 'app-status',
  template: require('./status.component.html'),
  styles: [require('./status.component.scss')],
})
export class AppStatusComponent {
  constructor(private statusService: AppStatusService) {}
  private status$ = this.statusService.getAppStatus();
  ok$ = this.status$.map(s => s.ok);
  error$ = this.status$.map(s => s.error);

  uptime$ = this.status$.map(s => s.uptimeSec.toFixed(2));
  lastCrawlStr$ = this.status$.map(s => !!s.lastCrawlAt ? s.lastCrawlAt.fromNow() : 'never')
  debugID$ = this.status$.map(s => s.debugID);
}
