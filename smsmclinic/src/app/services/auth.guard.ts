import { Injectable } from '@angular/core';
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router} from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(public router: Router) {
  }
  canActivate(): Promise<boolean> {
    if (localStorage.getItem('sessionId')) {
      return Promise.resolve(true);
    } else {
      this.router.navigate(['/']).then(() => {
        return Promise.resolve(false);
      })

    }
  }
}
