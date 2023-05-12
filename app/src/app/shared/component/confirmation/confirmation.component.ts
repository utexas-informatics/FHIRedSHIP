import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";
import { TaskService } from '../../../services/task/task.service';
import { taskCompleteStatus} from '../../../constants';
import { LocalstoreService } from '../../../shared/service/localstore/localstore.service';
import { MsgService } from '../../../services/msg/msg.service';
import { UtilsService } from '../../../shared/service/utils/utils.service';

@Component({
  selector: 'app-confirmation',
  templateUrl: './confirmation.component.html',
  styleUrls: ['./confirmation.component.scss']
})
export class ConfirmationComponent implements OnInit {
  uniqueId:any ='';
  @Input() isRender: any;
  userId:any;
  role:any;
  isExpand:any=true;
  querySubscription:any;
  taskCompleteStatus:any=taskCompleteStatus;
  taskData:any;
  constructor(
    private utilsService:UtilsService,
    private router: Router,
    private route: ActivatedRoute,
    private taskService:TaskService,
    private localstoreService: LocalstoreService,
    private msgService:MsgService,
    ) { }

  async ngOnInit(): Promise<void> {
   this.userId = await this.localstoreService.getRec('_id');
    let role:any = await this.localstoreService.getRec('role');
    this.role = role.role;
    let url = window.location.href;
    let queryParams =  this.utilsService.sortParams(url);
    if(Object.keys(queryParams).length !== 0){
    this.uniqueId=(queryParams && queryParams.uniqueId)?queryParams.uniqueId:"";
    if(this.uniqueId === '' || this.role != 'Patient'){
    this.isRender = false;
    }

    }
  }


  ngAfterViewInit(): void{}
  async hide(){
  this.isRender = false;
  }
  async compress(){
  this.isExpand = false;

  }

  async expand(){
  this.isExpand = true;
  }
  async show(){
  this.isRender = true;
  }

  async closeTask(){
    let data = {'status':this.taskCompleteStatus,'updatedBy':this.userId,'updatedAt':new Date(),notify:true};
    this.msgService.show("",this.msgService.msgObject.taskMarkDone,'success','4000');
    this.hide();
    this.taskService.update(this.uniqueId,data).subscribe((response) => {
    if(response && response._id){

    }
    else{
    this.msgService.show("",this.msgService.msgObject.taskMarkNotDone,'danger','4000');
    this.show();
    }
    

   });
  }

}
