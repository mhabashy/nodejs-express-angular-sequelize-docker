import {
  AfterViewChecked,
  AfterViewInit,
  Component,
  ComponentFactoryResolver,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { Drawer } from '../../model/drawer';
import {App, GeneralService} from '../../services/general.service';

@Component({
  selector: 'app-drawer',
  templateUrl: './drawer.component.html',
  styleUrls: ['./drawer.component.scss'],
})
export class DrawerComponent implements OnInit {
  drawer: Drawer;

  @Input()
  get ngDrawer() {
    return this.drawer;
  }
  set ngDrawer(val) {
    this.drawer = val;
  }

  app: App;

  constructor(public gs: GeneralService) {
    this.gs.app$.subscribe(a => {
      this.app = a;
    });
  }

  ngOnInit(): void {}

  clearDrawer() {
    this.drawer.clearDrawer();
  }
}
