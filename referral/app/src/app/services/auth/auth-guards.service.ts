import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  ActivatedRoute,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';
import { UserService } from '../../user.service';
import { LocalStore } from '../../shared/service/localstore/localstore.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private userService: UserService,
    private localStore: LocalStore,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<any> | Promise<boolean> | boolean {
    let loginScreen = false;
    const email = next.queryParamMap.get('email');
    if (state.url.split(';')[0] == '' || state.url.split(';')[0] == '/login') {
      loginScreen = true;
    }
    return this.userService.apiCall().pipe(
      map((dataset) => {
        if (dataset['status'] == false) {
          this.localStore.remove('ref-auth');

          if (email) {
            const encryptedUserCredentials = btoa(`${email}:${email}`);
       
            this.userService
              .getToken(encryptedUserCredentials)
              .subscribe((res) => {
                if (res && res.status == true) {
                  this.localStore.set('ref-auth', res.data);
                  this.router.navigateByUrl(`${state.url}`);
                  return true;
                } else {
                  this.router.navigate(['']);
                  return false;
                }
              });
          } else {
            if (loginScreen !== true) {
              this.router.navigate(['/login', { previousUrl: state.url }]);
            } else {
              this.router.navigate(['']);
            }

            return false;
          }
        }
        return true;
      })
    );
  }
}
