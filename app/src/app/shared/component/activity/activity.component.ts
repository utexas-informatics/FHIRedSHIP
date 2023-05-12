import {Component , OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges, SimpleChange} from '@angular/core';
import { Observable } from 'rxjs';
import { ActivityService } from '../../../services/activity/activity.service';
import * as moment from 'moment';
import { Router, ActivatedRoute } from "@angular/router";
import { LocalstoreService } from '../../../shared/service/localstore/localstore.service';

@Component({
  selector: 'app-activity',
  templateUrl: './activity.component.html',
  styleUrls: ['./activity.component.scss']
})
export class ActivityComponent implements OnInit {
  @Input() moduleId : any='';
  @Input() showViewAllOption : boolean=false;
  @Input() linkedUser : any='';
  activities:any=[];
  allData:any=[];
  allDays:any=[];
  showLoading:any=false;
  colors:any=['text-warning','text-success','text-danger','text-primary'];
  totalCount:number=0;
  page:number=1;
  pageLimit: number = 10;
  initialProcessing:boolean=false;
  inProgress:boolean=false;
  constructor(private activityService:ActivityService, private router: Router,
    private route: ActivatedRoute,private localstoreService: LocalstoreService) { }

  ngOnInit(): void {
    this.showLoading = true;
  	this.get();
  }

  returntime(createdAt:any){
  let date = new Date(createdAt);
  let time = moment(date).format("LT");
  return time;
  }

  returnDate(createdAt:any){
   let date = new Date(createdAt);
   let groupDate = moment(date).format('ll');
   return groupDate;
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


  async processData(activities:any){

    for (let i = 0; i < activities.length; i++) {

     let msg = await this.parseDateFromString(activities[i].meta.message_en);
     activities[i].meta.message_en = msg
     let message_sp = await this.parseDateFromString(activities[i].meta.message_sp);
     activities[i].meta.message_sp = message_sp

        this.activities.push(activities[i]);

        let activity = (activities[i])?activities[i]:{};
        if(activities[i]){
        let time = this.returntime(activities[i].createdAt);
        let currentDate = this.returnDate(activities[i].createdAt);

          activities[i]['itemClass']=this.randColourClass(this.colors);
          const index = this.returnIndex(this.allData,"date",currentDate);
          if(index == -1){
          this.allData.push({date:currentDate,activities:[activities[i]]});
          }
          else{
          this.allData[index].activities.push(activities[i]);
          }
        }
      }

  }



// pushNewRecord(data){
// for(var a=0; a < data.length; a++){
//   this.activities.push(data[a]);
// }

// this.processData();


//  } 

  async get(){
 if(this.page>1){
 this.inProgress=true;
 }   
let queryParams = '';
if(this.moduleId!=''){
  let userId =  await this.localstoreService.getRec('_id');
queryParams='?module='+this.moduleId+'&user='+userId+'&page='+this.page
}else if(this.linkedUser!=''){
queryParams='?user='+this.linkedUser+'&page='+this.page
} 
   this.activityService
        .getActivity(queryParams)
        .subscribe((res) => {
        if(res ){
         this.inProgress=false;
       this.totalCount=res.count;
       let newRecords=(res.data)?res.data:[];
       // newRecords = newRecords.reverse();
       //this.pushNewRecord(newRecords);
       this.processData(newRecords);
       this.showLoading = false;
    
        }else{
           this.showLoading = false;
          this.inProgress=false;
        }
       })
  }
    returnIndex(data:any,key:any,value:any){
     const index = data.findIndex((object:any) => {
           return object[key] === value;
       });
     return index;


  }

    randColourClass(items:any) {
     return items[items.length * Math.random() | 0];
    }

   assignColors(){
    for(let a=0;a<this.activities.length;a++){
      this.activities[a]['itemClass']=this.randColourClass(this.colors);
    }
   }

  returnOnlytime(item:any){
  let date = item.createdAt;
  let time = moment(date).format('HH:mm');
  return time;
  }

  loadMore(){
   if(this.inProgress==true){
    return;
  }
    this.page=this.page+1;
    this.get();
  }


  showAllActivity(){
    this.router.navigate([`/activities`]);
  }

}
