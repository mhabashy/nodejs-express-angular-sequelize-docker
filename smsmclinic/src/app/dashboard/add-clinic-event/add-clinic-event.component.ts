import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {GeneralService} from '../../services/general.service';
import {DashboardService} from '../../services/dashboard.service';
import {Drawer} from '../../model/drawer';
import * as dayjs from 'dayjs';
import * as _ from 'lodash';

@Component({
  selector: 'app-add-clinic-event',
  templateUrl: './add-clinic-event.component.html',
  styleUrls: ['./add-clinic-event.component.scss']
})
export class AddClinicEventComponent implements OnInit {

  @Input()
  drawer: Drawer;

  @Output()
  refresh = new EventEmitter();

  clinicForm: FormGroup;


  constructor(
    public gs: GeneralService,
    private dashboardService: DashboardService,
    private formBuilder: FormBuilder
  ) {
    this.clinicForm = this.formBuilder.group({
      title: new FormControl('Clinic', [Validators.required]),
      date: new FormControl(null, [Validators.required]),
      desiredAttendance: new FormControl(10, [Validators.required]),
      psychiatrist: new FormControl(false, [])
    });
  }

  async ngOnInit() {
  }

  async createClinic() {
    this.gs.showMask(`Creating clinic event`);
    try {
      const payload = _.cloneDeep(this.clinicForm.value);
      payload.date = dayjs(payload.date).format('YYYY-MM-DD');
      await this.dashboardService.createClinicEvent(payload).toPromise();
      await this.refresh.emit();
      this.drawer.closeDrawer();
      this.gs.closeMask();
      this.gs.toast('Created Clinic');
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
