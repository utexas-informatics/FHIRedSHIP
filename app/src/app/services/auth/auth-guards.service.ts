import { Injectable } from "@angular/core";
import {
	ActivatedRouteSnapshot,
	CanActivate,
	Router,
	RouterStateSnapshot,
	UrlTree
} from "@angular/router";
import { Observable } from 'rxjs';
import { catchError,tap,map } from 'rxjs/operators';
import { UserService } from "../../user.service";
import { LocalstoreService } from '../../shared/service/localstore/localstore.service';

declare var $: any;

@Injectable()
export class AuthGuard implements CanActivate {
	constructor(
		private userService: UserService,
		private localstoreService: LocalstoreService,
		private router: Router) { }
   canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<any> | Promise<boolean> | boolean {
    // if ('IsEmpty'==='IsEmpty') {
    //   this.router.navigate(["/login"]);
    //   return false;
    // }
   return this.userService.authenticate().pipe(
      map(dataset => {
      	if(dataset['status'] == false){
      	  this.localstoreService.removeRecod();
          this.router.navigate([""]);
              return false;
          }
          return true;
      })
    );
  }

}
