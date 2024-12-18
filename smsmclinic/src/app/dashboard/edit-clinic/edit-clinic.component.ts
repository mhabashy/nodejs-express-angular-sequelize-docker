import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {GeneralService} from '../../services/general.service';
import {DashboardService} from '../../services/dashboard.service';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {Patient} from '../../model/patient';
import {Drawer} from '../../model/drawer';
import * as dayjs from 'dayjs';
import {IClinic} from '../../model/clinic';

@Component({
  selector: 'app-edit-clinic',
  templateUrl: './edit-clinic.component.html',
  styleUrls: ['./edit-clinic.component.scss']
})
export class EditClinicComponent implements OnInit {

  clinicForm: FormGroup;
  @Input()
  drawer: Drawer;

  @Input()
  clinic: IClinic;

  @Output()
  refresh = new EventEmitter();

  patient: Patient;

  contactTypeOptions: {label: string, value: string}[] = [
    {label: 'Apple FaceTime', value: 'Apple FaceTime'},
    {label: 'Google Duo', value: 'Google Duo'},
  ];

  constructor(
    public gs: GeneralService,
    public formBuilder: FormBuilder,
    private dashboardService: DashboardService,
  ) {
  }

  async ngOnInit() {
    this.clinicForm = this.formBuilder.group({
      title: new FormControl(this.clinic.title, [Validators.required]),
      date: new FormControl((dayjs(this.clinic.date).format('YYYY-MM-DD')), [Validators.required]),
      desiredAttendance: new FormControl(this.clinic.desiredAttendance, [Validators.required]),
      psychiatrist: new FormControl(this.clinic.psychiatrist, [])
    });
  }

  async updateClinic() {
    this.gs.showMask(`Update clinic`);
    try {
      const payload = this.clinicForm.value;
      await this.dashboardService.updateClinicEvent(payload, this.clinic.id).toPromise();
      await this.refresh.emit();
      this.drawer.closeDrawer();
      this.gs.closeMask();
      this.gs.toast('Updated Clinic');
    } catch (e) {
      this.gs.toastError(e, true);
    }
  }

  clinicFormDirtyInvalid(
    controller: string,
    obj: boolean = true,
    form = 'clinicForm'
  ) {
    const check =
      this[form].get(controller) &&
      this[form].get(controller).dirty &&
      this[form].get(controller).invalid;
    return obj ? {invalid: check} : check;
  }

}
