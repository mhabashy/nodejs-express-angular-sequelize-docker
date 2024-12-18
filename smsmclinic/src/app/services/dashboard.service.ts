import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {AuthService} from './auth.service';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor(
      private http: HttpClient,
      public authService: AuthService
    ) { }

  // Clinic
  getUpComingClinicEvents() {
    return this.http.get(
      `${environment.api}/api/clinic`,
      this.authService.getBasicPost()
    );
  }

  createClinicEvent(payload) {
    return this.http.post(`${environment.api}/api/clinic`, payload, this.authService.getBasicPost());
  }

  updateClinicEvent(payload: any, clinicId: number) {
    return this.http.patch(`${environment.api}/api/clinic/${clinicId}`, payload, this.authService.getBasicPost());
  }

  deleteClinicEvent(clinicId: number) {
    return this.http.delete(`${environment.api}/api/${clinicId}`, this.authService.getBasicPost());
  }

  // Patients
  createPatient(payload) {
    return this.http.post(`${environment.api}/api/patient`, payload, this.authService.getBasicPost());
  }

  getPatients(clinicId: number) {
    return this.http.get(`${environment.api}/api/patients/${clinicId}`, this.authService.getBasicPost());
  }

  updatePatient(payload: any, patientId: number) {
    return this.http.patch(`${environment.api}/api/patient/${patientId}`, payload, this.authService.getBasicPost());
  }

  deletePatient(patientId: number) {
    return this.http.delete(`${environment.api}/api/patient/${patientId}`, this.authService.getBasicPost());
  }

  getPatientExcel(clinicId: number, simple = false) {
    const header: {headers: HttpHeaders} = this.authService.getBasicPost();
    header.headers = header.headers.delete('Content-Type');
    if (simple) {
      return this.http.get(
        `${environment.api}/api/clinic/excel/${clinicId}/simple`,
        {
          headers: header.headers,
          responseType: 'blob'
        }
      );
    }
    return this.http.get(
      `${environment.api}/api/clinic/excel/${clinicId}`,
      {
        headers: header.headers,
        responseType: 'blob'
      }
    );
  }
}
