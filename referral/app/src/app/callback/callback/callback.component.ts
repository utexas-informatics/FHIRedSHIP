import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../user.service';
import { environment } from './../../../environments/environment';
import { LocalStore } from '../../shared/service/localstore/localstore.service';
import { MsgService } from '../../services/msg/msg.service';

declare var $: any;
@Component({
  selector: 'app-callback',
  templateUrl: './callback.component.html',
  styleUrls: ['./callback.component.scss'],
})
export class CallbackComponent implements OnInit {
  access_denied:any=false;
  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private localStore: LocalStore,
    private msgService: MsgService
  ) {}

  ngOnInit(): void {
    $('.site-loading').css('display', 'block');
    $('body').addClass('body-loading');
    if (
      this.activatedRoute.snapshot.queryParamMap.has('redirect') &&
      this.activatedRoute.snapshot.queryParamMap.has('email')
    ) {
      const email = this.activatedRoute.snapshot.queryParamMap.get('email');
     const type = this.activatedRoute.snapshot.queryParamMap.get('type');
      let redirect =
        this.activatedRoute.snapshot.queryParamMap.get('redirect');
        if(redirect){
          redirect = redirect.replace(environment.appUrl,"");
        }
      let token = this.activatedRoute.snapshot.paramMap.get('patientToken');
      if(token){
       this.localStore.remove("ref-auth");
       this.localStore.set("ref-auth",{token:token,role:type});
          this.userService
          .getUserDetail(token)
          .subscribe(async (res) => {
            if (res && res.status == true) {
              res.data.token = token;
              this.localStore.set('ref-auth', res.data);
              setTimeout(() => {
                $('.site-loading').css('display', 'none');
                $('body').removeClass('body-loading');
              }, 100);
              this.router.navigateByUrl(`${redirect}`);
            } else {
              setTimeout(() => {
                $('.site-loading').css('display', 'none');
                $('body').removeClass('body-loading');
              }, 100);
              this.localStore.remove("ref-auth");
              this.router.navigate(['']);
            }
          });

       }
       else{
         $('.site-loading').css('display', 'none');
        $('body').removeClass('body-loading');
        this.access_denied = true;
       }
      // if (token === environment.token) {
      //   this.localStore.remove("ref-auth");
      //   const encryptedUserCredentials = btoa(`${email}:${token}`);
      //   console.log('encryptedUserCredentials - ', encryptedUserCredentials);
      //   this.userService
      //     .login(encryptedUserCredentials,'patient')
      //     .subscribe(async (res) => {
      //       if (res && res.status == true) {
      //         this.localStore.set('ref-auth', res.data);
      //         setTimeout(() => {
      //           $('.site-loading').css('display', 'none');
      //           $('body').removeClass('body-loading');
      //         }, 100);
      //         this.router.navigateByUrl(`${redirect}`);
      //       } else {
      //         setTimeout(() => {
      //           $('.site-loading').css('display', 'none');
      //           $('body').removeClass('body-loading');
      //         }, 100);
      //         this.localStore.remove("ref-auth");
      //         this.router.navigate(['']);
      //       }
      //     });
      // }
    } else {
      setTimeout(() => {
        $('.site-loading').css('display', 'none');
        $('body').removeClass('body-loading');
      }, 100);
      this.localStore.remove("ref-auth");
      this.access_denied = true;
     // this.router.navigate(['']);
    }
  }
}
