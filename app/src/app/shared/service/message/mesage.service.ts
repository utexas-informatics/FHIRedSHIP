/*import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MesageService {

  constructor() { }
}*/


import { Injectable } from '@angular/core';
//import { MatSnackBar } from "@angular/material/snack-bar";
//import { ToastrService } from 'ngx-toastr';
@Injectable({
  providedIn: 'root'
})
export class MesageService {
msgObject:any={
	'updated':'Record updated successfully',
	'created':'Record created successfully',
	'codeGenerated':'Invite code generated successfully',
  'updationNotAllowedDueToStatus':'Record status do not allow to update the record',
  'fillFields':'Fill all fields',
  'userNotExist':'User not validated or not found',
  'sessionExpired':'Your session has expired because of inactivity. Please log in again',
  'errorWithApp':'There is a problem with the application. Please try again shortly',
  'invalidInviteCode':'Invalid Invite code. Please contact Study Recruiter for further help',
  'acNotActivated':'Your account is not activated yet. Please provide an invite code or contact study coordinator for further help',
  'codeCopied':'Code is copied',
  'noAccess':'Uh Oh! It seems that you do not have appropriate rights to access this application.',
  'editRight':'You do not have appropriate rights to edit this form.',
  'addRight':'You do not have appropriate rights to add new recruitment.',
  'emailAlreadyExist':'Email already exist. Please use another email',
  'emailUpdationNotAllowed':'Email updation is restricted for the current record',
  'codeRegeneartionNotAllowed':'Code can not be regenerated now',
  'activateAcces':'Are you sure, do you want to activate access?',
  'deactivateAcces':"This will deactivate enrollment and disable patient's access to FHIRedApp.Continue?",
  codeRegenrated:(email: any)=>{
    return `Invite code added successfully for '${email}'`
  }
}
  constructor() { }

  show(key:any,text:any,type:any,duration:any){
  /*	let content=text;
  	if(key!=''){
  	content=this.msgObject[key]?this.msgObject[key]:'';	
  	}
    let settingObject:any={
      timeOut: duration,
      positionClass:'toast-top-right',
      closeButton:true,
      maxOpened:1,
      autoDismiss: true,
      preventDuplicates:true
    }
 
    this.toastr.clear();
    setTimeout(() => {
      if(type=='success'){
     this.toastr.success(content, '', settingObject);
    }else if(type=='danger'){
     this.toastr.error(content , '', settingObject);
    }else if(type=='warning'){
     this.toastr.warning(content, '', settingObject);
    }else{
     this.toastr.info(content, '', settingObject);
    }  
    }, 0);*/

   



  }
}

