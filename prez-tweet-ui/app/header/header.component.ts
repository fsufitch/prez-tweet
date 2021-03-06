import { Component, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'appheader',
  template: require('./header.component.html'),
  styles: [require('./header.component.scss')],
})
export class HeaderComponent {
  @ViewChild('aboutModal') aboutModal: ElementRef;
  miniTweetOptions: TwttrOptions = {
    dnt: true,
    width: 250,
  };

  showAboutModal() {
    $(this.aboutModal.nativeElement).modal('show');
  }
}
