import {Component, Input, OnInit} from '@angular/core';
import {GeneralService} from '../services/general.service';
import {DashboardService} from '../services/dashboard.service';
import {IClinic} from '../model/clinic';
import * as _ from 'lodash';
import {Drawer} from '../model/drawer';
import {ViewPatientsComponent} from './view-patients/view-patients.component';
import * as dayjs from 'dayjs';
import {EditClinicComponent} from './edit-clinic/edit-clinic.component';
import {Router} from '@angular/router';
import {AddClinicEventComponent} from './add-clinic-event/add-clinic-event.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  upcoming: IClinic[] = [];
  previous: IClinic[] = [];

  drawer = new Drawer();

  constructor(
    public gs: GeneralService,
    public router: Router,
    private dashboardService: DashboardService,
  ) { }

  async ngOnInit() {
    await this.getUpComingClinicEvents();
  }

  async getUpComingClinicEvents() {
    this.gs.showMask(`Loading Clinic Upcoming days`);
    try {
      const res = await this.dashboardService.getUpComingClinicEvents().toPromise();
      this.upcoming = _.get(res, `upcoming`, []);
      this.previous = _.get(res, `previous`, []);
      this.gs.closeMask()
    } catch (e) {
      this.gs.toastError(e, true);
    }
  }

  viewPatients(event: IClinic) {
   this.drawer.title = `${dayjs(event.date).format('MM/DD/YYYY')} - patients`;
   this.drawer.addDrawer(ViewPatientsComponent, {
     clinic: event,
   }, {
     refresh: async () => await this.getUpComingClinicEvents()
   })
  }

  editClinic(event: IClinic) {
   this.drawer.title = `${dayjs(event.date).format('MM/DD/YYYY')} - clinic`;
    this.drawer.addDrawer(EditClinicComponent, {
     clinic: event,
   }, {
     refresh: async () => await this.getUpComingClinicEvents()
   });
  }

  async logout() {
    this.gs.logout();
    await this.router.navigate(['/']);
  }

  addEvent() {
    this.drawer.title = 'Add Clinic Event';
    this.drawer.addDrawer(AddClinicEventComponent, {}, {
      refresh: async () => await this.getUpComingClinicEvents()
    });
  }
}
