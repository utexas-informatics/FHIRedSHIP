import {Component , OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges, SimpleChange} from '@angular/core';
import { NotificationService } from '../../../services/notification/notification.service';
import * as moment from 'moment';
import { Router, ActivatedRoute } from "@angular/router";
@Component({
  selector: 'app-recentnotification',
  templateUrl: './recentnotification.component.html',
  styleUrls: ['./recentnotification.component.scss']
})
export class RecentnotificationComponent implements OnInit {
notifications:any=[];
@Input() receiverId : any='';
@Input() defnotificationrecords : string='no';
@Input() showviewallnotificationoption : boolean=false;
  totalCount:number=0;
  page:number=1;
  showLoading:any=false;
  pageLimit: number = 10;
  initialProcessing:boolean=false;
  inProgress:boolean=false;

  constructor(private notificationService:NotificationService,private router: Router,
  private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.showLoading = true;
  	this.get();
  }

async parseDateFromString(str:any){
  let msg = (str)?str:"";
  let convertDate:any = "";
  if(msg.match(/<d>(.*?)<\/d>/g)){
  let result = msg.match(/<d>(.*?)<\/d>/g).map(function(val:any){
   return val.replace(/<\/?d>/g,'');
  });
  if(result.length > 0){
  convertDate = moment(result[0]).format('lll');
  msg = msg.replace(/<d>(.*?)<\/d>/g,convertDate.toString());  
  }
  }

 return msg
 }


async parseData(data:any){
for(let a=0; a < data.length;a++){
let msg = await this.parseDateFromString(data[a].message);
let sp_msg = await this.parseDateFromString(data[a].message_sp);
data[a].message = msg;
data[a].message_sp = sp_msg;
this.notifications.push(data[a]);
}
this.showLoading = false;
}


  get(){
     if(this.page>1){
 this.inProgress=true;
 }   
   let queryParams='';
  queryParams='?receiverId='+this.receiverId
  if(this.defnotificationrecords!='yes'){
  queryParams='?receiverId='+this.receiverId+'&page='+this.page
  }
  this.notificationService.getNotification(queryParams).subscribe((response) => {
      if (response) {
         this.inProgress=false;
        if (response.data) {
           if(response.data.length>0){
            //this.notifications=response;
           this.totalCount=response.count;
           let newRecords=response.data;
            this.parseData(newRecords);
           //this.notifications=this.notifications.concat(newRecords);
           //this.showLoading = false;
          }
          else{
             this.showLoading = false;
          }
        }
        else{
           this.showLoading = false;
        }
       
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

  showAllNotification(){
    this.router.navigate([`/notifications`]);
  }

    loadMore(){
   if(this.inProgress==true){
    return;
  }
    this.page=this.page+1;
    this.get();
  }

}
