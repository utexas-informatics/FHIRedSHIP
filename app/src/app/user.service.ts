import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { apiBaseUrl, apiUrlConfig } from './constants';
import { User, VerifyUser } from './user';
import { catchError } from 'rxjs/operators';
import { Router,ActivatedRoute } from '@angular/router';
/*
import { MsgService } from './services/msg/msg.service';*/
import { MsgService } from './services/msg/msg.service';
import { LocalstoreService } from "./shared/service/localstore/localstore.service";
import { NotificationService } from './services/notification/notification.service';


declare var $: any;

@Injectable({
  providedIn: 'root',
})
 
export class UserService {
  public inIframe: BehaviorSubject<any> = new BehaviorSubject(false);
  inIframeListener: Observable<any>;
 
  public bcrumb: BehaviorSubject<any> = new BehaviorSubject(false);
  bcrumbListener: Observable<any>;

  responseData: any;
  public activeUser = {};
  constructor(
    private http: HttpClient,
    private router: Router,
    private localstoreService: LocalstoreService,
    private messageService:MsgService,
    private route: ActivatedRoute,
    private notificationService: NotificationService

  ) {
    this.inIframeListener = this.inIframe.asObservable();
    this.bcrumbListener = this.bcrumb.asObservable();
  }

  updateExtConfig(payload: object): Observable<boolean> {
    return this.http.post<boolean>(
      `${apiUrlConfig.saveExtConfig}`,
      { ...payload },
     {
      headers: { skip: 'false' },
    }
    );
  }
 
  
  searchUser(text:any,role:any,moduleId:any,str:any): Observable<any> {
    this.responseData = this.http.get<any>(
      apiUrlConfig.users + `/search?text=${text}&role=${role}&moduleId=${moduleId}&str=${str}`
    );
    return this.responseData;
  }

 getExtConfig(): Observable<boolean> {
    let skip:any = 'false';
     return this.http.get<any>(
      `${apiUrlConfig.getExtConfg}`,
      {
      headers: { skip: 'false' },
    }
    );
  }

  

    linkAccount(object: any): Observable<any> {
    this.responseData = this.http
      .post<User>(
        `${apiUrlConfig.users}/link`,
        object
      );
    return this.responseData;
   
  }

  login(loginInfo: string): Observable<any> {
    this.responseData = this.http
      .post<User>(
        `${apiUrlConfig.users}/login`,
        {},
        {
          headers: { Authorization: `basic ${loginInfo}`, skip: 'true' },
        }
      );

    return this.responseData;
   
  }

  reset(info: string): Observable<any> {
    this.responseData = this.http
      .post<User>(
        `${apiUrlConfig.users}/reset`,
        {},
        {
          headers: { Authorization: `basic ${info}`, skip: 'true' },
        }
      );

    return this.responseData;
   
  }

    activateSignup(
    userId: string,
    requestPayload: object,
    skip = 'false'
  ): Observable<User> {
    return this.http.put<User>(
      `${apiUrlConfig.users}/activateSignup/${userId}`,
      {
        ...requestPayload,
      },
      { headers: skip === 'true' ? { skip } : {} }
    );
  }

    getUserByEVC(code: string): Observable<User> {
    return this.http.get<User>(`${apiUrlConfig.getUserByEVC}/${code}`, {
      headers: { skip: 'true' },
    });
  }

 
  logout(isMessageRender:any){
    try{
        let skip = 'false';
   // let id =this.localstoreService.getRec('_id');

    let user =this.localstoreService.getRec('email');
    let _id = this.localstoreService.getRec('_id');
    let userId = this.localstoreService.getRec('_id');
    let role: any = this.localstoreService.getRec('role');
    role = role.role;
     let usertype:any =  this.localstoreService.getRec('type');
    if(role === 'Cbo'){
          let subs:any = this.localstoreService.getRec("subs");
          _id = subs ? atob(subs.sub):'';
        }
        if (_id && role !== 'Patient') {
          if(isMessageRender == true){
             this.notificationService.sendMessage('leave', _id, userId);
          }
         
        }

       this.http.post<any>(`${apiUrlConfig.logout}?email=${user}`, {}).pipe(
      )
      .subscribe((resp) => {
        if(isMessageRender == true){
        this.messageService.show('',this.messageService.msgObject.userLogout,'success','4000');
      }
         });
    }catch(e){

    }
  
  }

  removeRecod(){
      localStorage.removeItem('localAuthCred');
    } 
 
  logoutBeforeLogin(){
    //this.logout();
    this.removeRecod();
    }

    logOutUser(ignoreNavigate:any,isMessageRender:any){
      let _id = this.localstoreService.getRec('_id');
      if(_id){
        this.notificationService.sendMessage('leave',_id,_id);
      }
    this.logout(isMessageRender); 

    setTimeout(()=>{
      this.removeRecod();
    },500);
    
    if(ignoreNavigate != true){
    
    setTimeout(()=>{
      $(".btn-close").click();
      this.router.navigate(['/']);
    },500);
     } 
    }

  getRefToken(): Observable<any> {
    this.responseData = this.http.get<any>(
      `${apiBaseUrl}/user/getRefToken`
    );
    return this.responseData;
  }

    getPatientAccessToken(refreshToken: any, email: any) {
    
        const url = `${apiBaseUrl}/user/getExchangeToken`;
        return this.http.post(
          url,
          { email: email },
          {
            headers: {
              'token-type': 'magicLinkToken',
              Authorization: 'bearer ' + refreshToken,
              isExchangeToken: 'true',
              skip:'true'
            },
    
          }
        );
     
     
    }

  checkLogin(){
   let loginScreen=false;
   if(this.router.routerState.snapshot.url.split(';')[0] =='/login'){
     loginScreen=true;
   }
   
    let emailId:any=this.localstoreService.getRec('email');
    if(emailId && emailId!=null && emailId!=''){
        let skip = 'false';
    let password = '';

     this.http
      .get<User>(`${apiUrlConfig.getUserByEmailId}/${emailId}?extconfig=true`, {
        headers: skip === 'true' ? { skip } : {},
      })
      .pipe(
        catchError((err) => {
          if (
            err.error.status === 500 &&
            err.error.message.includes('User not found')
          ) {
            if(loginScreen!=true){
            this.messageService.show('userNotExist','','danger','4000');
           this.router.navigate(['/login']);
            }
          } else if (
            err.error.status === 500 &&
            err.error.message.includes('User not invited')
          ) {
            if(loginScreen!=true){
            //alert('Invalid Invite code. Please contact Study Recruiter for further help');
            this.messageService.show('invalidInviteCode','','danger','4000');
            //this.router.navigate(['invite/inviteCodeAdd']);
            }
            
          } else if (
            err.error.status === 500 &&
            err.error.message.includes('User not verified')
          ) {
             if(loginScreen!=true){
             //alert('Your account is not activated yet. Please provide an invite code or contact study coordinator for further help');
            this.messageService.show('acNotActivated','','danger','4000');
            this.router.navigate(['/login']);
            }
            //this.router.navigate(['/login']);
          } else if (
            err.error.status === 500 &&
            err.error.message.includes('User not accepted consent')
          ) {
             if(loginScreen!=true){
           // alert('Invalid Invite code. Please contact Study Recruiter for further help.');
            this.messageService.show('invalidInviteCode','','danger','4000');
          }
           //this.router.navigate(['invite/inviteCodeAdd']);
          }
          return throwError(err);
        })
      ) 
      .subscribe((apiUser) => {
        if (
          ['PendingApproval', 'Locked', 'Inactive'].includes(apiUser.status)
        ) {
          if(loginScreen!=true){
          let message=`Your account is in ${
              apiUser.status == 'PendingApproval' ? 'Pending' : apiUser.status
            } state. Please reach out to Study Coordinator for further help.`;
          this.messageService.show('',message,'danger','4000');
        }
        } else {
        if(loginScreen==true){
          this.router.navigate(['recruitments']);
        }
        }
      });
    }else{
      if(loginScreen !== true){
        this.router.navigate(['/login',{previousUrl:this.router.routerState.snapshot.url}]);
        
      }
      
    }
  
  }

  async getHeaderValues(){
    let token = await this.localstoreService.getRec('access_token');
    let s_state = await this.localstoreService.getRec('session_state');
    let user = await this.localstoreService.getRec('_id');

    let userRole = 'Chw';
    let pid='';
    let src="web";
    let headerObj:any={
      'Content-Type': 'application/json; charset=utf-8',
      Accept: 'application/json',
      userRole: userRole,
      userid:user?user:'',
      patientId:pid?pid:'',
      source: 'fsApp',
      platform: src,
      Authorization: token?`bearer ${token}`:'',
      session_state:s_state?s_state:''
    };

    return headerObj;
  }




   fetchUserByEmailId(emailId:any, skip = 'true', password = '',redirectTo:any,platform:any): void {
   // let headerVal:any=this.getHeaderValues();
   // headerVal['email']=emailId;
 //.post<User>(`${apiUrlConfig.getUserByEmailId}/${emailId}?role=admin`, {},{
    this.http
      .post<User>(`${apiUrlConfig.getUserByEmailId}`, {},{
        /*headers: skip === 'true' ? { skip } : {},*/
        headers: { email: `${emailId}` },
        /*headers: headerVal,*/
      })
      .pipe(
        catchError((err) => {
          if (
            err.error.status === 500 &&
            err.error.message.includes('User not found')
          ) {
            this.messageService.show('userNotExist','','danger','4000');
          } else if (
            err.error.status === 500 &&
            err.error.message.includes('User not invited')
          ) {
            this.messageService.show('invalidInviteCode','','danger','4000');
            this.router.navigate(['invite/inviteCodeAdd']);
          } else if (
            err.error.status === 500 &&
            err.error.message.includes('User dont have access')
          ) {
            this.messageService.show('noAccess','','danger','4000');
          } else if (
            err.error.status === 500 &&
            err.error.message.includes('User not verified')
          ) {
            this.messageService.show('acNotActivated','','danger','4000');
            this.router.navigate(['invite/inviteCodeAdd']);
          } else if (
            err.error.status === 500 &&
            err.error.message.includes('User not accepted consent')
          ) {
            this.messageService.show('invalidInviteCode','','danger','4000');
             
           // this.router.navigate(['recruitments']);
         
          }
          return throwError(err);
        })
      )
      .subscribe((apiUser) => {
        if (
          ['PendingApproval', 'Locked', 'Inactive'].includes(apiUser.status)
        ) {
          let message=`Your account is in ${
              apiUser.status == 'PendingApproval' ? 'Pending' : apiUser.status
            } state. Please reach out to Study Coordinator for further help.`;
          this.messageService.show('','message','danger','4000');
         
        } else {
          this.localstoreService.mergeRecord(apiUser);
          if(apiUser._id){
            this.notificationService.sendMessage('join',apiUser._id,'');
            this.notificationService.sendMessage('loggedInUser', '',apiUser._id);
          }

          if(redirectTo){
            if(redirectTo !== 'callback'){
              if(redirectTo && platform != ""){
                if(redirectTo.indexOf("?") == -1){
                  redirectTo = redirectTo+"?deviceType="+platform;
                }
                else{
                redirectTo = redirectTo+"&deviceType="+platform;
                }
              }
              this.router.navigateByUrl(`${redirectTo}`);
            }
            
          }else{
            if(apiUser && apiUser.role && apiUser.role.role == "Patient"){
             
              if(platform != ''){
               this.router.navigate(['referrals'],{ queryParams: { deviceType: platform}});
              }
              else{
               this.router.navigate(['referrals']);
              }

             
            }
            else{

                if(platform != ''){
               this.router.navigate(['dashboard'],{ queryParams: { deviceType: platform}});
              }
              else{
               this.router.navigate(['dashboard']);
              }

            }
            
          }
          //this.router.navigate(['user']);
      
      
        }
      });
  }

   isAuth(): Observable<any>{
    this.responseData = this.http
      .post<User>(
        `${apiUrlConfig.isAuthenticated}`,
        {},
        {}
      );

    return this.responseData;
   
  }

  async isAuthenticated(){
    this.isAuth()
        .subscribe((res:any) => {
        if(res && res.status == true){
          this.router.navigate(['dashboard']);
        }
      })

  }

  authenticate(): Observable<any> {
    return this.http.post(`${apiUrlConfig.isAuthenticated}`,{});
  }

  getActivity(): Observable<any>{
     return this.http.get(`${apiUrlConfig.activity}`,{});
  }

/*   linkAccount(object: any): Observable<any> {
    this.responseData = this.http
      .post<User>(
        `${apiUrlConfig.isAuthenticated}/link`,
        object
      );
    return this.responseData;
   
  }*/
  
}
