import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Drawer} from '../../model/drawer';
import {IClinic} from '../../model/clinic';
import {GeneralService} from '../../services/general.service';
import {DashboardService} from '../../services/dashboard.service';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import * as _ from 'lodash';
import * as dayjs from 'dayjs';

@Component({
  selector: 'app-add-patient',
  templateUrl: './add-patient.component.html',
  styleUrls: ['./add-patient.component.scss']
})
export class AddPatientComponent implements OnInit {

  @Input()
  drawer: Drawer;

  @Input()
  clinic: IClinic;

  @Output()
  refresh = new EventEmitter();

  contactTypeOptions: {label: string, value: string}[] = [
    {label: 'Apple FaceTime', value: 'Apple FaceTime'},
    {label: 'Google Duo', value: 'Google Duo'},
  ];

  patientForm: FormGroup;

  constructor(
    public gs: GeneralService,
    private dashboardService: DashboardService,
    public formBuilder: FormBuilder
  ) {
    this.patientForm = this.formBuilder.group({
      firstName: new FormControl(null, [Validators.required]),
      lastName: new FormControl(null, [Validators.required]),
      dateOfBirth: new FormControl(null, []),
      phone: new FormControl(null, []),
      email: new FormControl(null, []),
      refills: new FormControl(false, []),
      online: new FormControl(false, []),
      contactType: new FormControl(null, []),
      address: new FormControl(null, []),
      city: new FormControl(null, []),
      zipcode: new FormControl(null, []),
      isNew: new FormControl(false, []),
      generalQuestion: new FormControl(false, []),
    });
  }

  async ngOnInit() {
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

  async createPatient() {
    this.gs.showMask(`Adding Patient`);
    try {
      const payload = _.cloneDeep(this.patientForm.value);
      payload.clinicId = this.clinic.id;
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
      await this.dashboardService.createPatient(payload).toPromise();
      await this.refresh.emit();
      this.drawer.goBack();
      this.gs.closeMask();
      this.gs.toast('Added Patient');
    } catch (e) {
      this.gs.toastError(e, true);
    }
  }

}
