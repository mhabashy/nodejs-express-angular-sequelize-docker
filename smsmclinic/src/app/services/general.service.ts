import { Injectable } from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import * as _ from 'lodash';
import { Location } from '@angular/common';
import {MessageService} from 'primeng/api';
import {Router} from '@angular/router';

export interface App {
  mobile: boolean;
  sessionId: string;
  name?: string;
  loader: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class GeneralService {

  private app = new BehaviorSubject<App>({
    mobile: true,
    sessionId: localStorage.getItem('sessionId') ? localStorage.getItem('sessionId') : null,
    name: localStorage.getItem('name') ? localStorage.getItem('name') : null,
    loader: false,
  });

  constructor(
    public messageService: MessageService,
    public location: Location,
    public router: Router
  ) {
    this.widthChanged(window.innerWidth);
  }

  private loadingSubject = new BehaviorSubject<boolean>(false);
  private loaderTextSubject = new BehaviorSubject<string>(null);

  app$ = this.app.asObservable();
  loader$ = this.loadingSubject.asObservable();
  loaderText$ = this.loaderTextSubject.asObservable();

  widthChanged(width: number) {
    const app = this.app.getValue();
    app.mobile = width < 768;
    this.app.next(app);
  }

  showMask(text = null) {
    this.loadingSubject.next(true);
    this.loaderTextSubject.next(text);
  }

  closeMask() {
    this.loadingSubject.next(false);
    this.loaderTextSubject.next(null);
  }

  setToken(sessionId: string, name: string) {
    const app = this.app.getValue();
    localStorage.setItem('sessionId', sessionId);
    localStorage.setItem('name', name);
    app.sessionId = sessionId;
    app.name = name;
    if (_.isNil(sessionId)) {
      this.logout();
    }
    this.app.next(app);
  }

  toast(
    summary: string = '',
    severity: string = 'success',
    detail: string = null,
    extras = {}
  ) {
    this.messageService.add({
      key: 'main',
      severity,
      summary,
      detail,
      ...extras,
    });
  }

  toastError(error, closeMask = false) {
    this.messageService.add({
      key: 'main',
      severity: 'error',
      summary: 'Error',
      detail:
        _.get(error, `error.error.message`) ||
        _.get(error, `error.message`) ||
        _.get(error, `message`) ||
        _.get(error, `error`) ||
        _.get(error, `status`, 'Unknown Server Error'),
    });
    const errorNumber = _.get(error, `status`);
    if ((errorNumber && _.toNumber(errorNumber) >= 401) || !error) {
      this.logout();
      this.router.navigate(['/']);
    }
    this.loadingSubject.next(false);
    if (closeMask) {
      this.closeMask();
    }
  }

  toastClear(key: string = null) {
    this.messageService.clear(key);
  }

  logout() {
    localStorage.clear();
    const app = this.app.getValue();
    app.sessionId = null;
    app.name = null;
    this.app.next(app);
  }

}
