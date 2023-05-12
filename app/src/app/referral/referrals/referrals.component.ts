import { Component, OnInit,Output,Input,EventEmitter } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { environment } from "../../../environments/environment";
import { ReferralService } from '../../services/referral/referral.service';
import { ShareService } from '../../services/share/share.service';
import { NotesService } from '../../services/notes/notes.service';
import { LocalstoreService } from '../../shared/service/localstore/localstore.service';
import { refStatus,apiUrlConfig } from '../../constants';
import { MsgService } from '../../services/msg/msg.service';
import { UserService } from '../../user.service';


declare var $: any;

@Component({
  selector: 'app-referrals',
  templateUrl: './referrals.component.html',
  styleUrls: ['./referrals.component.scss']
}) 
export class ReferralsComponent implements OnInit {
referrals:any=[];
id:string='';
sid:string='';
totalCount:number=0;
refStatus:any=refStatus;
showPopup:any=false;
page:number=1;
forms:any=[];
pageLimit: number = 10;
searching:any=false;
initialProcessing:boolean=false;
showLoading: boolean = false;
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
role:any;
platform:any="";
patientId :any;
show_access_message:any=false;
  constructor(
    private msgService:MsgService,
    private modalService: NgbModal,
    private router: Router,
    private route: ActivatedRoute,
    private shareService: ShareService,
    private notesService:NotesService,
    private referralService:ReferralService,private localstoreService: LocalstoreService,private userService: UserService) { }
  async ngOnInit(): Promise<void>{
    this.userService.bcrumb.next([]);
    this.userId = await this.localstoreService.getRec("_id");
    let role:any = await this.localstoreService.getRec('role');
    let type:any = await this.localstoreService.getRec('type');
    this.role = role.role;
    this.route.params.subscribe((params: any) => {
     // this.sid =params.id;
     this.patientId = params.id;
      });

    this.route.queryParams.subscribe(async (queryParams: any) => {
    if(queryParams && queryParams.deviceType){
      this.platform = queryParams.deviceType;
      if(queryParams.deviceType == 'ios'){
        $("body").addClass("fs-header-ios");
       }
       }
       });
   
      let uuidEnable:any = await this.localstoreService.getRec("uuidEnable");
      if(this.role === 'Cbo'){
       let subs:any = this.localstoreService.getRec("subs");
        this.userId = subs ? atob(subs.sub):'';
        uuidEnable = subs ? subs.uuidEnable:false;
      }
      if(uuidEnable && uuidEnable === true){
        this.get();
      }else{
        this.referrals = [];
        this.initialProcessing=true;
        this.showLoading = false;
      }
      this.checkUrl();
      
      }

  checkUrl(){
    if(this.router.url.search('/referrals/patient') !==-1){
      this.userService.bcrumb.next([{name:'Patients',last:false,url:"/patients"},{name:'Referrals',last:true,url:""}]);
    }
    else{
      this.userService.bcrumb.next([{name:'Referrals',last:true,url:""}]);
    }
   
   }

    onPageChange(pageNumber:any) {
    this.page = pageNumber;
    this.get();
    }
 
 
   async get() {
  this.showLoading = true;
   var queryParameterString='';

  let facility:any = await this.localstoreService.getRec('facility');
  let role:any = await this.localstoreService.getRec('role');
  if(this.patientId){
    queryParameterString=queryParameterString+`?id=${this.patientId}&requester_type=Patient`;
    //queryParameterString=queryParameterString+`?patient=${this.sid}&sid=${this.sid}&requester_type=Patient`;
  }else{
    if(role.role=='Patient'){
      queryParameterString=queryParameterString+`?id=${this.userId}&requester_type=${role.role}`;
    }else{
      queryParameterString=queryParameterString+`?id=${this.userId}&requester_type=${role.role}`;
    }
  }
  
  queryParameterString=queryParameterString+`&page=`+this.page;


  this.referralService.getReferrals(queryParameterString).subscribe((response) => {
      if (response) {
        if (!response.error) {
           if(response.data){
         this.totalCount=response.count?response.count:0;
         this.referrals=response.data;
          }
        }
        else{
        this.show_access_message = true;
        }
        this.initialProcessing=true;
      }
      this.showLoading = false;
      
    });

}


open(form:any){
   this.modalService.open(form, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
     // this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      //this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
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


openConfirmationModal(form:any){
   this.mode = "confirmation";
   this.modalService.open(form, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
     // this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      //this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
}

onSearchKeyup(evt:any){

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

changeStatus(status:any,i:number,ref:any){
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
       
    let index = this.returnIndex(this.referrals,'_id',this.referralId);  
    this.notesService.get(this.referralId,status.value).subscribe((response) => {
      this.referrals[index].notes = response.notes;
      if(status.id !== 'screener_requested' && !this.referrals[index].notes.notes){
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


confirmation(modal:any,val:string){
if(val == 'yes'){
  this.mode = 'notes'
}
else{
  modal.close();
}

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
        this.initialProcessing=true;
      }
      this.showLoading = false;
      
    });


}


clearNotes(modal:any){
let index = this.returnIndex(this.referrals,'_id',this.referralId);
this.notesService.clearNotes(this.currentNoteId).subscribe((response) => {
      if (response) {
        if (!response.error) {
            this.referrals[index].notes = {};
            modal.close();
            this.msgService.show("",this.msgService.msgObject.clearNotes,'success','4000');
       }
  
      }
      
    });

}

saveNotes(modal:any){
let data:any = {};
data['moduleId'] = this.referralId;
data["notes"] = this.currentNotes;
data['linkWith'] = "status";
data['meta'] = {"status":this.currentStatus};
data['submittedBy'] = this.userId;
let index = this.returnIndex(this.referrals,'_id',this.referralId);
modal.close();

if(this.currentNoteId == ""){
  this.msgService.show("",this.msgService.msgObject.saveNotes,'success','4000');
  this.notesService.saveNotes(data).subscribe((response) => {
      if (response) {
        if (!response.error) {
            this.referrals[index].notes = response;
            
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
            this.referrals[index].notes = response;
       }
       else{
        this.msgService.show("",this.msgService.msgObject.errorUpdateNotes,'success','4000');
       }
  
      }
      
    });
}

}


goToReferral(resp:any){

 if(this.router.url.search('/referrals/patient') ==-1){
 if(this.platform != ""){
  this.router.navigate([`referrals/${resp._id}`],{ queryParams: { tab: "detail",deviceType:this.platform}});
 }
 else{
  this.router.navigate([`referrals/${resp._id}`],{ queryParams: { tab: "detail"}});
 }
 
 }
 else{
  if(this.platform != ""){
  this.router.navigate([`referrals/patient/${this.patientId}/${resp._id}`],{ queryParams: { tab: "detail",deviceType:this.platform}});
  }
  else{
this.router.navigate([`referrals/patient/${this.patientId}/${resp._id}`],{ queryParams: { tab: "detail"}});
}

 }

}

}
