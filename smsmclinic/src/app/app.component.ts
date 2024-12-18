import {Component, HostListener, OnInit} from '@angular/core';
import {environment} from '../environments/environment';
import {App, GeneralService} from './services/general.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{

  title = environment.title;
  app: App;

  constructor(public generalService: GeneralService) {
    this.generalService.app$.subscribe(a => this.app = a);
  }


  ngOnInit() {
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.generalService.widthChanged(event.target.innerWidth);
  }
}
