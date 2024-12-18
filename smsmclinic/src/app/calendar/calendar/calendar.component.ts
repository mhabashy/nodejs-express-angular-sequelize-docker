import {Component, NgZone, OnInit} from '@angular/core';
import {environment} from '../../../environments/environment';
import {App, GeneralService} from '../../services/general.service';
import {DiocesesService} from '../../services/dioceses.service';
import * as _ from 'lodash';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {StminaclinicService} from '../../services/stminaclinic.service';
import * as dayjs from 'dayjs';
import {ConfirmationService} from 'primeng/api';
import {Patient} from '../../model/patient';
import {Event} from '../../model/event';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent implements OnInit {

  title = environment.title;
  options: any;
  addEventSidebar = false;
  app: App;
  env = environment;
  people = [];
  currentTime: Date;
  openDate = new Date(environment.openDate);
  names: string[] = [];
  completed: boolean;
  patient: Patient;
  signUpForm: FormGroup;
  closed = false;
  events: Event[] = [];
  inputOptions: any[] = [];
  contactTypeOptions: {label: string, value: string}[] = [
    {label: 'Apple FaceTime', value: 'Apple FaceTime'},
    {label: 'Google Duo', value: 'Google Duo'},
  ];

  monthOptions: any[] = [
    {label: 'January', value: 1, days: 31},
    {label: 'February', value: 2, days: 29},
    {label: 'March', value: 3, days: 31},
    {label: 'April', value: 4, days: 30},
    {label: 'May', value: 5, days: 31},
    {label: 'June', value: 6, days: 30},
    {label: 'July', value: 7, days: 31},
    {label: 'August', value: 8, days: 31},
    {label: 'September', value: 9, days: 30},
    {label: 'October', value: 10, days: 31},
    {label: 'November', value: 11, days: 30},
    {label: 'December', value: 12, days: 31}
  ];

  yearOptions: any[] = [];
  dayOptions: any[] = [];

  constructor(
    private zone: NgZone,
    public gs: GeneralService,
    public formBuilder: FormBuilder,
    private dioceseService: DiocesesService,
    private stminaClinicService: StminaclinicService,
    private confirmationService: ConfirmationService,
  ) {
    this.gs.app$.subscribe(a => this.app = a);
    this.signUpForm = this.formBuilder.group({
      firstName: new FormControl(null, [Validators.required, Validators.minLength(2), Validators.maxLength(100)]),
      lastName: new FormControl(null, [Validators.required, Validators.minLength(2), Validators.maxLength(100)]),
      month: new FormControl(1, [Validators.required]),
      day: new FormControl(1, [Validators.required]),
      year: new FormControl(2019, [Validators.required]),
      phone: new FormControl(null, [Validators.required, Validators.minLength(2), Validators.maxLength(100)]),
      email: new FormControl(null, [Validators.required, Validators.email]),
      eventId: new FormControl(null, [Validators.required]),
      address: new FormControl(null, [Validators.required]),
      city: new FormControl(null, [Validators.required]),
      zipcode: new FormControl(null, [Validators.required]),
      generalQuestion: new FormControl(false, []),
      isNew: new FormControl(false, [])
    });
    setInterval(() => {
      this.currentTime = new Date();
    }, 1);
    const y = [];
    _.forEach(_.range(1935, dayjs().year()), (v) => {
      y.push({label: v, value: v});
    });
    this.yearOptions = y;
    this.generateDays();
    this.signUpForm.get('isNew').valueChanges.subscribe(e => {
      this.signUpForm.get('isNew').setValue(e, {emitEvent: false});
    });
  }

  async ngOnInit() {
    await this.getEvent();
  }

  print() {
    window.print();
  }

  generateDays() {
    const d = [];
    const m = _.get(this.signUpForm.controls, `month.value`, 1);
    console.log(m);
    const f = _.find(this.monthOptions, ['value', m]);
    if (f) {
      _.forEach(_.range(1, f.days + 1), (v) => {
        d.push(
          {
            label: v.toString(),
            value: v,
          }
        );
      });
      this.dayOptions = d;
    }
  }

  signUp() {
    this.gs.showMask(`Submitting Registration`);
    const payload = _.cloneDeep(this.signUpForm.value);
    const {  month, day, year } = this.signUpForm.value;
    delete payload.month;
    delete payload.day;
    delete payload.year;
    const dObj = _.find(this.monthOptions, ['value', month]);
    payload.dateOfBirth = `${dObj.label} ${day}, ${year}`;
    const check = dayjs(`${month}/${day}/${year}`);
    const age = dayjs().diff(check, 'year');
    if (age < 18) {
      this.gs.toastError({error: 'Sorry, we can only see adults'})
      return;
    }
    payload.age = age;
    this.stminaClinicService.signUp(payload).subscribe(async res => {
      if (_.get(res, `status`) === 'success') {
        this.completed = true;
        this.patient = _.get(res, `patient`);
        this.completed = _.get(res, `completed`);
      } else {
        this.gs.toastError({error: _.get(res, `message`, 'unknown error')});
      }
      await this.getEvent();
    }, err => this.gs.toastError({error: err}));
  }

  async getEvent() {
    this.gs.showMask(`Loading`);
    try {
      const res = await this.stminaClinicService.getEvent().toPromise();
      if (this.openDate < this.currentTime) {
        this.events = _.get(res, `events`, []);
        this.events = _.filter(this.events, e => !e.full);
        const ev = _.find(this.events, e => !e.full);
        if (ev) {
          this.signUpForm.controls.eventId.setValue(ev.eventId);
        } else {
          this.closed = true;
        }
        if (!this.closed) {
          this.inputOptions = this.eventOptions(this.events);
        }
      }
      this.gs.closeMask();
    } catch (e) {
      this.gs.toastError(e, true);
    }
  }

  signUpDirtyInvalid(
    controller: string,
    obj: boolean = true,
    form = 'signUpForm'
  ) {
    const check =
      this[form].get(controller) &&
      this[form].get(controller).dirty &&
      this[form].get(controller).invalid;
    return obj ? { invalid: check } : check;
  }


  eventOptions(events: Event[]) {
    return _.map(events, (e) => {
      return {
       label: `${dayjs(e.date).format('MM/DD/YYYY')} 12pm`,
       value: e.eventId
      }
    });
  }



}
