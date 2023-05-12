import { Injectable } from '@angular/core';
//import { MatSnackBar } from "@angular/material/snack-bar";
import { ToastrService } from 'ngx-toastr';
@Injectable({
  providedIn: 'root'
})
export class MsgService {
msgObject:any={
	'accountLinked':'Account linked successfully',
  'taskCreated':'Task created successfully',
  'taskStatusUpdate':'Status updated successfully',
  'formSave':'Form saved successfully',
  'formUpdate':'Form updated successfully',
  'share':'Forms share successfully',
  "apptCancelError":"Appointment not canceled due to error",
  "refStatusUpdate":"Referral status updated successfully",
  "saveNotes":"Notes saved successfully",
  "updateNotes":"Notes updated successfully",
  "clearNotes":"Notes clear successfully",
  "errorSaveNotes":"Notes not saved successfully",
  "errorUpdateNotes":"Notes not updated successfully",
  "calendlyEnable":"Calendly enabled successfully",
  "accountChanged":"Calendly account changed successfully",
  "calendlyDisable":"Calendly disabled successfully",
  "fileUpload":"File uploaded successfully",
  "removeFile":"File removed successfully",
  "referralEnable":"Linking completed successfully",
  "referralDisable":"Linking removed successfully",
  "apptAccNotCreated": "Unable to link Calendly account",
  "apptCancelSuccess":"Appointment canceled successfully",
  "taskMarkDone":"Task has been successfully completed",
  "taskMarkNotDone":"Unable to completed the task",
  "taskStatusError":"Unable to update the task status",
  "nextStepNotifySuccess":"Patient has been notified for next step",
   "nextStepNotifyError":"Unable to notified patient for next step",
    'fileUploadSizeError':"File size should not more than 50MB",
  fieldReq:(fieldname: any)=>{
    return `Field '${fieldname}' is required`
  },
  "reset":"Password changed successfully",
  "sessionExp":"Your session is expired",
  "accessDenied":"You don't have access or your session is expired",
  "userLogout":"User logged out",
  "screenerComp":"Thank you for submitting screener."
  
}
  constructor(private toastr : ToastrService) { }

  show(key:any,text:any,type:any,duration:any){
  	let content=text;
  	if(key!=''){
  	content=this.msgObject[key]?this.msgObject[key]:'';	
  	}
    let settingObject:any={
      timeOut: duration,
      positionClass:'toast-top-center',
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
    }, 0);

  }
}
