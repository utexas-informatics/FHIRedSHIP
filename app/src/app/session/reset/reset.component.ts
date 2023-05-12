import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable, Subscription, timer } from 'rxjs';
import { skip, switchMap, scan, takeWhile } from 'rxjs/operators';
import { User } from '../../user';
import { UserService } from '../../user.service';
import { LocalstoreService } from '../../shared/service/localstore/localstore.service';
import { MsgService } from '../../services/msg/msg.service';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl, 
} from '@angular/forms';

@Component({
  selector: 'app-reset',
  templateUrl: './reset.component.html',
  styleUrls: ['./reset.component.scss']
})
export class ResetComponent implements OnInit {
  loginInfo: any = { email: '', password: '' };
  passwordType: string = 'password';
  loginResponse: boolean = false;
  isFormLoaded: boolean = false;
  showLoading: boolean = true;
  resetForm: FormGroup;
  lastSnapshot: any;
  email:any;
  constructor( private router: Router,
    private localstoreService: LocalstoreService,
    private userService: UserService,
    private formBuilder: FormBuilder,
    private msgService: MsgService,
    private activatedRoute: ActivatedRoute) { 
      this.resetForm = this.formBuilder.group({
        password: ['', Validators.compose([Validators.required,Validators.minLength(8)])],
        repassword: [''],
      }, {
        validator: this.checkIfMatchingPasswords('password', 'repassword'),
      });
    }

  ngOnInit(): void {
    let id:any = this.activatedRoute.snapshot.paramMap.get('id');
    this.email = atob(id);
    this.showLoading = false;
    this.isFormLoaded = true;
  }
   // match password and confirm password
   checkIfMatchingPasswords(
    passwordKey: string,
    passwordConfirmationKey: string
  ) {
    return (group: FormGroup) => {
      const passwordInput = group.controls[passwordKey];
      const passwordConfirmationInput = group.controls[passwordConfirmationKey];
      if (passwordInput.value !== passwordConfirmationInput.value) {
        return passwordConfirmationInput.setErrors({ notEquivalent: true });
      } else {
        return passwordConfirmationInput.setErrors(null);
      }
    };
  }

  validate() {
    const controls = this.resetForm.controls;
    /** check form validation */
    if (this.resetForm.invalid) {
      Object.keys(controls).forEach((controlName) =>
        controls[controlName].markAsTouched()
      );
      return;
    }
    const encryptedUserCredentials = btoa(
      `${this.email}:${this.resetForm.value.password}`
    );

    this.userService
    .reset(encryptedUserCredentials)
    .subscribe((res) => {
    if(res){
      this.msgService.show("",this.msgService.msgObject.reset,'success','4000'); 
      this.router.navigate(['/']);
    }else{

     this.msgService.show("",res.msg,'danger','4000'); 

    }
   })
  }

}
