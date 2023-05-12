import { Component, OnInit } from '@angular/core';
import { LocalStore } from '../../service/localstore/localstore.service';
import { Router, ActivatedRoute } from '@angular/router';

declare var $: any;

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  currentUrl:any;
  role: any;
  inFrame: boolean = false;
  name: any;
  email: any;
  platform:any;
  constructor(private router:Router,private localStore: LocalStore,private route: ActivatedRoute) { }


 async ngOnInit(): Promise<void> {

     this.route.queryParams.subscribe(async (queryParams: any) => {
    if(queryParams && queryParams.deviceType){
      if(queryParams.deviceType == 'ios'){
        this.platform = queryParams.deviceType;
        $("body").addClass("fs-header-ios");
      }
     }

    });


    this.currentUrl = this.router.url;
    let userData: any = await this.localStore.get('ref-auth');
    if(userData){
    userData = JSON.parse(userData);
    
    this.role = userData.role;
    this.email = userData.email;
    this.name = userData.name;
  }
  }

  logout(){
    this.localStore.remove("ref-auth");
    this.router.navigate([""]);
  }

  redirectTo(page: any){
    this.router.navigate([`${page}`]);
  }

}
 