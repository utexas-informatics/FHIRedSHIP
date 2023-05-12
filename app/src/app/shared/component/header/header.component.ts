import { Component, OnInit } from '@angular/core';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { UserService } from '../../../user.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NotificationService } from '../../../services/notification/notification.service';
import { SettingsService } from '../../../services/settings/settings.service';
import { LocalstoreService } from '../../../shared/service/localstore/localstore.service';
import { Router, ActivatedRoute } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { Location, LocationStrategy, PathLocationStrategy } from '@angular/common';
import { MessageService } from '../../../services/message/message.service';
import { MsgService } from '../../..//services/msg/msg.service';
import { UtilsService } from '../../../shared/service/utils/utils.service';
import * as moment from 'moment';
declare var $: any;

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  onNotification: any;
  unAuthorised:any;
  onConnection: any;
  linkingEmail='';
  linkingForm: FormGroup;
  breadcrumbData:any = [];
  onFrame: any;
  isAccountLinked:any=false;
  notifications: any = [];
  emailNotFound: boolean=false;
  notificationCount: any;
  currentUrl: any;
  role: any;
  inFrame: boolean = false;
  name: any = '';
  userId: any;
  limit:any=5;
  email: any;
  page:any=1;
  type:any;
  subHeading:any;
  isSocketConnected:any;
  notUpdateListener:any;
  bCrumb:any;
  platform:any;
  constructor(
    private utilsService:UtilsService,
    private msgService:MsgService,
    private settingsService:SettingsService,
    private fb: FormBuilder,
    private modalService: NgbModal,
    private userService: UserService,
    private notificationService: NotificationService,
    private localstoreService: LocalstoreService,
    private router: Router,
    private route: ActivatedRoute,
    private location: Location,
    private messageService:MessageService
  ) {

   this.linkingForm = this.fb.group({
      email: [ 
        '',
        Validators.compose([Validators.required, Validators.email]),
      ],
    });


  }

  async ngOnInit(): Promise<void> {

   this.route.queryParams.subscribe(async (queryParams: any) => {
    if(queryParams && queryParams.deviceType){
      if(queryParams.deviceType == 'ios'){
        this.platform = queryParams.deviceType;
        $("body").addClass("fs-header-ios");
      }
     }

    });


    this.notifications = [];
    this.notificationCount = 0;
    let role: any = await this.localstoreService.getRec('role');
    this.role = role.role;

    //this.currentUrl = this.router.url;
    this.checkCurrentUrl();
    let firstName: any = await this.localstoreService.getRec('firstName');
    let LastName: any = await this.localstoreService.getRec('lastName');
    let email: any = await this.localstoreService.getRec('email');
    let userId: any = await this.localstoreService.getRec('_id');
    this.userId = userId;
    this.type = await this.localstoreService.getRec('type');
    if(this.role === 'Cbo'){
       let subs:any = this.localstoreService.getRec("subs");
      this.userId = subs ? atob(subs.sub):'';
    }
    this.notifications = [];
 
    
  
    if (this.userId) {
     this.getNotificationData();
    }

    if(firstName){
      this.name = firstName;
      if(LastName){
        this.name = this.name+ ' '+LastName;
      }
    }
    
    this.email = email;

    this.onFrame = this.userService.inIframeListener.subscribe((res) => {
      this.inFrame = res;
    });
    this.bCrumb =this.userService.bcrumbListener.subscribe((res) => {
      this.breadcrumbData = res;
    });

    
    this.notUpdateListener = this.notificationService.notUpdateListener.subscribe((res) => {

      if(res){
        let not = {"_id":res};
       this.notificationRead(not);
      }
     
    });



  this.unAuthorised = this.notificationService.unAuthorised().subscribe(async(data:any) =>{
 
    this.msgService.show('',"You don’t have access to this page or your session has expired",'danger','4000');
    this.userService.logOutUser(false,false);
  })
    this.onNotification = this.notificationService
      .onNotification()
      .subscribe(async (data: any) => {
        
       let id = await this.localstoreService.getRec('_id');
        if(id == data.senderId){
        
        
        }
        else{

            let index = this.notifications.findIndex((x: any) => x._id == data._id);
         
         if(data && data.createdAt == undefined){
          data.createdAt = new Date();
        }
        if (index === -1) {
          let msg = await this.parseDateFromString(data.message);
          let sp_msg = await this.parseDateFromString(data.message_sp);
          data.message = msg;
          data.message_sp = sp_msg;
          this.notifications.unshift(data);
          this.notificationCount = this.notificationCount + 1;
        } else {
          this.notifications[index].message = data.message;
        }

        }
   
      });
 
    this.notificationService.sendMessage('connectionInit', '', this.userId);
    this.notificationService.sendMessage('loggedInUser', '',this.userId);

    this.onConnection = this.notificationService
      .createRoom()
      .subscribe((data: any) => {
        let _id = this.localstoreService.getRec('_id');
        let role: any = this.localstoreService.getRec('role');
        role = role.role;
        let usertype:any =  this.localstoreService.getRec('type');
        if(role === 'Cbo'){
          let subs:any = this.localstoreService.getRec("subs");
          _id = subs ? atob(subs.sub):'';
        }
  
        if (_id && role !== 'Patient') {
          let userId: any = this.localstoreService.getRec('_id');
           this.notificationService.sendMessage('leave', userId, userId);
          this.notificationService.sendMessage('join', userId, userId);

          this.notificationService.sendMessage('leave', _id, this.userId);
          this.notificationService.sendMessage('join', _id, this.userId);
        }
      });

      this.isSocketConnected = this.notificationService
      .socketConnected()
      .subscribe((data: any) => {
        let _id = this.localstoreService.getRec('_id');
        let role: any = this.localstoreService.getRec('role');
        let token: any = this.localstoreService.getRec('access_token');
        role = role.role;


        this.notificationService.sendMessage('loggedInUser', '',this.userId);

        if (_id && role !== 'Patient') {
           let userId: any = this.localstoreService.getRec('_id');
          this.notificationService.sendMessage('leave', userId, userId);
          this.notificationService.sendMessage('join', userId, userId);
          this.notificationService.sendMessage('leave', _id, this.userId);
          this.notificationService.sendMessage('join', _id, this.userId);
        }
        
      });
  
  this.checkAndOpenModal();
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

  async checkAndOpenModal(){
   let role:any = await this.localstoreService.getRec('role');
   let type:any = await this.localstoreService.getRec('type');
   let linking:any = await this.localstoreService.getRec('uuidLinked');
   this.isAccountLinked = (linking)?linking:false;
   if(!linking && role.role!='Patient'){
    this.openModal();
    // if(role.role =='Cbo'){
    //   this.openModal();
    //   if(type && type === 'admin'){
    //     this.openModal();
    //   }
    // }else{
    //   this.openModal();
    // }
     
   }
  } 

   openModal(){
  let eleId='linkingModal';
   let ele:HTMLElement=document.getElementById(eleId) as HTMLElement;
   ele.click();
  }




async parseData(data:any){
for(let a=0; a < data.length;a++){
let msg = await this.parseDateFromString(data[a].message);
let sp_msg = await this.parseDateFromString(data[a].message_sp);
data[a].message = msg;
data[a].message_sp = sp_msg;
this.notifications.push(data[a]);
}
}

async getNotificationData(){
let response = await this.notificationService.getNotificationById(
        this.userId,this.limit,this.page
      );
      if (response && !response.error) {
         this.notificationCount = response.count;
         this.parseData(response.data);
        //this.notifications = this.notifications.concat(response.data);
       
      }

}


async loadMore(){
  this.page = this.page +1;
  this.getNotificationData();
}

  async markAll(){
    let notificationData = this.notifications;
    let notificationCoount = this.notificationCount;

    this.notifications = [];
    this.notificationCount =0;
    let response = await this.notificationService.updateAll(
      this.userId
    ,{
      read: true,
    });
    if (response && !response.error) {
      this.notifications = [];
      this.notificationCount = 0;
    }
    else{
      this.notifications = notificationData;
    }
 
  }
  returnTime(dt:any){
    let date=moment(dt).format('MMM DD, YYYY h:mm:ss a');
    return date;
   }

  checkPatientSubPage(){
  if (this.router.url.search('/referrals/patient') !== -1) {
  this.breadcrumbData.push({"name":"Referrals",url:this.router.url,redirect:true}); 
  }
  if(this.router.url.search('/referrals/patient/') !== -1) {
   let splitVal = this.router.url.split("/referral/patient/");
   if(splitVal.length > 1){
    let subSplit = splitVal[1].split("/");
    if(subSplit.length > 1){
      let refId = subSplit[1].split("?")[0];
      this.breadcrumbData.push({"name":refId,url:this.router.url,redirect:false});
    }
   }
  }
 }
  checkCurrentUrl() {
    if(this.router.url){
      let url = this.router.url.split("/");
      this.subHeading = url[1];
      this.subHeading  = this.subHeading.split("?")[0]; 
    }
    this.breadcrumbData = [];
    /*
    if (this.router.url.search('/patients') !== -1) {
      this.currentUrl = '/patients';
      this.breadcrumbData.push({"name":"Patients",url:"/patients",redirect:true});     
      //this.checkPatientSubPage();
    } else if (this.router.url.search('/dashboard') !== -1) {
      this.currentUrl = '/dashboard';
      this.breadcrumbData.push({"name":"Dashboard",url:"/dashboard",redirect:true});   
    } else if (this.router.url.search('/referral') !== -1) {
      this.currentUrl = '/referrals';
      this.breadcrumbData.push({"name":"Referral",url:"/referrals",redirect:true});   
    }
    else if(this.router.url.search('/settings') !== -1){
      this.currentUrl = '/settings';
       this.breadcrumbData.push({"name":"Settings",url:"/settings",redirect:true}); 
    }
    */

  }

  // redirectToPage(data:any){
  //  if(data.redirect == true){
  //    this.router.navigate([`${data.url}`]);
  //  }
  
  // }

  ngOnDestroy(): void {
    this.notUpdateListener.unsubscribe();
    this.onNotification.unsubscribe();
    this.onConnection.unsubscribe();
    this.isSocketConnected.unsubscribe();
    this.onFrame.unsubscribe();
    this.bCrumb.unsubscribe();
    this.unAuthorised.unsubscribe();
  }

  logoutUser() {
    this.userService.logOutUser(false,true);
  }
 
  redirectNotification(url: any) {
    url = url.replace(environment.appUrl, '');
    // this.router.navigate([`${url}`]);
    if(url){
      if(this.router.url.search("tab=messages") !== -1 && url.search("tab=messages") !== -1 && url.search("chatFor") !== -1){
        this.messageService.inMessage.next(url.split("chatFor=")[1]);
       }else{
        let query = this.utilsService.sortParams(url);
        this.router.navigate([`${url.split('?')[0]}`], { queryParams: query});
        // this.router.navigateByUrl(`${url}`);
       }
    }
     
  }

  async redirectTo(url: any) {
    if(url){
      if(url === 'assessments'){
        let id:any = await this.localstoreService.getRec('_id');
        this.router.navigate([`/patients/${id}/assessments`]);
      }else{
       
        this.router.navigate([`${url}`]);
      }
    }
    
    
  }
  async notificationRead(notification: any) {
    let role: any = await this.localstoreService.getRec('role');
    this.role = role.role;
    let response = await this.notificationService.update(notification._id, {
      read: true,
    },this.role);
    if (response && !response.error) {
      let index = this.notifications.findIndex(
        (x: any) => x._id == notification._id
      );
      if (index !== -1) {
        this.notifications.splice(index, 1);
        this.notificationCount = this.notificationCount - 1;
      }
    }
  }



  open(content:any) {
      this.emailNotFound = false;
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
     // this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      //this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  checkValue(){
    this.emailNotFound = false;
  }

  async save(modal:any){

    const controls = this.linkingForm.controls;
    if (this.linkingForm.invalid) {
      Object.keys(controls).forEach((controlName) =>
        controls[controlName].markAsTouched()
      );
      return;
    }

    this.linkingEmail=controls['email'].value;
     
    
   let facility:any=await this.localstoreService.getRec('organization');

   let curEmail:any = await this.localstoreService.getRec('email');
   let refEmail:any = this.linkingEmail 
   let object:any={curEmail,refEmail,facility}

modal.close();
this.msgService.show("",this.msgService.msgObject.accountLinked,'success','4000');

  let dataSet:any = {};
  dataSet['linkData'] = object;
  dataSet['setting'] = {};

this.settingsService.enableReferral(dataSet).subscribe((response) => {
      if (response) {
        if (response.status == true && !response.error) {
            let linkObj={'uuidLinked':true,'uuid': response.linkId,uuidEnable:true};
            this.isAccountLinked = true;
            this.localstoreService.mergeRecord(linkObj);
        }
        else{
          this.isAccountLinked = false;
          this.msgService.show("",response.msg,'danger','3000');
          this.emailNotFound = true;
        }
      }
      else{
        this.isAccountLinked = false;
        this.emailNotFound = true;
      }

   
      
    });


  }





}
