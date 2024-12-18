import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class StminaclinicService {

  constructor(
    private http: HttpClient
  ) { }

  getBasicHeader() {
    let myHeaders = new HttpHeaders();
    myHeaders = myHeaders.set('Content-Type', 'application/json');
    myHeaders = myHeaders.set('Authorization', `Basic ${environment.basicAuth}`);
    return { headers: myHeaders };
  }

  getEvent() {
    return this.http.get(
      `${environment.api}/api/`,
      this.getBasicHeader()
    );
  }

  getEventPsychiatrist() {
    return this.http.get(
      `${environment.api}/api/psychiatrist`,
      this.getBasicHeader()
    );
  }

  signUp(payload) {
    return this.http.post(
      `${environment.api}/api/schedule/`,
      payload,
      this.getBasicHeader()
    );
  }

}
