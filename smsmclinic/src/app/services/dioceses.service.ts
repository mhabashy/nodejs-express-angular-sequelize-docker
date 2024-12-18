import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DiocesesService {

  getBasicPost(): any {
    let myHeaders = new HttpHeaders();
    myHeaders = myHeaders.set('Content-Type', 'application/json');
    myHeaders = myHeaders.set('Authorization', 'Basic c3VzY29wdHM6c3QhZ2VvcmdlfHN0IW1pbmE=');
    return { headers: myHeaders };
  }

  getBearerPost(): any {
    let myHeaders = new HttpHeaders();
    myHeaders = myHeaders.set('Content-Type', 'application/json');
    myHeaders = myHeaders.set('Authorization', 'Bearer ' + localStorage.getItem('token'));
    return { headers: myHeaders };
  }

  constructor(
    private http: HttpClient,
  ) { }

  login(email, password) {
    return this.http.post(`${environment.suscoptsAPI}/login/main/${environment.churchId}/`, {
      email,
      password
    }, this.getBasicPost()).pipe();
  }

  getCongregation() {
    return this.http.post(`${environment.suscoptsAPI}/congregation/`, {}, this.getBearerPost());
  }

}
