import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {GeneralService} from '../../services/general.service';
import {DashboardService} from '../../services/dashboard.service';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {Patient} from '../../model/patient';
import {Drawer} from '../../model/drawer';
import * as dayjs from 'dayjs';
import {ConfirmationService} from 'primeng/api';
import * as _ from 'lodash';

@Component({
  selector: 'app-edit-patient',
  templateUrl: './edit-patient.component.html',
  styleUrls: ['./edit-patient.component.scss']
})
export class EditPatientComponent implements OnInit {

  patientForm: FormGroup;

  @Input()
  drawer: Drawer;

  @Output()
  refresh = new EventEmitter();

  @Input()
  patient: Patient;

  contactTypeOptions: {label: string, value: string}[] = [
    {label: 'Apple FaceTime', value: 'Apple FaceTime'},
    {label: 'Google Duo', value: 'Google Duo'},
  ];

  constructor(
    public gs: GeneralService,
    public formBuilder: FormBuilder,
    private dashboardService: DashboardService,
    public confirmationService: ConfirmationService
  ) {
  }

  async ngOnInit() {
    let dayOfBirth = null;
    if (this.patient.dateOfBirth) {
      dayOfBirth = dayjs(this.patient.dateOfBirth).toDate();
    }
    this.patientForm = this.formBuilder.group({
      firstName: new FormControl(this.patient.firstName, [Validators.required]),
      lastName: new FormControl(this.patient.lastName, [Validators.required]),
      dateOfBirth: new FormControl(dayOfBirth, []),
      phone: new FormControl(this.patient.phone, []),
      email: new FormControl(this.patient.email, []),
      refills: new FormControl(this.patient.refills, []),
      online: new FormControl(this.patient.online, []),
      contactType: new FormControl(this.patient.contactType, []),
      address: new FormControl(this.patient.address, []),
      city: new FormControl(this.patient.city, []),
      zipcode: new FormControl(this.patient.zipcode, []),
      isNew: new FormControl(this.patient.isNew, []),
      generalQuestion: new FormControl(this.patient.generalQuestion, []),
    });
  }

  async updatePatient() {
    this.gs.showMask(`Update patient`);
    try {
      const payload = this.patientForm.value;
      if (!_.isNil(payload.dateOfBirth)) {
        payload.age = dayjs().diff(payload.dateOfBirth, 'year');
        payload.dateOfBirth = dayjs(payload.dateOfBirth).format('MMMM MM, YYYY');
      }
      if (!_.isNil(payload.email)) {
        payload.email = (payload.email).toString().toLowerCase();
      }
      payload.firstName = _.startCase(payload.firstName);
      payload.lastName = _.startCase(payload.lastName);
      payload.name = `${payload.firstName} ${payload.lastName}`;
      await this.dashboardService.updatePatient(payload, this.patient.id).toPromise();
      await this.refresh.emit();
      this.drawer.goBack();
      this.gs.closeMask()
      this.gs.toast('Updated Patient');
    } catch (e) {
      this.gs.toastError(e, true);
    }
  }

  patientFormDirtyInvalid(
    controller: string,
    obj: boolean = true,
    form = 'patientForm'
  ) {
    const check =
      this[form].get(controller) &&
      this[form].get(controller).dirty &&
      this[form].get(controller).invalid;
    return obj ? {invalid: check} : check;
  }

  async deletePatient() {
    this.confirmationService.confirm({
        message: 'Are you sure that you want to perform this action?',
        accept: async () => {
          this.gs.showMask(`Deleting Patient`);
          try {
            await this.dashboardService.deletePatient(this.patient.id).toPromise();
            await this.refresh.emit();
            this.drawer.goBack();
            this.gs.closeMask();
            this.gs.toast('Deleted Patient');
          } catch (e) {
            this.gs.toastError(e, true);
          }
        },
        key: 'patient-delete'
    });
  }

}
