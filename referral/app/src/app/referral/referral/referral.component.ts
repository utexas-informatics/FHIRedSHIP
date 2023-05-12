import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { LocalStore } from '../../shared/service/localstore/localstore.service';
declare var $: any;
import { environment } from "../../../environments/environment";
import { ReferralService } from '../../services/referral/referral.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MsgService } from '../../services/msg/msg.service';
import { PatientService } from '../../patient/patient.service';

@Component({
  selector: 'app-referral',
  templateUrl: './referral.component.html',
  styleUrls: ['./referral.component.scss']
})
export class ReferralComponent implements OnInit {
// referralForm: FormGroup;
patient:string='';
performer:string='';
cbos:any=[];
patients:any=[];
currentActiveMode:string='';
searchList:any=[];
ref_id:any='';
isDisable:any=false;
domains:any=[{"name":"Food Insecurity","value":"food-insecurity"}];
selecttedObject:any={'patient':{},'performer':{}};
interventionsValue:any="";
patientValue:any="";
cboValue:any="";
codes:any=[]
referral:any = {
"categoryLabel":"",
"categoryCode":"food-insecurity",
"patient":{},
"performer":{},
"interventions":{},
"conditions":[],
"notes":"",
"requester":"",
"reqeuesterUuid":"",
"status":"Draft"
};
intervationUrl:any=environment.apiBaseUrl+"/interventions";
patientUrl:any=environment.apiBaseUrl+"/user/patient/search";
cboUrl:any = environment.apiBaseUrl+"/user/cbo/search";
conditionUrl:any = environment.apiBaseUrl+"/condition/patient/";
constructor(private localStore:LocalStore, private router: Router,
    private route: ActivatedRoute,
    private referralService: ReferralService,private fb: FormBuilder,private msgService:MsgService,private patientService: PatientService) {
     }

  async ngOnInit(): Promise<void> {
    $('.site-loading').css('display','none');
    $('body').removeClass('body-loading');

   await this.getCodes();
   this.route.params.subscribe(async (params: any) => {
   if(params.id){
   this.ref_id = params.id;
   
   this.getReferral();

   }
   });

}

async getCodes(){
  this.patientService.searchCodes('').subscribe((response) => {
    if (response) {
      if (!response.error) {
        this.codes = response;
      }
    }
  });
}

checkForHtml(text:any){
  return this.referralService.checkForHtmlTag(text);
}



async getReferral(){

this.referralService.getRefById(this.ref_id).subscribe((response) => {
        if (response) {
          if (!response.error && response._id) {
              this.isDisable = true;
              this.referral = response.rawData;
              this.interventionsValue =  response.rawData.interventions.desc;
              this.patientValue=response.rawData.patient.name?response.rawData.patient.name: response.rawData.patient.email;
              if(this.codes.length !== 0 && this.referral.conditions && this.referral.conditions.length !== 0){
                let inArr = []
                for(let i=0;i< this.referral.conditions.length;i++){
                  let text = this.referral.conditions[i].code;
                  let index = this.codes.findIndex((x:any)=> x.code === text);
                  if(index === -1){
                    inArr.push(index);
                  }
                }
                for (const ind of inArr) {
                  this.referral.conditions.splice(ind, 1);
               }
              }
              this.cboValue=response.rawData.performer.name;
              if(this.codes.length !== 0 && this.referral.conditions && this.referral.conditions.length !== 0){
                let inArr = []
                for(let i=0;i< this.referral.conditions.length;i++){
                  let text = this.referral.conditions[i].code;
                  let index = this.codes.findIndex((x:any)=> x.code === text);
                  if(index === -1){
                    inArr.push(index);
                  }
                }
                for (const ind of inArr) {
                  this.referral.conditions.splice(ind, 1);
               }
              }
              this.setConditionUrl(this.referral.patient.sid);
            
          }
       } 
});

}

 

  async save(){
    let requester='';
    let reqeuesterUuid='';
    let localData:any = await this.localStore.get('ref-auth');
    if(localData){
    localData = JSON.parse(localData);
    this.referral.requester=localData._id?localData._id:'';
    this.referral.reqeuesterUuid=localData.uuid?localData.uuid:''
    }

    // console.log("this.referral",this.referral);
	   //  let object:any=
    //   {'patient':this.patient,
    //   'performer':this.performer,
    //   'requester':requester,
    //   'reqeuesterUuid':reqeuesterUuid
    //    };
     
    if(this.referral.categoryLabel == ""){
    this.msgService.show("",this.msgService.msgObject.refNameReq,'danger','4000');
    return;
    }

    if(Object.keys(this.referral.patient).length == 0){
    this.msgService.show("",this.msgService.msgObject.refPatReq,'danger','4000');
    return;
    }
     if(Object.keys(this.referral.performer).length == 0){
    this.msgService.show("",this.msgService.msgObject.refCboReq,'danger','4000');
    return;
    }

    if(Object.keys(this.referral.interventions).length == 0){
    this.msgService.show("",this.msgService.msgObject.refIntervention,'danger','4000');
    return;
    }

   if(this.referral.patient._id && this.referral.performer._id){
    this.patient=this.referral.patient._id;
    this.performer=this.referral.performer._id;
    }
    else{

      return;
    }


  
        if(this.ref_id != ""){
        this.referralService.update(this.referral).subscribe((response) => {
        if (response) {
          if (!response.error && response._id) {
          this.msgService.show("",this.msgService.msgObject.refUpdated,'success','4000');
          this.router.navigate([`referral`]);
          }
       } 
       });

        }
        else{
        this.referralService.save(this.referral).subscribe((response) => {
        if (response) {
          if (!response.error && response._id) {
          this.msgService.show("",this.msgService.msgObject.refSaved,'success','4000');
          this.router.navigate([`referral`]);
          }
       } 
    });
        }


  


  }

onPatientKeyup(event:any,type:any){

//   this.setSelectionMode(type);
//   let term=event.target.value;
//  this.referralService.searchPatient(term).subscribe((response) => {
//  if (response) {
//  if (!response.error) {
// this.searchList=response;
//   let einfo:any = $(event.target)[0].getBoundingClientRect();
//  let left = einfo.left;
//  let top = einfo.top+30;
//  $('.cust-list').css({ "top": top + "px", 'left':  left+ "px", opacity: 1 });
//     console.log(' list - ',this.searchList);

//        } 
//      } 
//   });

}

setConditionUrl(id:any){
this.conditionUrl = environment.apiBaseUrl+"/condition/patient/"+id;

}

onPerformerKeyup(event:any,type:any){
  this.setSelectionMode(type);
  let term=event.target.value;
 this.referralService.searchCbo(term).subscribe((response) => {
 if (response) {
 if (!response.error) {
this.searchList=response;
  let einfo:any = $(event.target)[0].getBoundingClientRect();
 let left = einfo.left;
 let top = einfo.top+30;
 $('.cust-list').css({ "top": top + "px", 'left':  left+ "px", opacity: 1 });

       }
     } 
  });
}


setSelectionMode(type:any){
this.currentActiveMode=type;

}

receiveIntervation(event:any){
if(event._id){
this.referral.interventions = event;
}
}

receivePatient(event:any){
if(event.sid){
this.referral.patient = event;
}

if(this.referral.patient.sid){
this.setConditionUrl(this.referral.patient.sid);
}
}
receiveCbo(event:any){
if(event._id){
  this.referral.performer = event;
}

}

receiveCondition(event:any){
if(Object.keys(event).length > 0){
  let index = this.returnIndex(this.referral.conditions,'_id',event._id);
if(index === -1){
  let obj:any = {};
  obj['code'] = event.code;
  obj['desc'] = event.desc;
  obj['note'] = event.note;
  obj['_id'] = event._id;
  this.referral.conditions.push(obj);
}
}

}

selectitem(event:any){

// console.log('selectitem -- ');
// if(this.currentActiveMode=='patient'){
// this.selecttedObject['patient']=event;
// if(event.name){
//   this.referralForm.controls['patient'].setValue(event.name);
// }else{
//   this.referralForm.controls['patient'].setValue(event.email);
// }

// }else{
// this.selecttedObject['performer']=event;
// this.referralForm.controls['performer'].setValue(event.name);
// }


}


returnIndex(data:any,key:any,value:any){
     const index = data.findIndex((object:any) => {
           return object[key] === value;
       });
     return index;


  }


removeItem(data:any){
let index = this.returnIndex(this.referral.conditions,'_id',data._id);
if(index !== -1){
  this.referral.conditions.splice(index,1);
}
}


onClickedOutside(event:any){
this.resetListPosition();
}

resetListPosition(){
  this.cbos=[];
  this.patients=[];
 let left = -9999999999;
 let top = -99999999999
 $('.cust-list').css({ "top": top + "px", 'left':  left+ "px", opacity: 0 });

}

}
