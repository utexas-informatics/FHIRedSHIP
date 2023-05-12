import { Component, OnInit, Input,Output,EventEmitter } from '@angular/core';
import { LocalstoreService } from '../../../shared/service/localstore/localstore.service';
import { TaskService } from '../../../services/task/task.service';
import { ReferralService } from '../../../services/referral/referral.service';
import { MsgService } from '../../../services/msg/msg.service';
import { UserService } from '../../../user.service';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { taskStatus,taskCompleteStatus } from '../../../constants';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { environment } from '../../../../environments/environment';
declare var $: any;
import * as moment from 'moment';
  
@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.scss'],
})
export class TaskComponent implements OnInit {
  @Output() newItemEvent = new EventEmitter<string>();
  userId: any = '';
  taskList: any = [];
  taskForm: FormGroup;
  mode: any = 'list';
  currentTaskId:any="";
  taskCompleteStatus:any=taskCompleteStatus;
  searchList: any = [];
  selectedObject:any = null;
  role: any='';
  userEmail:any ='';
  minDate:any = new Date();
  showLoading:boolean=false;
  isDisabled: any=false
  page: number = 1;
  totalCount: number = 0;
  limit:number = 10;
  taskStatus:any = taskStatus;
  typingTimer:any;
  doneTypingInterval:number=2500;
  event:any;
  term:any;
  @Input() moduleId: any = '';
  @Input() moduleName: any = '';
  @Input() refData:any='';

  @Input() deftaskrecords : string='no';
  @Input() showviewallTask : boolean=false;
  constructor(
    private taskService: TaskService,
    private localstoreService: LocalstoreService,
    private referralService:ReferralService,
    private fb: FormBuilder,
    private modalService: NgbModal,
    private userService: UserService,
    private msgService:MsgService,
    private router:Router,
    private route:ActivatedRoute
  ) {
    //this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.taskForm = this.fb.group({
      name: ['', Validators.compose([Validators.required])],
      assignTo: ['', Validators.compose([Validators.required])],
      dueDate: [null, Validators.compose([Validators.required])],
      description: [''],
    });
  }

  async ngOnInit(): Promise<void> {
   
    if(this.moduleId){
      this.moduleId = this.moduleId.split('?')[0];
    }
    
    this.mode = 'list';
    this.resetValues();
    this.minDate = this.setMinDate();
    let role:any = await this.localstoreService.getRec('role');
    this.role = role.role;
    this.userEmail =  await this.localstoreService.getRec('email');
    this.userId =  await this.localstoreService.getRec('_id');
    this.showLoading = true;
    this.getTask();
  }

  showAll(){
    this.router.navigate([`/tasks`]);
  }

  returnTime(dt:any){
    let date=moment(dt).format('MMM DD, YYYY h:mm:ss a');
    return date;
   }

  setMinDate(){
    let dtToday = new Date();
    
    let month:any = dtToday.getMonth() + 1;
    let day:any = dtToday.getDate();
    let year:any = dtToday.getFullYear();
    if(month < 10)
        month = '0' + month.toString();
    if(day < 10)
        day = '0' + day.toString();
    
    let minDate = year + '-' + month + '-' + day;
    return minDate;
  }

  initForm() {
    this.taskForm = this.fb.group({
      name: ['', Validators.compose([Validators.required])],
      assignTo: ['', Validators.compose([Validators.required])],
      dueDate: [null, Validators.compose([Validators.required])],
      description: [''],
    });
  }

  onPageChange(pageNumber:any){
    this.page = pageNumber;
    this.showLoading = true;
    this.getTask();
  }

  resetValues() {
    this.page = 1;
    this.isDisabled = false;
    this.selectedObject = null;
    this.searchList = [];
    this.taskList = [];
    this.totalCount = 0;
    this.initForm();
  }

  getTask() {
    let queryParams = ``;
    if(this.moduleId){
      queryParams = `moduleId=${this.moduleId}&page=${this.page}&limit=${this.limit}`;
    }else{
      if(this.deftaskrecords!='yes'){
        queryParams = `page=${this.page}&limit=${this.limit}`;
       }
       else{
          queryParams = `page=${this.page}&limit=5`;
       }
    }
     
    this.taskService
      .getTasks(this.userId, queryParams)
      .subscribe((response) => {
        if (response) {
          if (!response.error) {

            this.totalCount=response.count?response.count:0;
           this.taskList=response.data;
           this.showLoading = false;
          }
          else{
            this.showLoading = false;
          }
        }
        else{
          this.showLoading = false;
        }
      });
  }
   
  sortParams(url: any) {
    let queryParams = url.split('?')[1];
    let params = queryParams ? queryParams.split('&'):[];
    let pair = null;
    let data:any = {};
    params.forEach((d:any) => {
      pair = d.split('=');
      data[`${pair[0]}`] = pair[1];
    });
    if(Object.keys(data).length !== 0){
      data['ts'] = Date.now();
    }
    return data;
}
  redirectTo(task : any){
    if(task.url){
      if(task.title === 'Review Referral Requested'){
        window.open(task.url, "_blank");
      }else{
        let url = task.url;
        let query = this.sortParams(url);
        if(task.meta && task.meta.uniqueId && task.status != this.taskCompleteStatus){
        query['uniqueId'] =  task._id.toString();
        }
        url = url.replace(environment.appUrl,"");
        //this.router.navigate([`${url}`]);
        this.router.navigate([`${url.split('?')[0]}`], { queryParams: query});
       // this.router.navigateByUrl(`${url}`);
      }
      
    }
  }
 
  changeStatus(status:any,i:any){
   let data = {'status':status,'updatedBy':this.userId,'updatedAt':new Date(),notify:true};
   let oldStatus = this.taskList[i].status;
   this.taskList[i].status = status;
    this.msgService.show("",this.msgService.msgObject.taskStatusUpdate,'success','4000'); 
    this.taskService.update(this.taskList[i]._id,data).subscribe((response) => {
    if (response) {
      if (!response.error) {
       if(this.taskList[i].status == this.taskCompleteStatus && this.taskList[i].automate_workflow_related == true){
        this.currentTaskId = this.taskList[i]._id;
        // this.openModal();
        
       }
      }
      else{
         this.msgService.show("",this.msgService.msgObject.taskStatusError,'danger','4000'); 
         this.taskList[i].status = oldStatus;
      }
    }
  });
  };
 
  onSearchKeyup(event: any) {
    let term = event.target.value;
    this.term = term;
    this.event = event;
    clearTimeout(this.typingTimer);
   // this.typingTimer = setTimeout(this.getData, this.doneTypingInterval);
   this.typingTimer = setTimeout(this.getData.bind(this), this.doneTypingInterval);
    // this.getData(term,event);
    
  }

  getData(){

   let searchData = btoa(`chwId:${this.refData.chw.id},chwRefId:${this.refData.chw.refchwId},cboId:${this.refData.cbo[0].id},cboRefId:${this.refData.cbo[0].refcboId},patId:${this.refData.patient.id},patRefId:${this.refData.patient.refPatId}`);

    this.userService.searchUser(this.term,this.role,this.moduleId,searchData).subscribe((response) => {
      if (response) {
        if (!response.error) {
          this.searchList = response;
          let einfo: any = $(this.event.target)[0].getBoundingClientRect();
          var doc = document.documentElement;
          let left = einfo.left;
          let top = einfo.top + 45 + doc.scrollTop;
          $('.cust-list').css({
            top: top + 'px',
            left: left + 'px',
            opacity: 1,
          });
    
        }
      }
    });
  }
 
  onFocus(event: any){
    let term = event.target.value;
    this.term = term;
    this.event = event;
   clearTimeout(this.typingTimer);
   // this.typingTimer = setTimeout(this.getData, this.doneTypingInterval);
   this.typingTimer = setTimeout(this.getData.bind(this), this.doneTypingInterval);
    //this.getData(term,event);
  }

  selectitem(event: any) {
    this.selectedObject = event;
    this.taskForm.controls['assignTo'].setValue(event.email);
  }

  onClickedOutside(event: any) {
    this.resetListPosition();
  }

  resetListPosition() {
    let left = -9999999999;
    let top = -99999999999;
    $('.cust-list').css({ top: top + 'px', left: left + 'px', opacity: 0 });

  }

  save() {
    const controls = this.taskForm.controls;
    if (this.taskForm.invalid) {
      Object.keys(controls).forEach((controlName) =>
        controls[controlName].markAsTouched()
      );
      return;
    } 
    let data = {
      title:controls['name'].value,
      message:controls['name'].value,
      dueDate:controls['dueDate'].value,
      meta:{moduleId:'',module:''},
      senderType: this.role,
      actorType: this.selectedObject?this.selectedObject.role.role:'',
      senderId: this.userId,
      actorId: this.selectedObject?this.selectedObject._id:'',
      desc:controls['description'].value,
      createdBy:this.userId,
      updatedBy:this.userId,
      notify:true
    };
    if(this.moduleId){
      data.meta.moduleId = this.moduleId;
    }
    if(this.moduleName){
      data.meta.module = this.moduleName;
    }
    this.taskService.save(data).subscribe((response) => {
      if (response) {
        if (!response.error) {
          this.msgService.show("",this.msgService.msgObject.taskCreated,'success','4000'); 
          this.switchMode('list');
        }
      }
    });
  }

notify(modal:any){
let data:any = {id:this.currentTaskId};
modal.close();
this.msgService.show("",this.msgService.msgObject.nextStepNotifySuccess,'success','4000'); 
this.referralService.nextStep(data).subscribe((response) => {
 if (response && response.status == true) {
  this.newItemEvent.emit(response.data);
  }
  else{
  this.msgService.show("",this.msgService.msgObject.nextStepNotifyError,'danger','4000'); 
  }
 });
}

close(modal:any){
modal.close();
}

  switchMode(mode: string) {
    this.resetValues();
    this.mode = mode;
    if (mode === 'list') {
      this.getTask();
    }else if(mode === 'new'){
      if(this.role === 'Patient'){
        this.taskForm.controls['assignTo'].setValue(this.userEmail);
        this.selectedObject = this.localstoreService.getFullRec();
        this.isDisabled = true;
      }
    }
  }


openModal(){
 let eleId='automated_workflow_confirmation';
   let ele:HTMLElement=document.getElementById(eleId) as HTMLElement;
   ele.click();
}
open(form:any){
   this.modalService.open(form, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
     // this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      //this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
}


}
