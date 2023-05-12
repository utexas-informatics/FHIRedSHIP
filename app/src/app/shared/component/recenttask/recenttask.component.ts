import { Component , OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges, SimpleChange } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";
import { TaskService } from '../../../services/task/task.service';
import * as moment from 'moment';
import { MsgService } from '../../../services/msg/msg.service';
import { taskStatus,taskCompleteStatus } from '../../../constants';
import { environment } from '../../../../environments/environment';
import { LocalstoreService } from '../../../shared/service/localstore/localstore.service';
import { UtilsService } from '../../../shared/service/utils/utils.service';

@Component({
  selector: 'app-recenttask',
  templateUrl: './recenttask.component.html',
  styleUrls: ['./recenttask.component.scss']
})
export class RecenttaskComponent implements OnInit {
@Input() deftaskrecords : string='no';
@Input() showviewallTask : boolean=false;
tasks:any=[];
totalCount:number=0;
userId:any;
showLoading:boolean=false;
taskStatus:any = taskStatus;
page:number=1;
taskCompleteStatus:any=taskCompleteStatus;
pageLimit: number = 10;
initialProcessing:boolean=false;
inProgress:boolean=false;

  constructor(private taskService:TaskService,private router: Router,
    private route: ActivatedRoute,private localstoreService: LocalstoreService,private msgService:MsgService,private utilsService:UtilsService,) { }

    async ngOnInit(): Promise<void> {
    this.userId =  await this.localstoreService.getRec('_id');
    this.showLoading = true;
    this.get();
  }

  get(){
    if(this.page>1){
this.inProgress=true;
}   
 //  let queryParams='';
 // queryParams='userId='+this.userId
 // let obj = {}
 // if(this.deftaskrecords!='yes'){
 //  queryParams = queryParams +
 //   obj = {'page':this.page}
 // }
 

  let queryParams = "";
  if(this.deftaskrecords!='yes'){
   queryParams = `page=${this.page}&limit=${this.pageLimit}`;
  }
  else{
     queryParams = `page=${this.page}&limit=5`;
  }

  


   this.taskService.getTasks(this.userId,queryParams).subscribe((response) => {
     if (response) {
        this.inProgress=false;
       if (response.data) {
          if(response.data.length>0){
            this.showLoading = false;
            this.totalCount=response.count;
          let newRecords=response.data;
          this.tasks=this.tasks.concat(newRecords);
         }
       }
       this.showLoading = false;
     }else{
      this.showLoading = false;
        this.inProgress=false;
     }
   });
 }

 returnTime(dt:any){
  let date=moment(dt).format('MMM DD, YYYY h:mm:ss a');
  return date;
 }

 showAll(){
   this.router.navigate([`/tasks`]);
 }
 changeStatus(status:any,i:any){
  let data = {'status':status,'updatedBy':this.userId,'updatedAt':new Date(),notify:true};
   this.taskService.update(this.tasks[i]._id,data).subscribe((response) => {
   if (response) {
     if (!response.error) {
       this.msgService.show("",this.msgService.msgObject.taskStatusUpdate,'success','4000'); 
       this.tasks[i].status = status;
     }
   }
 });
 };

 redirectTo(task : any){
  if(task.url){
    if(task.title === 'referral_created'){
      window.open(task.url, "_blank");
    }else{
      let url = task.url;
      let query = this.utilsService.sortParams(url);
      if(task.meta && task.meta.uniqueId && task.status != this.taskCompleteStatus){
      query['uniqueId'] =  task._id.toString();
      }
      url = url.replace(environment.appUrl,"");
      this.router.navigate([`${url.split('?')[0]}`], { queryParams: query});
    }
    
  }
}

   loadMore(){
  if(this.inProgress==true){
   return;
 }
   this.page=this.page+1;
   this.get();
 }

}
 