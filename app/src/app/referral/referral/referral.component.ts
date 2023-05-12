import { Component, OnInit,ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";
import { environment } from "../../../environments/environment";
import { ReferralService } from '../../services/referral/referral.service';
import { LocalstoreService } from '../../shared/service/localstore/localstore.service';
import { UtilsService } from '../../shared/service/utils/utils.service';
import { refStatus,automatedWorkflow } from '../../constants';
import { UserService } from '../../user.service';

declare var $: any;
 
@Component({
  selector: 'app-referral',
  templateUrl: './referral.component.html',
  styleUrls: ['./referral.component.scss']
})  
export class ReferralComponent implements OnInit {
id:string='';
moduleId:string='';
tab:string='';
referral:any={};
senderList:any;
appointmenData:any;
role:any;
userId:any;
refStatus:any = refStatus;
automatedWorkflow:any=automatedWorkflow;
isLoaded:boolean=false;
showLoading:boolean = false;
showViewAllOption:boolean=false;
platform:any="";
show_access_message:any=false;
linkedUser:Array<string>=[];
  constructor(private router: Router,
    private route: ActivatedRoute,
    private referralService:ReferralService,private localstoreService: LocalstoreService,private utilsService:UtilsService,private userService: UserService) {
      this.router.routeReuseStrategy.shouldReuseRoute = () => false;
     }

  async ngOnInit(): Promise<void> {
    this.userService.bcrumb.next([]);
    this.userId =  await this.localstoreService.getRec('_id');
    this.route.params.subscribe(async (params: any) => {
    this.id=params.id;
    //this.moduleId = params.id;
    let role:any = await this.localstoreService.getRec('role');
    this.role = role.role;

    });

    // let url = window.location.href;
    // let queryParams = this.utilsService.sortParams(url);
    // if(Object.keys(queryParams).length !== 0 && queryParams.tab){
    //   this.get(queryParams.tab);
    //  }
    //  else{
    //   if(this.tab == ""){
    //     this.tab = "detail";
    //   }
    //   this.settabinfo(this.tab);
    //   this.get(this.tab);
    //  }


    this.route.queryParams.subscribe(async (queryParams: any) => {
    if(queryParams && queryParams.deviceType){
      if(queryParams.deviceType == 'ios'){
        this.platform = queryParams.deviceType;
        $("body").addClass("fs-header-ios");
      }
    }

     if(queryParams && queryParams.tab){
      this.get(queryParams.tab);
     }
     else{
         if(this.tab == ""){
        this.tab = "detail";
      }
      this.settabinfo(this.tab);
      this.get(this.tab);
     }

    });
  

  }

  async get(tab:any) {
  this.showLoading = true;
  this.referralService.getReferral(this.id).subscribe((response) => {
      if (response) {
        if (!response.error) {
           if(response){
            this.referral=response;
            this.checkUrl();
    		   
           this.appointmenData = {
            'cbo':this.referral.cbo,
            'chw':this.referral.chw,
            'patient':this.referral.patient,
            'acceptedBy':this.referral.acceptedBy
           }
           this.isLoaded = true;
           this.moduleId = this.referral._id;
         if(tab === 'messages'){
         this.createChatData(); 
         }
         this.tab = tab;

          }
          else{
            this.moduleId = this.id;
          }
        }
        else{
          this.show_access_message = true;
          this.moduleId = this.id;
        }
      }
      this.showLoading = false;
   });
}

checkUrl(){
  if(this.router.url.search('/referrals/patient') !==-1){
    this.userService.bcrumb.next([{name:'Patients',last:false,ur:"/patients"},{name:'Referrals',last:false,url:`/referrals/patient/${this.referral.patient.id}`},{name:this.referral.referralName,last:true,url:""}]);
  }
  else{
    this.userService.bcrumb.next([{name:'Referrals',last:false,url:"/referrals"},{name:this.referral.referralName,last:true,url:""}]);
  }
 
 }
settabinfo(tab:any){
if (window.history.pushState) {
    // if(tab !== 'messages'){
     var newurl = window.location.protocol + "//" + window.location.host + window.location.pathname + '?tab='+tab+'&ts='+Date.now();
       if(this.platform != ""){
       newurl = window.location.protocol + "//" + window.location.host + window.location.pathname + '?tab='+tab+'&deviceType='+this.platform+'&ts='+Date.now();
       }

     window.history.pushState({path:newurl},'',newurl);
    // }
  
  
}
}


createRoomId(roomId:any){
let id =  roomId.split('').sort().join('');
return id;
}
createChatData(){
let cboData:any = {
name:"CBO",
chatFor:"CBO",
receiver:[],
roomId:""
};
let cboreceiver:any = [];
for(var a=0; a < this.referral.cbo.length; a++){
cboData.receiver.push(this.referral.cbo[a].id);
}


let chwData:any = {
name:"CHW",
chatFor:"CHW",
receiver:[this.referral.chw.id],
roomId:""
}

let patData:any = {
name:this.referral.patient.name,
chatFor:"Patient",
receiver:[this.referral.patient.id],
roomId:""
}

let groupreceiver:any = patData.receiver.concat(chwData.receiver);
groupreceiver = groupreceiver.concat(cboData.receiver);

let uIndex = groupreceiver.indexOf(this.userId);

if(uIndex !== -1){
  groupreceiver.splice(uIndex,1);
}

let groupData:any = {
"name":"Group",
chatFor:"Group",
receiver:groupreceiver,
roomId:""
}

if(this.role === 'Chw' || this.role === 'chw-organization' || this.role === 'StudyCoordinator'){
patData.roomId = this.createRoomId(this.moduleId+"-"+this.referral.patient.id+"-CHW");
cboData.roomId = this.createRoomId(this.moduleId+"CHWANDCBO");
groupData.roomId = this.createRoomId(this.moduleId+"GROUP");
this.senderList = [{"user":patData},{"user":cboData},{"user":groupData}];
}
else if(this.role === 'Cbo' || this.role === 'cbo-organization'){
patData.roomId = this.createRoomId(this.moduleId+"-"+this.referral.patient.id+"-CBO");
chwData.roomId = this.createRoomId(this.moduleId+"CBOANDCHW");
groupData.roomId = this.createRoomId(this.moduleId+"GROUP");
this.senderList = [{"user":patData},{"user":chwData},{"user":groupData}];

}
else{
cboData.roomId = this.createRoomId(this.moduleId+"-"+this.referral.patient.id+"-CBO");
chwData.roomId = this.createRoomId(this.moduleId+"-"+this.referral.patient.id+"-CHW");
groupData.roomId = this.createRoomId(this.moduleId+"GROUP");
this.senderList = [{"user":cboData},{"user":chwData},{"user":groupData}];

}

}
returnIndex(data:any,key:any,value:any){
     const index = data.findIndex((object:any) => {
           return object[key] === value;
       });
     return index;


  }



referralStatusCallback(data:any){
let index = this.returnIndex(this.refStatus,"name",data.refStatus);
if(index !== -1){
let currentStatus = this.refStatus[index];
if(this.automatedWorkflow[currentStatus.id]){
let newIndex =  this.returnIndex(this.refStatus,"id",this.automatedWorkflow[currentStatus.id]);
if(newIndex !== -1){
let newStatus = this.refStatus[newIndex];
if(newStatus){
this.referral.fs_status = newStatus.value;
}
}
}


}


}

settab(tab:string){
if(this.tab != tab){
  this.settabinfo(tab);
}
if(tab === 'messages'){

this.createChatData(); 
}
this.tab=tab;

}

}
