import { Component, OnInit,Output,Input,EventEmitter } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { environment } from "../../../../environments/environment";
import { refStatus,apiUrlConfig } from '../../../constants';
import { NotesService } from '../../../services/notes/notes.service';
import { LocalstoreService } from '../../../shared/service/localstore/localstore.service';
import { MsgService } from '../../../services/msg/msg.service';
import { ReferralService } from '../../../services/referral/referral.service';
import { ShareService } from '../../../services/share/share.service';


@Component({
  selector: 'app-referralstatus',
  templateUrl: './referralstatus.component.html',
  styleUrls: ['./referralstatus.component.scss']
})
export class ReferralstatusComponent implements OnInit {
role:any = '';
fs_status:any= 'Active';
refStatus:any = refStatus;
@Input() referral: any;
searchUrl:any=apiUrlConfig.templates;
totalForms:any=[];
mode:any="notes";
referralId:any="";
currentStatus:any="";
currentNotes:any;
submittedByName:any;
notesDate:any;
currentNoteId:any;
patId:any="";
userId:any;
patientId :any;

  constructor(
    private msgService:MsgService,
    private notesService:NotesService,
    private localstoreService: LocalstoreService,
    private modalService: NgbModal,
    private router: Router,
    private shareService: ShareService,
    private route: ActivatedRoute,
    private referralService:ReferralService


    ) { }

   async ngOnInit(): Promise<void> {
   this.userId =  await this.localstoreService.getRec('_id');
    let role:any = await this.localstoreService.getRec('role');
    this.role = role.role;

  }


changeStatus(status:any,ref:any){
     let data = {'status':status,'updatedAt':new Date(),notify:true};
     this.referralId = ref._id;
     this.patId = ref.patient.id;
     ref.fs_status = status.value;
     this.currentStatus = status.value;
     if(status.id == 'screener_requested'){
     this.openModal();
    }
    if(status.id !== 'screener_requested'){
    this.msgService.show("",this.msgService.msgObject.refStatusUpdate,'success','2000');
    }
       
    //let index = this.returnIndex(this.referrals,'_id',this.referralId);  
    this.notesService.get(this.referralId,status.value).subscribe((response) => {
      this.referral.notes = response.notes;
      if(status.id !== 'screener_requested' && !this.referral.notes.notes){
         this.currentNoteId = "";
         this.currentNotes = "";
            this.confirmationModalTrigger();
  
      
        }

     })

     this.referralService.statusUpdate(this.referralId,ref).subscribe((response) => {
        if (response && response.status == true) {
        }
        else{
        if(status.id !== 'screener_requested'){
        this.msgService.show("",response.msg,'error','2000');
        }
    }
   
   });

}


openNotes(form:any,ref:any){
  this.currentStatus = ref.fs_status;
  this.referralId = ref._id;
  this.currentNoteId = (ref.notes._id)?ref.notes._id:"";
  this.currentNotes = (ref.notes.notes)?ref.notes.notes:"";
  if(ref.notes.notes){
   this.submittedByName = this.returnName(ref.notes);
   this.notesDate=ref.notes.updatedAt;
  }
   this.modalService.open(form, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
     // this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      //this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
}

saveNotes(modal:any){
let data:any = {};
data['moduleId'] = this.referralId;
data["notes"] = this.currentNotes;
data['linkWith'] = "status";
data['meta'] = {"status":this.currentStatus};
data['submittedBy'] = this.userId;
modal.close();

if(this.currentNoteId == ""){
  this.msgService.show("",this.msgService.msgObject.saveNotes,'success','4000');
  this.notesService.saveNotes(data).subscribe((response) => {
      if (response) {
        if (!response.error) {
            this.referral.notes = response;
            
       }
       else{
        this.msgService.show("",this.msgService.msgObject.errorSaveNotes,'danger','4000');
       }
  
      }
      
    });
}
else{
  data['_id'] = this.currentNoteId;
        this.msgService.show("",this.msgService.msgObject.updateNotes,'success','4000');
  this.notesService.updateNotes(data).subscribe((response) => {
      if (response) {
        if (!response.error) {
            this.referral.notes = response;
       }
       else{
        this.msgService.show("",this.msgService.msgObject.errorUpdateNotes,'success','4000');
       }
  
      }
      
    });
}

}


clearNotes(modal:any){
this.notesService.clearNotes(this.currentNoteId).subscribe((response) => {
      if (response) {
        if (!response.error) {
            this.referral.notes = {};
            modal.close();
            this.msgService.show("",this.msgService.msgObject.clearNotes,'success','4000');
       }
  
      }
      
    });

}


returnIndex(data:any,key:any,value:any){
     const index = data.findIndex((object:any) => {
           return object[key] === value;
       });
     return index;


  }

receiveData(shareData:any){
let index = this.returnIndex(this.totalForms,'_id',shareData._id);
if(index == -1){
  this.totalForms.push(shareData);
}

}

removeItem(data:any){
let index = this.returnIndex(this.totalForms,'_id',data._id);
if(index !== -1){
  this.totalForms.splice(index,1);
}
}

shareForm(modal:any){
let data:any = {};
data['moduleId'] = this.referralId;
data['sharedWith'] = this.patId;
data['forms'] = this.totalForms;
data['sharedBy'] = this.userId;
this.shareService.share(data).subscribe((response) => {
      if (response) {
        if (!response.error) {
       
            modal.close();
            this.totalForms = [];
            this.msgService.show("",this.msgService.msgObject.share,'success','4000');
 
          
        }
        //this.initialProcessing=true;
      }
      //this.showLoading = false;
      
    });


}

open(form:any){
   this.modalService.open(form, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
     // this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      //this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
}

openConfirmationModal(form:any){
   this.mode = "confirmation";
   this.modalService.open(form, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
     // this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      //this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
}

openModal(){
 let eleId='formShareModal';
   let ele:HTMLElement=document.getElementById(eleId) as HTMLElement;
   ele.click();
}

confirmationModalTrigger(){
 let eleId='ConfirmationModal';
   let ele:HTMLElement=document.getElementById(eleId) as HTMLElement;
   ele.click();
}

returnName(notes:any){
  let fullName = "";
  if(notes.submittedBy){
  if(notes.submittedBy.firstName){
    fullName = notes.submittedBy.firstName;
    if(notes.submittedBy.lastName){
      fullName = fullName+" "+notes.submittedBy.lastName;
    }
  }
  else{
    fullName = notes.submittedBy.email;
  }


  }

return fullName;
}


}
