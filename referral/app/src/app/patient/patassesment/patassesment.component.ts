import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { PatientService } from './../patient.service';
import { LocalStore } from '../../shared/service/localstore/localstore.service';
import { get } from 'scriptjs';
import { MsgService } from '../../services/msg/msg.service';
import { environment } from '../../../environments/environment';
import { UserService } from '../../user.service';
declare var LForms: any;
declare var $: any;
@Component({
  selector: 'app-patassesment',
  templateUrl: './patassesment.component.html',
  styleUrls: ['./patassesment.component.scss'],
})
export class PatassesmentComponent implements OnInit {
  data: any = {};
  mode: string = 'new';
  id: string = '';
  aid: string = '';
  rid: string = '';
  sharedTemp:string = '';
  sharedBy: string = '';
  conditionsArr: any = [];
  searchList: any = [];
  selectedRow: any = 0;
  questionnaire: any = {};
  formName: any = '';
  role: any = '';

  constructor(
    private localStore: LocalStore,
    private router: Router,
    private route: ActivatedRoute,
    private patientService: PatientService,
    private msgService: MsgService,
    private userService: UserService
  ) {}

  async ngOnInit(): Promise<void> {
    let userData: any = await this.localStore.get('ref-auth');
    if (userData) {
      userData = JSON.parse(userData);

      this.role = userData.role;

    }
    $('.site-loading').css('display', 'block');
    $('body').addClass('body-loading');
    this.removeScript();
    setTimeout(() => {
      this.loadScript();
    }, 100);
    this.route.params.subscribe((params: any) => {
      if (
        params.id != undefined &&
        params.id != null &&
        params.id != '' &&
        params.aid != undefined &&
        params.aid != null &&
        params.aid != '' &&
        params.sharedBy != undefined &&
        params.sharedBy != null &&
        params.sharedBy != '' &&
        params.sharedTemp
      ) { 
        this.mode = 'new';
        this.id = params.id;
        this.aid = params.aid;
        this.sharedTemp = params.sharedTemp;
        this.sharedBy = params.sharedBy;
      } else if (
        params.id != undefined &&
        params.id != null &&
        params.id != '' &&
        params.rid != undefined &&
        params.rid != null &&
        params.rid != ''
      ) {
        this.mode = 'old';
        this.id = params.id;
        this.rid = params.rid;
      }
    });

    // if (
    //   this.route.snapshot.queryParamMap.has('token') &&
    //   this.route.snapshot.queryParamMap.has('email')
    // ) {
    //   const email = this.route.snapshot.queryParamMap.get('email');
    //   const token = this.route.snapshot.queryParamMap.get('token');
    //   if (token === environment.token) {
    //     const encryptedUserCredentials = btoa(`${email}:${token}`);
    //     console.log('encryptedUserCredentials - ', encryptedUserCredentials);
    //     this.userService
    //       .login(encryptedUserCredentials)
    //       .subscribe(async (res) => {
    //         if (res && res.status == true) {
    //           this.localStore.set('ref-auth', res.data);
    //           let userData: any = await this.localStore.get('ref-auth');
    //           if (userData) {
    //             userData = JSON.parse(userData);

    //             this.role = userData.role;
    //             console.log('role', this.role);
    //           }
    //         } else {
    //           this.msgService.show('', res.msg, 'danger', '4000');
    //         }
    //       });
    //   }
    // }
  } 
 
  getAssesmentResponse() {
    this.patientService.getAssesmentResponse(this.rid).subscribe((response) => {
      if (response) {
        if (!response.error && response.questionnaireresponse) {
          this.questionnaire = response.questionnaireresponse;
          let questionnaireSplit =
            response.questionnaireresponse.questionnaire.split(
              'Questionnaire/'
            );
          let length = questionnaireSplit.length - 1;
          let questionnaireId = questionnaireSplit[length];
          this.aid = questionnaireId;

          this.questionnaire = response.questionnaireresponse;

          let userSplit =
          response.questionnaireresponse.source.reference.split(
            'Practitioner/'
            );
          let userlength = userSplit.length - 1;
          let uId = userSplit[userlength];
          this.sharedBy = uId;
          this.patientService
            .getAssesmentForm(questionnaireId)
            .subscribe((questionnaire) => {
              if (questionnaire && questionnaire.name) {
                this.formName = questionnaire.name;
                let questionnaireData = questionnaire;

                if (questionnaireData && this.questionnaire) {
                  //this.conditionsArr=response.condition?response.condition:[];
                  let questionnaireResponse = this.questionnaire;
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
            });
          this.patientService
            .getCondition(this.questionnaire.id)
            .subscribe((condition) => {
              this.conditionsArr = condition.condition
                ? condition.condition
                : [];
            });
        }
      }
      setTimeout(() => {
        $('.site-loading').css('display', 'none');
        $('body').removeClass('body-loading');
      }, 2000);
    });
  }

  getAssesment() {
    const data = {
      sid: this.id,
      templateId: this.aid,
      sharedBy: this.sharedBy,
      sharedTemp:this.sharedTemp
    };
    this.patientService.checkShared(data).subscribe((res: any) => {
      if (res) {
        if (!res.error) {
          if (res.status === true) {
            if(res.respId){
              this.mode = 'old';
              this.rid = res.respId;
              this.getAssesmentResponse();
            }else{
              this.patientService.getAssesment(this.aid).subscribe((response) => {
                if (response) {
                  if (!response.error) {
                    this.data = response;
                    this.formName = this.data.name;
                    this.renderAssesment();
                  }
                }
              });
            }
          
          } else {
            this.msgService.show(
              '',
              this.msgService.msgObject.tempNotShared,
              'danger',
              '4000'
            );
          }
        }
      }
      setTimeout(() => {
        $('.site-loading').css('display', 'none');
        $('body').removeClass('body-loading');
      }, 2000);
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

  saveResponse() {
    let qresponse = this.getResponse();

    qresponse.meta.profile.push(this.id);

    qresponse['author'] = {
      reference: 'Patient/' + this.id,
    };
    qresponse['source'] = {
      reference: 'Practitioner/' + this.sharedBy,
    };
    qresponse['subject'] = {
      reference: 'Patient/' + this.id,
      display: '',
    };

    let obj: any = {
      sid: this.id? this.id:'',
      data: qresponse,
      user: this.sharedBy?this.sharedBy:'',
      questionnaireId: this.aid?this.aid:'',
      fhirId: this.data && this.data.id?this.data.id:'',
      uuid: this.sharedBy?this.sharedBy:'',
    };
    if(this.sharedTemp){
      obj['sharedTempId'] = this.sharedTemp;
    }
    if(this.rid){
      obj['rid'] = this.rid;
      this.patientService.updateResponse(obj).subscribe((response) => {
        if (response) {
          if (!response.error) {
            this.msgService.show(
              '',
              this.msgService.msgObject.responseSave,
              'success',
              '4000'
            );
          }
        }
        this.router.navigate([`patient/${this.id}/assesments`]);
      });
    }else{
      this.patientService.saveAssesmentResponse(obj).subscribe((response) => {
        if (response) {
          if (!response.error) {
            this.msgService.show(
              '',
              this.msgService.msgObject.responseSave,
              'success',
              '4000'
            );
          }
        }
        this.router.navigate([`patient/${this.id}/assesments`]);
      });
    }
    
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
        $(`[src='${cururl}']`).remove();
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
                

                            if (this.mode == 'new') {
                              this.getAssesment();
                            } else {
                              this.getAssesmentResponse();
                            }
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

    /*get("https://clinicaltables.nlm.nih.gov/lforms-versions/30.0.0/webcomponent/runtime-es5.js", () => {
        console.log('loaded 3');
    });
    get("https://clinicaltables.nlm.nih.gov/lforms-versions/30.0.0/webcomponent/main-es5.js", () => {
        console.log('loaded 5');
    });
     get("https://clinicaltables.nlm.nih.gov/lforms-versions/30.0.0/fhir/R4/lformsFHIR.min.js", () => {
        console.log('loaded 6');
    });
     get("https://clinicaltables.nlm.nih.gov/lforms-versions/30.0.0/webcomponent/assets/lib/zone.min.js", () => {
        console.log('loaded 1');
    });
      get("https://clinicaltables.nlm.nih.gov/lforms-versions/30.0.0/webcomponent/polyfills-es5.js", () => {
        console.log('loaded 4');
    });
       get("https://clinicaltables.nlm.nih.gov/lforms-versions/30.0.0/webcomponent/scripts.js", () => {
        console.log('loaded 2');
    });
*/
  }

  removeConditionRecord(id: any) {
    this.patientService.removeCondition(id).subscribe((response) => {
      if (response) {
        if (!response.error) {
          this.msgService.show(
            '',
            this.msgService.msgObject.condDel,
            'success',
            '4000'
          );
        }
      }
    });
  }

  removeRow(index: any) {
    let rowdata: any = this.conditionsArr[index];
    if (rowdata.condId && rowdata.condId != '') {
      this.removeConditionRecord(rowdata.condId);
    }
    this.conditionsArr.splice(index, 1);
    this.msgService.show(
      '',
      this.msgService.msgObject.condRemoved,
      'success',
      '4000'
    );
  }

  addRow() {
    let code: any = '';
    let desc: any = 'NA';
    let row: any = {
      questionnaireresponsId: this.rid,
      sid: this.id,
      code: code,
      desc: desc,
      need: '',
      condId: '',
    };
    this.conditionsArr.push(row);
  }

  async saveCondition(list: any, index: any) {

    let obj = list;
    let uuid = '';
    let localData: any = await this.localStore.get('ref-auth');
    if (localData) {
      localData = JSON.parse(localData);
      uuid = localData.uuid ? localData.uuid : '';
    }

    obj = {
      questionnaireresponsId: list.questionnaireresponsId,
      sid: list.sid,
      code: list.code,
      desc: list.desc,
      need: list.need,
      data: list,
      user: uuid,
    };

    this.patientService.saveCondition(obj).subscribe((response) => {
      if (response) {
        if (!response.error) {
          this.msgService.show(
            '',
            this.msgService.msgObject.condSaved,
            'success',
            '4000'
          );
          list.condId = response._id;
          this.conditionsArr[index].condId = response._id;
        }else{
          if(response.message){
            this.msgService.show(
              '',
              response.message,
              'danger',
              '4000'
            );
            //this.conditionsArr.splice(index, 1);
          }
         
        }
      }
    });
  }

  onKeyup(event: any, i: any) {
    this.selectedRow = i;
    let term = event.target.value;
    this.patientService.searchCodes(term).subscribe((response) => {
      if (response) {
        if (!response.error) {
          this.searchList = response;
          let einfo: any = $(event.target)[0].getBoundingClientRect();
          let left = einfo.left;
          let top = einfo.top + 30;
          $('.cust-list').css({
            top: top + 'px',
            left: left + 'px',
            opacity: 1,
          });
        
        }
      }
    });
    return false;
  }

  selectitem(list: any) {
    this.conditionsArr[this.selectedRow].code = list.code;
    this.conditionsArr[this.selectedRow].desc = list.desc;
    if (
      this.conditionsArr[this.selectedRow].need &&
      this.conditionsArr[this.selectedRow].need != ''
    ) {
      //this.saveCondition(this.conditionsArr[this.selectedRow], this.selectedRow);
    }

  }

  resetListPosition() {
    let left = -9999999999;
    let top = -99999999999;
    $('.cust-list').css({ top: top + 'px', left: left + 'px', opacity: 0 });

  }

  onClickedOutside(event: any) {
    this.resetListPosition();
  }

  setNeedInCondition(event: any, i: any) {

    this.conditionsArr[i].need = event.target.value;
    if (
      this.conditionsArr[i].need != '' &&
      this.conditionsArr[i].code != '' &&
      this.conditionsArr[i].desc != ''
    ) {
      //this.saveCondition(this.conditionsArr[i], i);
    }
  }

  saveRow(i: any) {
    // if(!this.conditionsArr[i].need){
    //   this.msgService.show("",this.msgService.msgObject.needFill,'danger','4000');
    //   return;
    // }

    if (!this.conditionsArr[i].code) {
      this.msgService.show(
        '',
        this.msgService.msgObject.codeFill,
        'danger',
        '4000'
      );
      return;
    }

    if (this.conditionsArr[i].code && this.conditionsArr[i].desc) {
      this.saveCondition(this.conditionsArr[i], i);
    }
  }

  getConditionData(rid: any) {
    this.patientService.getconditions(this.rid).subscribe((response) => {
      if (response) {
        if (!response.error && response.condition) {
          this.conditionsArr = response.condition;
        }
      }
    });
  }
}
