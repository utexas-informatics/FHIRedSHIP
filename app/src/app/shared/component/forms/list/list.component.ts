import { Component, OnInit, Input } from '@angular/core';
import { LocalstoreService } from '../../../../shared/service/localstore/localstore.service';
import { ResponseService } from '../../../../services/response/response.service';
import { Router, ActivatedRoute } from "@angular/router";
import { UtilsService } from '../../../../shared/service/utils/utils.service';


@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {

   @Input() moduleId: any;
   isLoaded:boolean=false;
   showLoading:boolean=false;
   responseList:any=[];
   mode:any='list';
   responseId:any="";
   page:any=1;
   role:any;
   templateId:any="";
   totalCount: number = 0;
   limit:number = 10;
   isTempIdExistInParams:boolean=false;
 
  constructor(  
  private utilsService:UtilsService,
  private router: Router,
  private route: ActivatedRoute,
  private responseService:ResponseService,
  private localstoreService: LocalstoreService) { }

  async ngOnInit(): Promise<void> {
  let role:any = await this.localstoreService.getRec('role');
  this.role = role.role;
  this.showLoading = true;
  this.get(this.moduleId,this.page,this.limit);
  let url = window.location.href;
  let queryParams =  this.utilsService.sortParams(url);
  if(Object.keys(queryParams).length !== 0 && queryParams.tempId){
  this.isTempIdExistInParams = true;
  this.mode = 'form';
  this.responseId = (queryParams.resId)?queryParams.resId:"";
  this.templateId = queryParams.tempId;
  }

  // this.route.queryParams.subscribe(async (queryParams: any) => {
  // if(queryParams && queryParams.tempId){
  // this.isTempIdExistInParams = true;
  // this.mode = 'form';
  // this.responseId = (queryParams.resId)?queryParams.resId:"";
  // this.templateId = queryParams.tempId;
  // }
  // });

  

  }

onPageChange(pageNumber:any){
    this.showLoading = true;
    this.page = pageNumber;
    this.get(this.moduleId,this.page,this.limit);
  }

  receiveData(data:any){
  if(this.isTempIdExistInParams == true){
  this.settabinfo("forms");
  this.isTempIdExistInParams = false;
  }
  this.mode = 'list';

  }

async get(moduleId:any,page:any,limit:any) {
  this.responseService.getResponses(moduleId,page,limit).subscribe((response:any) => {
  
        if (response && !response.error) {
           if(response && response.data){
            this.responseList = response.data;
            this.totalCount=response.count?response.count:0;
            this.showLoading = false;
         }
        }
        else{
          this.showLoading = false;
        }
   });
}

openResponse(resp:any){
  this.responseId = resp._id;
  this.templateId = resp.templateId._id;
  this.mode = 'form';

}
settabinfo(tab:any){
if (window.history.pushState) {
    // if(tab !== 'messages'){
       var newurl = window.location.protocol + "//" + window.location.host + window.location.pathname + '?tab='+tab;
     window.history.pushState({path:newurl},'',newurl);
    // }
  
  
}
}
back(mode:string){
  if(this.isTempIdExistInParams == true){
  this.settabinfo("forms");
  this.isTempIdExistInParams = false;
  }
  this.responseId = "";
  this.templateId="";
  this.mode = mode;
}

}
