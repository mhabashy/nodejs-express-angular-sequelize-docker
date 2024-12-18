import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {StminaclinicService} from './stminaclinic.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private http: HttpClient,
    private stminaClinicService: StminaclinicService
  ) { }

  getBasicPost(): any {
    let myHeaders = new HttpHeaders();
    const sessionId  = localStorage.getItem('sessionId');
    myHeaders = myHeaders.set('Content-Type', 'application/json');
    myHeaders = myHeaders.set('Authorization', `Basic ${environment.basicAuth}`);
    if (sessionId) {
      myHeaders = myHeaders.set('sessionId', sessionId);
    }
    myHeaders = myHeaders.set('Access-Control-Allow-Origin', '*')
    return { headers: myHeaders };
  }

  login(username: string, password: string) {
    return this.http.post(`${environment.api}/api/login`, {
      username,
      password
    }, this.stminaClinicService.getBasicHeader());
  }

  logout() {
    return this.http.get(`${environment.api}/api/logout`, this.getBasicPost());
  }

}
