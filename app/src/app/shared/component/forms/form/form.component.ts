import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { LocalstoreService } from '../../../../shared/service/localstore/localstore.service';
import { FormsService } from '../../../../services/forms/forms.service';
import { ResponseService } from '../../../../services/response/response.service';
import { MsgService } from '../../../../services/msg/msg.service';
import { TaskService } from '../../../../services/task/task.service';
import { taskCompleteStatus} from '../../../../constants';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
 
@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class FormComponent implements OnInit {
  formData: any;
  isLoaded:boolean=false;
  showLoading:boolean=false;
  formsavetype:any;
  formResp:any = {};
  userId:any;
  role:any;
  taskData:any;
  taskCompleteStatus:any=taskCompleteStatus;
  responseData:any={};
  isConfirmation:any = true;
  templateName:any = true;
  rules:any = [];
  mode:any='save';
  hideRule:any = {};
  @Input() moduleId: any;
  @Input() templateId: any;
  @Output() newItemEvent = new EventEmitter<string>();
  @Input() responseId:any;

  constructor(
  private msgService:MsgService,
  private taskService:TaskService, 
  private responseService:ResponseService,
  private formsService:FormsService,
  private localstoreService: LocalstoreService,
  private router:Router,

  ) {

 }
  async ngOnInit(): Promise<void> {
  this.showLoading = true;
    let role:any = await this.localstoreService.getRec('role');
    this.role = role.role;
    this.get(this.templateId);


  }
async get(templateId:any) {
  this.formsService.getFormById(templateId).subscribe((response:any) => {
      if (response) {
        if (!response.error) {
           if(response){
           this.formData=response;
           this.templateName = this.formData.name;
           if(this.responseId && this.responseId != undefined){
            this.mode = 'edit';
            this.getRules(templateId);
            this.getResponse(this.responseId);
           }
           else{
              this.isLoaded = true;
              this.showLoading = false;
           }
        
         }
        }
      }
   });
}

async getHideRules(){
  if(this.rules.length !== 0){
    for(let i = 0;i < this.rules.length;i++){
      let currentRule = this.rules[i];
      if(currentRule.action === 'condition' && currentRule.condition.length !== 0){
        for(let c = 0;c < currentRule.condition.length;c++){
          let currentCondition = currentRule.condition[c];
          if(currentCondition.action === 'hide' && currentRule.operator === 'equal'){
          let data = currentCondition;
          data.elm = currentRule.elm;
          data.value = currentRule.value;
          data.operator = currentRule.operator;
          this.hideRule[currentCondition.applyOn] = data;
          }
        }
      }
    }
  }
}

async getRules(templateId:any) {
  this.responseService.getRules(templateId).subscribe((response:any) => {
    if (response) {
      if (!response.error) {
         if(response){
         if(response && response.rules.length != 0){
            this.rules = response.rules;
            this.getHideRules();
         }
      
       }
      }
    }
 });
};

async getResponse(responseId:any){

  this.responseService.getResponseById(responseId).subscribe(async (response:any) => {
      if (response) {
        if (!response.error) {
           if(response){
           this.responseData=response.data.data;
           this.formResp = (response.data.data)?response.data.data:{};
           this.taskData = response.task;
           if(this.taskData && this.taskData._id){
           let id:any = await this.localstoreService.getRec('_id');
           if(this.taskData.actorId.toString() === id){
             this.userId = id;
             this.isConfirmation = true;
           }
           else{
             this.isConfirmation = false;
           }
          
           }
           else{
            this.isConfirmation = false;
           }



           this.isLoaded = true;
           this.showLoading = false;
        
         }
        }
      }
   });

}

async closeTask(isClose:any){
if(this.formsavetype == "save"){
  this.saveData()
}
else{
   this.updateData()
}

if(isClose == true){
  let data = {'status':this.taskCompleteStatus,'updatedBy':this.userId,'updatedAt':new Date(),notify:true};
    this.taskService.update(this.taskData._id,data).subscribe((response) => {
      this.router.navigate([`referrals/${this.moduleId}`],{ queryParams: { tab: "tasks"}});;
  });


}

}



async save(){
this.formsavetype = "save";
}

async update(){
this.formsavetype = "update";
}
receiveData(data:any){
this.formResp[data.key] = data.value;
}

async checkHidden(field:any){
  let hidden = false;
  if(this.hideRule[field] && this.hideRule[field].value === this.formResp[this.hideRule[field].elm]){
    hidden = true;
}
return hidden;
};
async checkRequired(formData:any){
  let validation = true;
if(this.rules.length !== 0){
  for(let i=0;i < this.rules.length;i++){
    let currentRule = this.rules[i];
    if(currentRule.action && currentRule.action === 'required'){
      if(Array.isArray(formData['data'][currentRule.elm])){
      if(formData['data'][currentRule.elm].length === 0){
        let isHidden = await this.checkHidden(currentRule.elm);
        if(isHidden === false){
          let msg = this.msgService.msgObject.fieldReq(currentRule.elmLabel);
        this.msgService.show("",msg,'error','4000');
        validation = false;
        break;
        }
        
      }
      }else{
        if(!formData['data'][currentRule.elm] || !formData['data'][currentRule.elm]){
          
          let isHidden = await this.checkHidden(currentRule.elm);
          if(isHidden === false){
            let msg = this.msgService.msgObject.fieldReq(currentRule.elmLabel);
            this.msgService.show("",msg,'error','4000');
            validation = false;
            break;
          }

         
        }
      }
     
    }
  }
}
return validation;
}
async saveData(){
let id:any = await this.localstoreService.getRec('_id');
let formData:any = {};
formData['data'] = this.formResp;
formData['submittedBy'] = id;
formData['moduleId'] = this.moduleId;
formData['templateId'] = this.templateId;
let validation = true;
validation = await this.checkRequired(formData);
if(validation == false){
  return;
}
this.responseService.saveResponse(formData).subscribe((response:any) => {
      if (response) {
        if (!response.error) {
           if(response){
            if(this.templateName === "Personal Information Screener"){
              this.msgService.show("",this.msgService.msgObject.screenerComp,'success','4000');
            }else{
              this.msgService.show("",this.msgService.msgObject.formSave,'success','4000');
            }
            
           
           if(this.role !== "Patient"){
           this.newItemEvent.emit('list');
           }
           
         }
        }
      }
   });

}

async updateData(){
let id:any = await this.localstoreService.getRec('_id');
let formData:any = {};
formData['data'] = this.formResp;
formData['submittedBy'] = id;
formData['moduleId'] = this.moduleId;
formData['_id'] = this.responseId;
formData['templateId'] = this.templateId;
let validation = true;
validation = await this.checkRequired(formData);
if(validation == false){
  return; 
}
this.responseService.updateResponse(formData).subscribe((response:any) => {
      if (response) {
        if (!response.error) {
           if(response){
            if(this.templateName === "Personal Information Screener"){
              this.msgService.show("",this.msgService.msgObject.screenerComp,'success','4000');
            }else{
              this.msgService.show("",this.msgService.msgObject.formUpdate,'success','4000');
            }
          
           if(this.role !== "Patient"){
           this.newItemEvent.emit('list');
           }
         }
        }
      }
   });

}

}
