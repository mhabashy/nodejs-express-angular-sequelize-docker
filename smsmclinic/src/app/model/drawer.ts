import * as _ from 'lodash';
import { ComponentRef, Type } from '@angular/core';

export enum DrawerPosition {
  LEFT = 'left',
  RIGHT = 'right',
  TOP = 'top',
  BOTTOM = 'bottom',
}

export class Drawer {
  public open = false;
  private _pages = [];
  private _position = DrawerPosition.LEFT;
  private drawerCloseFunc = _.noop;
  public closeOnBackDrop = true;
  public drawerStyle = { width: '60%' };
  public dismissible = true;
  public showCloseIcon = false;
  public closeOnEscape = true;
  public fullscreen = false;
  public blockScroll = true;
  public menu = true;
  public title = '';
  public componentSet = true;
  public printButton = true;
  public drawerBody: HTMLDivElement;

  constructor() {}

  addDrawer(component: Type<any>, input: any, output = null) {
    this.open = true;
    this._pages.push({ component, input, output });
  }

  goBack() {
    this._pages.pop();
    this.closeOnBackDrop = true;
    this.dismissible = true;
    this.open = !_.isEmpty(this._pages);
    this.componentSet = false;
  }

  currentDrawer() {
    const c = _.last(this._pages);
    if (c && c.input) {
      c.input.drawer = this;
    }
    return c || null;
  }

  canGoBack() {
    return this._pages.length > 1;
  }

  closeDrawer() {
    this._pages = [];
    this.open = false;
  }

  getPosition() {
    return this._position;
  }

  setPosition(p: DrawerPosition) {
    this._position = p;
  }

  clearDrawer() {
    this.drawerCloseFunc();
    this.closeDrawer();
  }

  scrollTop() {
    const top = document.getElementById('drawer-header');
    if (top) {
      top.scrollIntoView();
    }
  }

  setInputs(input: any) {
    const p = _.last(this._pages);
    p.input = input;
    this._pages[-1] = _.cloneDeep(p);
  }

  replacePage(component: Type<any>, input: any, output = null) {
    const p = _.last(this._pages);
    p.component = component;
    p.input = input;
    p.output = output;
    this._pages[-1] = _.cloneDeep(p);
  }

  mustGoBack() {
    this.closeOnBackDrop = false;
    this.dismissible = false;
  }
}
