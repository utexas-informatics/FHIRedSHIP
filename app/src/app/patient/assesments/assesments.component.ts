import { Component, OnInit } from '@angular/core';
import { PatientService } from "./../patient.service";
import { Router, ActivatedRoute } from "@angular/router";
import { environment } from "../../../environments/environment";
import { QuestionnaireresponseService } from '../../services/questionnaireresponse/questionnaireresponse.service';
import { LocalstoreService } from '../../shared/service/localstore/localstore.service';
import { UserService } from '../../user.service';

@Component({
  selector: 'app-assesments',
  templateUrl: './assesments.component.html',
  styleUrls: ['./assesments.component.scss']
})
export class AssesmentsComponent implements OnInit {
questionnaireresponses:any=[];
id:string='';
totalCount:number=0;
pageLimit: number = 10;
page:number=1;
showLoading: boolean = false;
show_access_message:any=false;
  constructor(private router: Router,
    private route: ActivatedRoute,
    private patientService: PatientService, private questionnaireresponseService:QuestionnaireresponseService,private localstoreService: LocalstoreService,private userService: UserService) { }

  ngOnInit(): void {
    this.userService.bcrumb.next([]);
  	this.route.params.subscribe(async (params:any) => {
      if (params.id != undefined && params.id != null && params.id != "") {
        this.id=params.id;
        let uuidEnable:any = await this.localstoreService.getRec("uuidEnable");
        if(uuidEnable && uuidEnable === true){
          this.get();
        }else{
          this.showLoading = false;
        }
     }
    });
    this.userService.bcrumb.next([{name:'Patients',last:false,url:"/patients"},{name:'Assessments',last:true,url:""}]);
  }

 async get() {
  this.showLoading = true;
  var queryParameterString='';

  let facility:any = await this.localstoreService.getRec('facility');
  let role:any = await this.localstoreService.getRec('role');
  // let uuid:any = await this.localstoreService.getRec('uuid');
  let userId:any = await this.localstoreService.getRec('_id');
  // if(!uuid){
  //   uuid='';
  // }
  if(role.role=='Patient'){
    queryParameterString=queryParameterString+`?patient=${this.id}&requester_type=${role.role}&page=${this.page}&limit=${this.pageLimit}`;
  }else{
    queryParameterString=queryParameterString+`?patient=${this.id}&id=${userId}&requester_type=${role.role}&page=${this.page}&limit=${this.pageLimit}`;
  } 

  this.questionnaireresponseService.getquestionnaireresponses(queryParameterString).subscribe((response) => {
      if (response) {
        if (!response.error) {
           if(response.data.length>0){
            this.questionnaireresponses = response.data;
            this.totalCount = response.count;
          }
        }
        else{
          this.show_access_message = true;

        }
      }
      this.showLoading = false;
    });
  /*  this.patientService.getAssesmentResponses(this.id).subscribe((response) => {
      if (response) {
        if (!response.error) {
           if(response.length>0){
            this.questionnaireresponses = response;
          }
        }
      }
    });*/ 

  }


  onPageChange(pageNumber:any) {
    this.page = pageNumber;
    this.get();
    }

  goTOAssesment(resp:any){
    let path=`patients/${resp.sid}/response/${resp._id}`;
    //let domain=environment.refDomain;
   //let completeUrl=domain+path;
    //console.log('path - ',completeUrl);
    //this.router.navigate([`patient/${completeUrl}/response/${resp._id}`]);
    this.router.navigate([`${path}`], {queryParams:{pid:this.id}});
  }

}
