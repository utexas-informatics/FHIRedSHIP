import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { environment } from '../../../environments/environment';
import { PatientService } from './../patient.service';
import { LocalstoreService } from '../../shared/service/localstore/localstore.service';
import { get } from 'scriptjs';
declare var LForms: any;
declare var $: any;
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { ConditionService } from '../../services/condition/condition.service';
import { UserService } from '../../user.service';

@Component({
  selector: 'app-patassesment',
  templateUrl: './patassesment.component.html',
  styleUrls: ['./patassesment.component.scss'],
}) 
export class PatassesmentComponent implements OnInit {
  id: string = '';
  rid: string = '';
  data: any = {};
  conditionsArr: any = [];
  searchList: any = [];
  selectedRow: any = 0; 
  questionnaire:any={};
  initialProcessing: boolean = false;
  showLoading: boolean = true;
  showCondLoading:boolean = false;
  role: any = '';
  pid:any = '';
  //iframeUrl:any="http://test.fhir.com:8080/leap/";
  constructor(
    private modalService: NgbModal,
    private router: Router,
    private route: ActivatedRoute,
    private patientService: PatientService,
    private ConditionService: ConditionService,
    private localstoreService: LocalstoreService,
    private userService: UserService
  ) {}

  async ngOnInit(): Promise<void> {
    this.pid = this.route.snapshot.queryParamMap.get('pid');
    this.userService.bcrumb.next([]);
    let role: any = await this.localstoreService.getRec('role');
    this.role = role.role;
    this.removeScript();
    setTimeout(() => {
      this.loadScript();
    }, 100);
    this.route.params.subscribe((params: any) => {
      if (
        params.id != undefined &&
        params.id != null &&
        params.id != '' &&
        params.rid != undefined &&
        params.rid != null &&
        params.rid != ''
      ) {
        this.id = params.id;
        this.rid = params.rid;
        //this.getConditions();
      }
    });
  }

  triggerChild(event: any) {}

  getConditions() {
    this.conditionsArr = [];
    this.showCondLoading = true;
    let queryString = `?questionnaireResponse=` + this.rid;
    this.ConditionService.getConditions(queryString).subscribe((response) => {
      if (response) {
        if (!response.error) {
          if (response && response.length && response.length>0) {
            this.conditionsArr = response
              ? response
              : [];
          }
        }
      }
      this.showCondLoading = false;
    });
  }
 
  getAssesmentResponse() {

   this.patientService.getAssesmentResponse(this.rid).subscribe((response) => {
      if (response) {
        if (!response.error && response.data) {
          if(response.data.questionnaireresponse && response.data.questionnaireresponse.questionnaire){
          let questionnaireResponse = response.data.questionnaireresponse;
          let questionnaireSplit = response.data.questionnaireresponse.questionnaire.split("Questionnaire/");
          let length = questionnaireSplit.length - 1;
          let questionnaireId = questionnaireSplit[length];

           this.patientService.getAssesmentForm(questionnaireId).subscribe((questionnaire) => {
            if(questionnaire.status == true){
            
            let questionnaireData = questionnaire.data;
            this.userService.bcrumb.next([{name:'Patients',last:false,url:"/patients"},{name:'Assessments',last:false,url:`/patients/${this.pid}/assessments`},{name:`${questionnaireData.name}`,last:true,url:''}]);
            this.questionnaire = questionnaireData;



            if (
              questionnaireResponse &&
              questionnaireData
            ) {
        
              let lformsQ = LForms.Util.convertFHIRQuestionnaireToLForms(
                questionnaireData,
                'R4'
              );
              this.data = LForms.Util.mergeFHIRDataIntoLForms(
                'QuestionnaireResponse',
                questionnaireResponse,
                lformsQ,
                'R4'
              );
              this.renderAssesment();
            }

            }
            else{

            }


           });
          



          }
    
          // if (response.data) {
          //   if (
          //     response.data.questionnaire &&
          //     response.data.questionnaireresponse
          //   ) {
          //     let questionnaire = response.data.questionnaire;
          //     let questionnaireResponse =
          //       response.data.questionnaireresponse;
          //     let lformsQ = LForms.Util.convertFHIRQuestionnaireToLForms(
          //       questionnaire,
          //       'R4'
          //     );
          //     this.data = LForms.Util.mergeFHIRDataIntoLForms(
          //       'QuestionnaireResponse',
          //       questionnaireResponse,
          //       lformsQ,
          //       'R4'
          //     );
          //     this.renderAssesment();
          //   }
          // }
        }
        this.initialProcessing = true;
      } else {
        this.initialProcessing = true;
      }
      setTimeout(()=>{
       this.showLoading = false;
      },500);
    });
  


  }

  getResponse() {
    let qres = LForms.Util.getFormFHIRData('QuestionnaireResponse', 'R4');
    return qres;
  }

  renderAssesment() {
    //console.log('renderAssesment init - ', LForms);
    LForms.Util.addFormToPage(this.data, 'formContainer');
    setTimeout(() =>{
     $(`.ac_multiple`).attr("readonly","readonly");
    },500);
  }

  removeScript() {
    let dynamicScripts = [
      'https://clinicaltables.nlm.nih.gov/lforms-versions/30.0.0/webcomponent/assets/lib/zone.min.js',
      'https://clinicaltables.nlm.nih.gov/lforms-versions/30.0.0/webcomponent/scripts.js',
      'https://clinicaltables.nlm.nih.gov/lforms-versions/30.0.0/webcomponent/runtime-es5.js',
      'https://clinicaltables.nlm.nih.gov/lforms-versions/30.0.0/webcomponent/polyfills-es5.js',
      'https://clinicaltables.nlm.nih.gov/lforms-versions/30.0.0/webcomponent/main-es5.js',
      'https://clinicaltables.nlm.nih.gov/lforms-versions/30.0.0/fhir/R4/lformsFHIR.min.js',
    ];
    for (let j = 0; j < dynamicScripts.length; j++) {
      let cururl = dynamicScripts[j];
      try {
      } catch (er) {}
    }
  }

  loadScript() {
    get(
      'https://clinicaltables.nlm.nih.gov/lforms-versions/30.0.0/webcomponent/runtime-es5.js',
      () => {
     
        get(
          'https://clinicaltables.nlm.nih.gov/lforms-versions/30.0.0/webcomponent/main-es5.js',
          () => {
           
            get(
              'https://clinicaltables.nlm.nih.gov/lforms-versions/30.0.0/fhir/R4/lformsFHIR.min.js',
              () => {
         
                get(
                  'https://clinicaltables.nlm.nih.gov/lforms-versions/30.0.0/webcomponent/assets/lib/zone.min.js',
                  () => {
              
                    get(
                      'https://clinicaltables.nlm.nih.gov/lforms-versions/30.0.0/webcomponent/polyfills-es5.js',
                      () => {
               
                        get(
                          'https://clinicaltables.nlm.nih.gov/lforms-versions/30.0.0/webcomponent/scripts.js',
                          () => {
                       

                            this.getAssesmentResponse();
                          }
                        );
                      }
                    );
                  }
                );
              }
            );
          }
        );
      }
    );
  }

  /*
removeConditionRecord(id:any){
this.patientService.removeCondition(id).subscribe((response) => {
      if (response) {
        if (!response.error) {
          alert('deleted');
        }
      } 
   });
}

removeRow(index:any){
  let rowdata:any=this.conditionsArr[index];
  if(rowdata.condId && rowdata.condId!=''){
    this.removeConditionRecord(rowdata.condId);
  }
  this.conditionsArr.splice(index,1);
  alert('condition removed');
}

addRow(){
 let code:any='';
 let desc:any ='NA';
 let row:any={questionnaireresponsId:this.rid,sid:this.id,code:code,desc:desc,need:'',condId:''};
this.conditionsArr.push(row);
}

saveCondition(list:any, index:any){
console.log('cond data - ',this.conditionsArr);
let obj=list;
obj={
  questionnaireresponsId:list.questionnaireresponsId,
  sid:list.sid,
  code:list.code,
  desc:list.desc,
  need:list.need,
  data:list,
};

this.patientService.saveCondition(obj).subscribe((response) => {
      if (response) {
        if (!response.error) {
          alert('saved');
         list.condId=response._id;
         this.conditionsArr[index].condId=response._id;
        }
      } 
    });
}
*/
  onKeyup(event: any, i: any) {
    /* this.selectedRow=i;
  let term=event.target.value;
 this.patientService.searchCodes(term).subscribe((response) => {
 if (response) {
 if (!response.error) {
this.searchList=response;
  let einfo:any = $(event.target)[0].getBoundingClientRect();
 let left = einfo.left;
 let top = einfo.top+30;
 $('.cust-list').css({ "top": top + "px", 'left':  left+ "px", opacity: 1 });
    console.log('conditionsArr list - ',this.searchList);
        }
      } 
    });*/
  }
  /*
selectitem(list:any){
this.conditionsArr[this.selectedRow].code=list.code;
this.conditionsArr[this.selectedRow].desc=list.desc;
if(this.conditionsArr[this.selectedRow].need && this.conditionsArr[this.selectedRow].need!=''){
this.saveCondition(this.conditionsArr[this.selectedRow], this.selectedRow);
}
console.log('list -- ',list);
}

resetListPosition(){
 let left = -9999999999;
 let top = -99999999999
 $('.cust-list').css({ "top": top + "px", 'left':  left+ "px", opacity: 0 });
 console.log('conditionsArr list - ',this.searchList);
}
*/
  /*onClickedOutside(event:any){
this.resetListPosition();
}*/

  setNeedInCondition(event: any, i: any) {
    /*console.log('setNeedInCondition -- ',i);
this.conditionsArr[i].need=event.target.value;
if(this.conditionsArr[i].need!='' && this.conditionsArr[i].code!='' && this.conditionsArr[i].desc!=''){
this.saveCondition(this.conditionsArr[i], i);
}*/
  }

  /*getConditionData(rid:any){
    this.patientService.getconditions(this.rid).subscribe((response) => {
      if (response) {
        if (!response.error && response.condition) {
          this.conditionsArr=response.condition
        }
      } 
   });
  }*/
 
  open(content: any) {
    this.getConditions();
    this.modalService
      .open(content, {size:'xl', ariaLabelledBy: 'modal-basic-title',centered:true })
      .result.then(
        (result) => {
          // this.closeResult = `Closed with: ${result}`;
        },
        (reason) => {
          //this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        }
      );
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }
}
