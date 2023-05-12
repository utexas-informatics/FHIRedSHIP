import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable, Subscription, timer } from 'rxjs';
import { skip, switchMap, scan, takeWhile } from 'rxjs/operators';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { LocalStore } from '../../shared/service/localstore/localstore.service';
// import { MesageService } from "../../shared/service/message/mesage.service";
import { User } from '../../user';
import { UserService } from '../../user.service';
import { MsgService } from '../../services/msg/msg.service';

declare var $: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
   loginInfo:any={'email':'','password':''};
  passwordType:string = 'password';
  loginResponse:boolean=false;
   isFormLoaded: boolean = false;
   userProfileForm:FormGroup;
   lastSnapshot:any;

 constructor(private router:Router,private userService: UserService,private localStore: LocalStore, private formBuilder:FormBuilder,private route: ActivatedRoute,private msgService:MsgService) { 
 this.userProfileForm =this.formBuilder.group({
       email:'',
       password:''
      // email: ['', Validators.compose([Validators.required, Validators.email])],
      // password: ['', Validators.compose([Validators.required])],
    });
  }

  async checkLogin(){
     let res:any = await this.userService.isAuthenticated();
     $('.site-loading').css('display','none');
     $('body').removeClass('body-loading');
  }

  ngOnInit(): void {
     this.lastSnapshot = this.route.snapshot.paramMap.get('previousUrl');
     this.isFormLoaded = true;
     this.checkLogin();

  }

    validateLogin() {
    if (this.userProfileForm.value.email && this.userProfileForm.value.password) {
      this.login();
    } else {
     //this.msgService.show('fillFields','','danger','4000');

    }
  }



  login() {
    this.loginInfo.email=this.userProfileForm.value.email;
    this.loginInfo.password=this.userProfileForm.value.password;
     this.loginResponse = false;
    if (this.loginInfo.email && this.loginInfo.password) {
      
      const encryptedUserCredentials = btoa(
        `${this.loginInfo.email}:${this.loginInfo.password}`
      );

      this.userService
        .login(encryptedUserCredentials,'')
        .subscribe((res) => {
        if(res && res.status == true){
           this.localStore.set('ref-auth',res.data);
           if(this.lastSnapshot){
            this.router.navigateByUrl(`${this.lastSnapshot}`);
           }else{
            this.router.navigate(['dashboard']);
           }
           
        }
        else{ 
        // alert(res.msg);

         this.msgService.show("",res.msg,'danger','4000'); 

        }
       })
     }
     }

}
