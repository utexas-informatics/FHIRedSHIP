import { Injectable } from '@angular/core';
//import { MatSnackBar } from "@angular/material/snack-bar";
import { ToastrService } from 'ngx-toastr';
@Injectable({
  providedIn: 'root'
})
export class MsgService {
msgObject:any={
	'refSaved':'Referral created successfully',
  'refUpdated':'Referral updated successfully',
  'tempShared':'Assessment Template shared',
  'tempNotShared':'Assessment is not shared with patient',
  'responseSave':'Thank you for successfully submitting the Social Needs Survey to the Community Health Worker at your clinic.',
  'condDel':'Condition Deleted',
  'condRemoved':'Condition Removed',
  'condSaved':'Condition Saved',
  "refNameReq":"Referral name is required",
  "refPatReq":"Patient is required",
  "refCboReq":"CBO is required",
  "refIntervention":"Intervention is required",
  'refAccepted':'Referral accepted successfully',
  'refDecline':'Referral declined successfully',
  'needFill':'Please add note',
  'codeFill':'Please select a code',

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
