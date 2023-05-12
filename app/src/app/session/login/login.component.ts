import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable, Subscription, timer } from 'rxjs';
import { skip, switchMap, scan, takeWhile } from 'rxjs/operators';
import { User } from '../../user';
import { UserService } from '../../user.service';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl, 
} from '@angular/forms';
import { LocalstoreService } from '../../shared/service/localstore/localstore.service';
import { MsgService } from '../../services/msg/msg.service';
//import { NotificationService } from '../../services/notification/notification.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  loginInfo: any = { email: '', password: '' };
  passwordType: string = 'password';
  loginResponse: boolean = false;
  isFormLoaded: boolean = false;
  showLoading: boolean = true;
  userProfileForm: FormGroup;
  lastSnapshot: any;

  constructor(
    private router: Router,
    private localstoreService: LocalstoreService,
    private userService: UserService,
    private formBuilder: FormBuilder,
    private msgService: MsgService,
    private route: ActivatedRoute
  ) {
    this.userProfileForm = this.formBuilder.group({
      email: ['', Validators.compose([Validators.required, Validators.email])],
      password: ['', Validators.compose([Validators.required])],
    });
  }

  async checkLogin() {
    let res: any = await this.userService.isAuthenticated();
  }

  ngOnInit(): void {
    this.lastSnapshot = this.route.snapshot.paramMap.get('previousUrl');
    this.showLoading = false;
    this.isFormLoaded = true;
    this.checkLogin();
    // this.userService.checkLogin();
  }

  validateLogin() {

    if (
      this.userProfileForm.value.email &&
      this.userProfileForm.value.password
    ) {
      this.login();
    } else {
      this.msgService.show('fillFields', '', 'danger', '4000');
    }
  }

  logoutBeforeLogin() {
    this.userService.logoutBeforeLogin();
  }

  login() {
    this.logoutBeforeLogin();
    this.loginInfo.email = this.userProfileForm.value.email;
    this.loginInfo.password = this.userProfileForm.value.password;
    this.loginResponse = false;
    if (this.loginInfo.email && this.loginInfo.password) {
      const encryptedUserCredentials = btoa(
        `${this.loginInfo.email}:${this.loginInfo.password}`
      );
      

      // this.userService.login(encryptedUserCredentials).subscribe((res) => {
      //   if (res) {
      //     this.localstoreService.mergeRecord(res);
      //     console.log('got res - ', res);
      //     this.userService.fetchUserByEmailId(
      //       this.loginInfo.email,
      //       'false',
      //       this.loginInfo.password,
      //       this.lastSnapshot
      //     );
      //   } else {
         
      //    console.log("test")
      //   }
      // });


      this.userService
        .login(encryptedUserCredentials)
        .subscribe((res) => {
        if(res && res.access_token){
          this.localstoreService.mergeRecord(res);
          this.userService.fetchUserByEmailId(
            this.loginInfo.email,
            'false',
            this.loginInfo.password,
            this.lastSnapshot,
            ''
          );
        }
        else{

         this.msgService.show("",res.msg,'danger','4000'); 

        }
       })
   


    }
  }
}
