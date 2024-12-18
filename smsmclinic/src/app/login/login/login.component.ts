import {Component, HostListener, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {GeneralService} from '../../services/general.service';
import {environment} from '../../../environments/environment';
import {DiocesesService} from '../../services/dioceses.service';
import {Router} from '@angular/router';
import {AuthService} from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  title = environment.title;
  loginForm: FormGroup;
  height: number = window.innerHeight;

  constructor(
    public formBuilder: FormBuilder,
    public gs: GeneralService,
    private authService: AuthService,
    public router: Router
  ) {
    this.loginForm = this.formBuilder.group({
      username: new FormControl(null, [Validators.required]),
      password: new FormControl(null, [Validators.required, Validators.minLength(7)])
    });
  }

  ngOnInit() {
    this.gs.logout();
  }

  loginDirtyInvalid(
    controller: string,
    obj: boolean = true,
    form = 'loginForm'
  ) {
    const check =
      this[form].get(controller) &&
      this[form].get(controller).dirty &&
      this[form].get(controller).invalid;
    return obj ? { invalid: check } : check;
  }

  async login() {
    this.gs.showMask(`Checking Login Information`);
    try {

      const data: any = await this.authService.login(
        (this.loginForm.get('username').value).toLowerCase(),
        this.loginForm.get('password').value).toPromise();
      if (data.status === 'success') {
        this.gs.showMask(`Please Wait... Setting up your information`);
        this.gs.toast('Success', 'success', 'Please wait while setting up your information');
        this.gs.setToken(data.sessionId, `${data.firstName} ${data.lastName}`);
        await this.router.navigate(['/dashboard']);
      } else {
        this.gs.toastError(data.message, true);
      }
      this.gs.closeMask();
    } catch (e) {
      console.log(e);
      this.gs.toastError(e);
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.height = window.innerHeight;
  }
}
