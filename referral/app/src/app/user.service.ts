import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { apiBaseUrl, apiUrlConfig } from './constants';
import { User, VerifyUser } from './user';
import { catchError,tap,map } from 'rxjs/operators';
import { Router,ActivatedRoute } from '@angular/router';
import { LocalStore } from './shared/service/localstore/localstore.service';

/*import { CommonService } from './common.service';
import { MsgService } from './services/msg/msg.service';*/

// import { MesageService } from "./shared/service/message/mesage.service";
// import { CommonService } from "./shared/service/common/common.service";


declare var $: any;

@Injectable({
  providedIn: 'root',
})

export class UserService {
  responseData: any;
  public activeUser = {};
  constructor(
    private http: HttpClient,
    private router: Router,
    private localStore: LocalStore,
    // private commonService: CommonService,
    // private mesageService:MesageService,
    private route: ActivatedRoute

  ) {

  }



  login(loginInfo: string,type:string): Observable<any> {
    this.responseData = this.http
      .post<User>(
        `${apiUrlConfig.users}/login?type=${type}`,
        {},
        {
          headers: { Authorization: `basic ${loginInfo}`, skip: 'true' },
        }
      );

    return this.responseData;
   
  }

  getUserDetail(token: string): Observable<any> {
    this.responseData = this.http
      .get<User>(
        `${apiUrlConfig.users}/getDetails`
      );

    return this.responseData;
   
  }

  getToken(loginInfo: string): Observable<any> {
    this.responseData = this.http
      .post<User>(
        `${apiUrlConfig.users}/getToken`,
        {},
        {
          headers: { Authorization: `basic ${loginInfo}`, skip: 'true' },
        }
      );

    return this.responseData;
   
  }
  
  isAuth(): Observable<any>{
    this.responseData = this.http
      .post<User>(
        `${apiUrlConfig.isAuthenticated}`,
        {},
        {}
      );
     
     try{
      return this.responseData;
     }
     catch(err){
 
     }
   
   return this.responseData;
  }

  async isAuthenticated(){
    this.isAuth()
        .subscribe((res:any) => {
        if(res && res.status == true){
          this.router.navigate(['dashboard']);
        }else{
          this.localStore.remove("ref-auth");
        }
      })

  }

  apiCall(): Observable<any> {
    return this.http.post(`${apiUrlConfig.isAuthenticated}`,{});
  }
  
}
