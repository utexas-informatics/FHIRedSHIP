import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { LocalStore } from '../../shared/service/localstore/localstore.service';
declare var $: any;
import * as moment from 'moment';
import { ReferralService } from '../../services/referral/referral.service';
import { MsgService } from '../../services/msg/msg.service';

@Component({
  selector: 'app-referrals',
  templateUrl: './referrals.component.html',
  styleUrls: ['./referrals.component.scss'],
})
export class ReferralsComponent implements OnInit {
  referralArr: any = [];
  sid: string = '';
  role: any = '';
  id: any = '';
  currentRef:any = ''
  options: any = ['Edit'];
  constructor(
    private localStore: LocalStore,
    private router: Router,
    private route: ActivatedRoute,
    private referralService: ReferralService,
	private msgService:MsgService
  ) {}

  async ngOnInit(): Promise<void> {
    $('.site-loading').css('display', 'block');
    $('body').addClass('body-loading');
    let userData: any = await this.localStore.get('ref-auth');
    if (userData) {
      userData = JSON.parse(userData);
      this.role = userData.role ? userData.role.toLowerCase() : '';
  
    }
    this.route.params.subscribe((params: any) => {
      this.sid = params.id;
    });

    this.route.queryParams.subscribe(async (queryParams: any) => {
      if(queryParams && queryParams.id){
        this.id = queryParams.id;
         this.getReferralById();
      }
      else{
        this.getReferral();
      }
 
     });
    
  }

  setUrl(){
           var newurl = window.location.protocol + "//" + window.location.host + window.location.pathname;
         window.history.pushState({path:newurl},'',newurl);
         this.getReferral();
    }

  async getReferralById(){
    this.currentRef = '';
    this.referralArr = [];
    this.referralService.getRefById(this.id).subscribe((response) => {
            if (response) {
              if (!response.error && response._id) {
                this.currentRef = response.rawData.categoryLabel;
                this.referralArr.push(response);
                
              }
           } 
           $('.site-loading').css('display', 'none');
           $('body').removeClass('body-loading');
    });
    
    }
    

  returnTime(dt: any) {
    let date = moment().format('MMMM Do YYYY, h:mm:ss a');
    return date;
  }

  async edit(ref: any) {
    this.router.navigate([`referral/edit/${ref._id}`]);
  }
 
  async getReferral() {
    this.currentRef = '';
    let userId = '';
    var queryParameterString = '';
    let localData: any = await this.localStore.get('ref-auth');
    if (localData) {
      localData = JSON.parse(localData);
      userId = localData._id ? localData._id : '';
      let type = localData.type;
      let role = localData.role;
      if(role === 'Cbo'){
        let subs = localData.subs;
        userId = subs && subs.sub?atob(subs.sub):'';
      }
    }
    if (this.sid) {
      queryParameterString =
        queryParameterString +
        `?patient=${this.sid}&sid=${this.sid}&requester_type=Patient`;
    }
    userId = userId + queryParameterString;
    this.referralService.getReferral(userId).subscribe((response) => {
      if (response) {
        if (!response.error) {
          this.referralArr = response;
        }
      }
      $('.site-loading').css('display', 'none');
      $('body').removeClass('body-loading');
    });
  }

  async changeStatus(status: any, data: any, index: any) {
    let obj = {
      status: status,
      categoryLabel: data.rawData.categoryLabel,
      performer: data.cbo,
      requester: data.user,
      patient: data.sid,
    };
    this.referralService.updateStaus(data._id, obj).subscribe((response) => {
      if (response) {
        if (!response.error) {
          this.referralArr[index].rawData.status = status;
          this.referralArr[index].data.status = status.toLowerCase();
		  if(status === 'Revoked'){
			this.msgService.show("",this.msgService.msgObject.refDecline,'success','4000');
		  }else{
			this.msgService.show("",this.msgService.msgObject.refAccepted,'success','4000');
		  }
		  
        }
      }
    });
  }
 
  add() {
    this.router.navigate([`referral/new`]);
  }
}
