import { Component } from '@angular/core';

import { AppStatusService } from './status.service';

@Component({
  selector: 'app-status',
  template: require('./status.component.html'),
})
export class AppStatusComponent {
  constructor(private statusService: AppStatusService) {}
  private status$ = this.statusService.getAppStatus();
  ok$ = this.status$.map(s => s.up);
  uptime$ = this.status$.map(s => s.uptime + '');
}
