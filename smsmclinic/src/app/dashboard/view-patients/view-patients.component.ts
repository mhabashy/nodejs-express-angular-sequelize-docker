import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Drawer} from '../../model/drawer';
import {DashboardService} from '../../services/dashboard.service';
import {GeneralService} from '../../services/general.service';
import {IClinic} from '../../model/clinic';
import {Patient} from '../../model/patient';
import * as _ from 'lodash';
import {EditPatientComponent} from '../edit-patient/edit-patient.component';
import {AddPatientComponent} from '../add-patient/add-patient.component';
import * as dayjs from 'dayjs';

@Component({
  selector: 'app-view-patients',
  templateUrl: './view-patients.component.html',
  styleUrls: ['./view-patients.component.scss']
})
export class ViewPatientsComponent implements OnInit {

  @Input()
  drawer: Drawer;

  @Output()
  refresh = new EventEmitter();

  @Input()
  clinic: IClinic;

  patients: Patient[] = [];

  constructor(
    private dashboardService: DashboardService,
    public gs: GeneralService,
  ) { }

  async ngOnInit() {
    await this.getPatients();
  }

  async getPatients() {
    this.gs.showMask(`Loading Patients`);
    try {
      const res = await this.dashboardService.getPatients(this.clinic.id).toPromise();
      this.patients = _.get(res, `patients`, []);
      this.gs.closeMask()
    } catch (e) {
      this.gs.toastError(e, true);
    }
  }

  editPatient(patient: Patient) {
    this.drawer.addDrawer(EditPatientComponent, {
      patient,
    }, {
      refresh: async () => await this.getPatients()
    });
  }

  addPatient() {
    this.drawer.addDrawer(AddPatientComponent, {
      clinic: this.clinic
    }, {
      refresh: async () => await this.getPatients()
    });
  }

  async downloadExcel() {

    try {
      this.gs.showMask();
      const file = await this.dashboardService.getPatientExcel(this.clinic.id).toPromise();
      const objectUrl = URL.createObjectURL(file);
      const a = document.createElement('a');
      a.href = objectUrl;
      a.download = `${dayjs(this.clinic.date).format("YYYY-MM-DD")}_${this.clinic.title}.xlsx`;
      a.click();
      URL.revokeObjectURL(objectUrl);
      this.gs.closeMask();
    } catch (e) {
      console.log(e);
      this.gs.closeMask();
    }
  }

  async downloadExcelSimple() {

    try {
      this.gs.showMask();
      const file = await this.dashboardService.getPatientExcel(this.clinic.id, true).toPromise();
      const objectUrl = URL.createObjectURL(file);
      const a = document.createElement('a');
      a.href = objectUrl;
      a.download = `${dayjs(this.clinic.date).format("YYYY-MM-DD")}_${this.clinic.title}.xlsx`;
      a.click();
      URL.revokeObjectURL(objectUrl);
      this.gs.closeMask();
    } catch (e) {
      console.log(e);
      this.gs.closeMask();
    }
  }
}
