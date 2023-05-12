import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { SettingsService } from '../../services/settings/settings.service';
import { MsgService } from '../../services/msg/msg.service';
import { LocalstoreService } from '../../shared/service/localstore/localstore.service';
import { UserService } from '../../user.service';

@Component({
  selector: 'app-setting',
  templateUrl: './setting.component.html',
  styleUrls: ['./setting.component.scss']
})
export class SettingComponent implements OnInit {
linkingEmail='';
linkingForm: FormGroup;
calendlyEnable:any=false;
referralEnable:any=false;
token:any="";
showLoading:boolean=false;
emailNotFound: boolean=false;
calendlySetting:any={};
referralSetting:any={};
settings:any=[];
constructor(private localstoreService: LocalstoreService,private userService: UserService,private modalService: NgbModal,private fb: FormBuilder,private settingsService:SettingsService,private msgService:MsgService) {
     this.linkingForm = this.fb.group({
      email: [ 
        '',
        Validators.compose([Validators.required, Validators.email]),
      ],
    });
  
}

async ngOnInit(): Promise<void>{
  this.showLoading = true;
  this.getSetting();
  this.userService.bcrumb.next([{name:'Dashboard',last:false,url:"/dashboard"},{name:"Settings",last:true,url:""}]);
}

async returnIndex(data:any,key:any,value:any){
     const index = data.findIndex((object:any) => {
           return object[key] === value;
       });
     return index;


  }

async checkCalendlySetting(){
let index = await this.returnIndex(this.settings,'type','calendly');
if(index != -1){
  this.calendlySetting = this.settings[index];
  this.calendlyEnable = this.calendlySetting.isEnable;
}

}

async checkReferralSetting(){
let index = await this.returnIndex(this.settings,'type','referral_account');
if(index != -1){
  this.referralSetting = this.settings[index];
  this.referralEnable = this.referralSetting.isEnable;
}
}

async getSetting(){
this.settingsService.get().subscribe((response) => {
      if (response) {
        if (response.status == true && !response.error) {
         this.settings = response.data;
         this.checkCalendlySetting();
         this.checkReferralSetting();

        }
      }
     this.showLoading = false;
      
    });

}


close(){
this.calendlyEnable = false;
this.token = "";
}

open(form:any){
   this.modalService.open(form, {ariaLabelledBy: 'modal-basic-title'}).result.then((result:any) => {

    }, (reason:any) => {

      this.calendlyEnable = false;
      this.token = "";
    });
}


openRefAccountLink(form:any){
   this.modalService.open(form, {ariaLabelledBy: 'modal-basic-title'}).result.then((result:any) => {

    }, (reason:any) => {

      this.referralEnable = false;
    });
}


openRefAccountChange(form:any){
   this.modalService.open(form, {ariaLabelledBy: 'modal-basic-title'}).result.then((result:any) => {

    }, (reason:any) => {

    });
}

openAccountChange(form:any){
   this.modalService.open(form, {ariaLabelledBy: 'modal-basic-title'}).result.then((result:any) => {

    }, (reason:any) => {
      this.token = "";
    });
}

openCalendlyModal(){
 let eleId='calendlyModalWrapper';
   let ele:HTMLElement=document.getElementById(eleId) as HTMLElement;
   ele.click();
}

openRefLinkModal(){
 let eleId='linkingModal';
   let ele:HTMLElement=document.getElementById(eleId) as HTMLElement;
   ele.click();
}

async enableCalendly(){
let obj:any = {};
obj['setting'] = this.calendlySetting;
obj['token'] = this.token;
this.calendlyEnable = true;
this.msgService.show("",this.msgService.msgObject.calendlyEnable,'success','3000');
this.settingsService.enableCalendly(obj).subscribe((response) => {
      if (response) {
        if (response.status == true && !response.error) {
        this.calendlySetting = response.data.data;
        }
        else{
          this.msgService.show("",response.msg,'danger','3000');
          this.calendlyEnable = false;
        }
      }
   
      
    });
}

async disableCalendly(){
let obj:any = {};
obj['setting'] = this.calendlySetting;
this.msgService.show("",this.msgService.msgObject.calendlyDisable,'success','3000');
this.settingsService.disableCalendly(obj).subscribe((response) => {
      if (response) {
        if (response.status == true && !response.error) {
     
        }
        else{
          this.msgService.show("",response.msg,'danger','3000');
          this.calendlyEnable = true;
        }
      }
   
      
    });
}



async enableReferral(){
  this.msgService.show("",this.msgService.msgObject.referralEnable,'success','4000');
  let dataSet:any = {};
  dataSet['linkData'] = {};
  dataSet['setting'] = this.referralSetting;


   this.settingsService.enableReferral(dataSet).subscribe((response) => {
      if (response) {
        if (response.status == true && !response.error) {
            let linkObj={'uuidLinked':true,'uuid': response.linkId,uuidEnable:true};
            this.localstoreService.mergeRecord(linkObj);
            this.referralSetting = response.data.data;
        }
        else{
          this.msgService.show("",response.msg,'danger','3000');
          this.referralEnable = false
        }
      }
      else{
      }
      
    });


}

async disableReferral(){
let obj:any = {};
obj['setting'] = this.referralSetting;
this.msgService.show("",this.msgService.msgObject.referralDisable,'success','3000');
this.settingsService.disableReferral(obj).subscribe((response) => {
      if (response) {
        if (response.status == true && !response.error) {
          let linkObj={'uuidLinked':true,'uuid': response.linkId,uuidEnable:false};
            this.localstoreService.mergeRecord(linkObj);
            this.referralSetting = response.data.data;
         
        }
        else{
          this.msgService.show("",response.msg,'danger','3000');
          this.referralEnable = true;
        }
      }
   
      
    });
}


accountChange(modal:any){
let obj:any = {};
obj['setting'] = this.calendlySetting;
obj['token'] = this.token;
modal.close();
this.calendlyEnable = true;
this.msgService.show("",this.msgService.msgObject.accountChanged,'success','3000');
this.settingsService.changeCalendlyAccount(obj).subscribe((response) => {
      if (response) {
        if (response.status == true && !response.error) {
      
        }
        else{
          this.msgService.show("",response.msg,'danger','3000');
          this.calendlyEnable = false;
        }
      }


   
      
    });

}




  checkValue(){
    this.emailNotFound = false;
  }

switchMode(){
if(this.calendlyEnable == false){
  this.calendlyEnable = true;
}
else{
  this.calendlyEnable = false;
}

if(this.calendlyEnable == true && !this.calendlySetting._id){
  this.token = "";
  this.openCalendlyModal();
}
else if(this.calendlyEnable == true && this.calendlySetting._id){
this.enableCalendly();
}
else{
this.disableCalendly();

}

}



switchReferral(){
if(this.referralEnable == false){
  this.referralEnable = true;
}
else{
  this.referralEnable = false;
}

if(this.referralEnable == true && !this.referralSetting._id){

  this.openRefLinkModal();
}
else if(this.referralEnable == true && this.referralSetting._id){
this.enableReferral();
}
else{
this.disableReferral();

}





}



saveToken(modal:any){
if(this.token !== ""){
  modal.close();
this.enableCalendly();
}


}



async save(modal:any){
    const controls = this.linkingForm.controls;
    let isChanged = (this.referralSetting._id)?true:false;
    if (this.linkingForm.invalid) {
      Object.keys(controls).forEach((controlName) =>
        controls[controlName].markAsTouched()
      );
      return;
    }

    this.linkingEmail=controls['email'].value;
     
   let facility:any=await this.localstoreService.getRec('organization');

   let curEmail:any = await this.localstoreService.getRec('email');
   let refEmail:any = this.linkingEmail; 
   let newAccountLink = true;
   let obj:any={curEmail,refEmail,facility,newAccountLink
   }
  modal.close();
  this.msgService.show("",this.msgService.msgObject.accountLinked,'success','4000');
  let dataSet:any = {};
  dataSet['linkData'] = obj;
  dataSet['setting'] = this.referralSetting;


   this.settingsService.enableReferral(dataSet).subscribe((response) => {
      if (response) {
        if (response.status == true && !response.error) {
            let linkObj={'uuidLinked':true,'uuid': response.linkId,uuidEnable:true};
            this.localstoreService.mergeRecord(linkObj);
            this.referralSetting = response.data.data;
        }
        else{
          this.msgService.show("",response.msg,'danger','3000');
          if(isChanged == false){
          this.referralEnable = false;
          }
          this.emailNotFound = true;
        
        }
      }
      else{
        this.emailNotFound = true;
      }

   
      
    });

  }




}
