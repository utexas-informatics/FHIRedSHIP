import { Component, OnInit, Input } from '@angular/core';
import { LocalstoreService } from '../../../shared/service/localstore/localstore.service';
import { MsgService } from '../../../services/msg/msg.service';
import { UtilsService } from '../../../shared/service/utils/utils.service';
import { UserService } from '../../../user.service';
import { AppointmentService } from '../../../services/appointment/appointment.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { environment } from '../../../../environments/environment';
export {};
declare global {
  interface Window {
    Calendly: any;
  }
} 
@Component({
  selector: 'app-appointment',
  templateUrl: './appointment.component.html',
  styleUrls: ['./appointment.component.scss'],
})
export class AppointmentComponent implements OnInit {
  userId: any = '';
  appointmentList: any = [];
  mode: any = 'list';
  role: any = '';
  userEmail: any = '';
  page: number = 1;
  limit:number= 10;
  totalCount: number = 0;
  sc_url: any = '';
  accessToken: any = '';
  meetingWith:any ='';
  showLoading:boolean=false;
  @Input() appointmenData: any;
  @Input() moduleId: any;
  @Input() moduleName: any;
  constructor(
    private utilsService:UtilsService,
    private localstoreService: LocalstoreService,
    private fb: FormBuilder,
    private userService: UserService,
    private msgService: MsgService,
    private router: Router,
    private route: ActivatedRoute,
    private apptService: AppointmentService
  ) {
    window.addEventListener('message', (e: any) => {
      if (this.isCalendlyEvent(e)) {
        /* Example to get the name of the event */
 

        /* Example to get the payload of the event */

      }
    });
  }

  async ngOnInit(): Promise<void> {
    if (this.moduleId) {
      this.moduleId = this.moduleId.split('?')[0];
    }
    this.mode = 'list';
    this.resetValues();
    let role: any = await this.localstoreService.getRec('role');
    this.role = role.role;
    this.userEmail = await this.localstoreService.getRec('email');
    this.userId = await this.localstoreService.getRec('_id');
    this.getAppt();
   
    let url = window.location.href;
    let queryParams =  this.utilsService.sortParams(url);
    if(Object.keys(queryParams).length !== 0){
      if(queryParams.meetingWith){
        this.meetingWith = queryParams.meetingWith.toLowerCase();
        setTimeout(()=>{
          this.bookAppt(this.meetingWith);
        },1000);
      }
    }
    // this.route.queryParams.subscribe((queryParams: any) => {
    //   if(queryParams && queryParams.meetingWith){
    //   if(!this.meetingWith || (this.meetingWith !== queryParams.meetingWith)){
    //     this.meetingWith = queryParams.meetingWith.toLowerCase();
    //     setTimeout(()=>{
    //       this.bookAppt(this.meetingWith);
    //     },1000);
          
    //   }
    //   }
    //   });
  }



  settabinfo(tab:any){
    if (window.history.pushState) {
        // if(tab !== 'messages'){
           var newurl = window.location.protocol + "//" + window.location.host + window.location.pathname + '?tab='+tab;
         window.history.pushState({path:newurl},'',newurl);
        // }
      
      
    }
    }
  onPageChange(pageNumber:any){
    this.page = pageNumber;
    this.getAppt();
  }
  resetValues() {
    this.page = 1;
    this.appointmentList = [];
    this.totalCount = 0;
  }

  async getAppt() {
    this.showLoading = true;
    this.apptService
    .getAppointment(this.moduleId,this.page,this.limit)
    .subscribe((response) => {
     
        if (response && !response.error) {
   
         this.totalCount=response.totalCount?response.totalCount:0;
         this.appointmentList=response.data;

        }
      this.showLoading = false;
    });
  }

  isCalendlyEvent(e: any) {
    return (
      e.origin === 'https://calendly.com' &&
      e.data.event &&
      e.data.event.indexOf('calendly.') === 0
    );
  } 

  async cancelAppt(appointment: any) {
    let uuid = appointment.eventUrl.split('scheduled_events/')[1];
    //let cancelResp = await this.apptService.cancelAppt(appointment);
     appointment.status = "canceled";
    this.msgService.show("",this.msgService.msgObject.apptCancelSuccess,'success','4000');
    this.apptService.cancelAppt(appointment).subscribe((response:any) => {
      if (response) {
        if (!response.error) {
           if(response){
           
          // this.appointmentList = [];
          //  this.getAppt();
         }
        }
        else{
           appointment.status = "active";
          this.msgService.show("",this.msgService.msgObject.apptCancelError,'danger','4000');

        }
      }
   });


  }
 
  reSchedule(appointment: any) {}

  ngOnDestroy(): void {
    this.mode = 'list';
  }

  switchMode(mode: string) {
    this.mode = mode;
    if(this.meetingWith){
      this.settabinfo('appointments');
    }
    if (mode === 'list') {
      this.meetingWith = '';
      this.resetValues();
      this.getAppt();
    }
  }
  bookAppt(type: any) {
    this.sc_url = '';
    this.accessToken = '';
    let calenderType = '';
    let inviteeEmail = this.userEmail;
    let inviteeId = this.userId;
    let inviteeType = type;
    if(type === 'patient'){
      inviteeId = this.appointmenData['patient'].id;
      inviteeEmail = this.appointmenData['patient'].email;
      type = this.role.toLowerCase();
    }
    let accDisabled = false;
    if(type === 'cbo'){
      if(this.appointmenData.acceptedBy){
      if(this.appointmenData.acceptedBy && this.appointmenData.acceptedBy.appointmentData && this.appointmenData.acceptedBy.appointmentData.disable !== false){
        accDisabled = true;
      }
      }
      else{
      if(this.appointmenData[type] && this.appointmenData[type][0].appointmentData && this.appointmenData[type][0].appointmentData.disable !== false){
        accDisabled = true;
      }
      }
 
    }else{
      if(this.appointmenData[type] && this.appointmenData[type].appointmentData && this.appointmenData[type].appointmentData.disable !== false){
        accDisabled = true;
      }
    }
    if (accDisabled === false) {
      this.mode = 'new';
      setTimeout(() => {
        if (this.appointmenData[type]) {
          if (type === 'cbo') {
            calenderType = 'cbo';
            let appointmenDataSet:any = {};
            
            if(this.appointmenData.acceptedBy && this.appointmenData.acceptedBy.appointmentData){
             appointmenDataSet = this.appointmenData.acceptedBy.appointmentData;
            }
            else if(this.appointmenData[type][0] && this.appointmenData[type][0].appointmentData){
              appointmenDataSet = this.appointmenData[type][0].appointmentData;

            }

            this.accessToken = (appointmenDataSet && appointmenDataSet.access_token)?appointmenDataSet.access_token:"";
            this.sc_url = (appointmenDataSet && appointmenDataSet.scheduling_url)?appointmenDataSet.scheduling_url:"";
            // this.accessToken =
            //   this.appointmenData[type][0] &&
            //   this.appointmenData[type][0].appointmentData &&
            //   this.appointmenData[type][0].appointmentData.access_token
            //     ? this.appointmenData[type][0].appointmentData.access_token
            //     : '';
            // this.sc_url =
            //   this.appointmenData[type][0] &&
            //   this.appointmenData[type][0].appointmentData &&
            //   this.appointmenData[type][0].appointmentData.scheduling_url
            //     ? this.appointmenData[type][0].appointmentData.scheduling_url
            //     : '';
          
          } else {
            calenderType = 'chw';
            this.accessToken =
              this.appointmenData[type].appointmentData &&
              this.appointmenData[type].appointmentData.access_token
                ? this.appointmenData[type].appointmentData.access_token
                : '';
            this.sc_url =
              this.appointmenData[type].appointmentData &&
              this.appointmenData[type].appointmentData.scheduling_url
                ? this.appointmenData[type].appointmentData.scheduling_url
                : '';
          } 
          if (this.sc_url) {
           let cboId = "";
           if(this.appointmenData['acceptedBy']){
            cboId = this.appointmenData['acceptedBy'].id;
           }
           else{
            cboId = this.appointmenData['cbo'][0].id;
           }

            let utm:any = {
              utmCampaign: cboId,
              utmSource: this.moduleId,
              utmMedium: this.appointmenData['chw'].id,
              utmContent: calenderType,
              utmTerm: inviteeId,
            }
  
            if(inviteeType === 'patient'){
              if(calenderType === 'cbo'){
                utm.utmMedium = null;
              }else if(calenderType === 'chw'){
                utm.utmCampaign = null;
              }
            }
           
            window.Calendly.initInlineWidget({
              url: this.sc_url,
              parentElement: document.querySelector('.calendly-inline-widget'),
              prefill: { email: inviteeEmail ,name: inviteeEmail},
              utm: utm,
            });
          }
        }
      }, 1000);
    }else{
      this.msgService.show("",this.msgService.msgObject.apptAccNotCreated,'error','4000');
    }
   
  }
}
