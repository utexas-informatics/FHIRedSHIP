import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../user.service';
import { LocalstoreService } from '../../shared/service/localstore/localstore.service';
import { environment } from './../../../environments/environment';

@Component({
  selector: 'app-callback',
  templateUrl: './callback.component.html',
  styleUrls: ['./callback.component.scss']
}) 
export class CallbackComponent implements OnInit {
 
  appName: any;
  redirectUrl: any;
  iframeUrl: any;
  showLoading: boolean = true;
  platform:any='web';
  access_denied:any=false;
  constructor(private activatedRoute: ActivatedRoute,private router: Router,
    private userService: UserService, private localstoreService:LocalstoreService) { }
 
  ngOnInit(): void {
    this.iframeUrl = ''
    this.redirectUrl = '';
    this.appName = '';
    this.platform='web';
    this.userService.bcrumb.next([]);
   
    if (this.activatedRoute.snapshot.queryParamMap.has('email')) {
      this.userService.inIframe.next(true);
      if(this.activatedRoute.snapshot.queryParamMap.has('deviceType')){
        this.platform = this.activatedRoute.snapshot.queryParamMap.get('deviceType');
      }

      const patientId = this.activatedRoute.snapshot.paramMap.get('patientId');
      let patientRefreshToken = this.activatedRoute.snapshot.paramMap.get(
        'patientRefreshToken'
      );
      if(!patientRefreshToken){
        patientRefreshToken = '';
      }
      const email = this.activatedRoute.snapshot.queryParamMap.get('email');
      this.appName = this.activatedRoute.snapshot.queryParamMap.get('appName');
      this.redirectUrl = this.activatedRoute.snapshot.queryParamMap.get('redirectUrl');
      if(this.redirectUrl){
        this.redirectUrl =  atob(this.redirectUrl);
      }
      this.getPatientDetails(
        atob(patientRefreshToken),
        email
      ); 
    }else{
      this.showLoading = false;
      this.router.navigate(['']);
    }
  }

  getPatientDetails = async (
    patientRefreshToken: any,
    email: any
  ) => { 
      this.userService
      .getPatientAccessToken(patientRefreshToken, email)
      .subscribe(async (tokenResponse) => {
        if(tokenResponse){
          this.localstoreService.mergeRecord(tokenResponse);
          if(!this.appName){
            if(this.redirectUrl){
              this.redirectUrl = this.redirectUrl.replace(environment.appUrl,"");
            }
            
             this.userService.fetchUserByEmailId(
              email,
              'false',
              '',
              this.redirectUrl,
              this.platform
            );
          }else{
            this.userService.fetchUserByEmailId(
              email,
              'false',
              '',
              'callback',
              this.platform
            );
            
        this.userService.getRefToken().subscribe((response) => {
           if(response && response.status == true){
            this.iframeUrl = `${environment.refDomain}/callback/${response.token}?type=Patient&redirect=${this.redirectUrl}&email=${email}&deviceType=${this.platform}`;
            setTimeout(()=>{
              this.showLoading = false;
            },100);
        
            
              }
              else{
                 this.showLoading = false;
                 this.access_denied = true;

              }

         });
         
           
          }
         
    
        }else{
          this.showLoading = false;
          this.access_denied = true;
        }
       
      });
    
   
  };

}
