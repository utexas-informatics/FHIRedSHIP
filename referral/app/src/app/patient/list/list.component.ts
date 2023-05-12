import { Component, OnInit } from '@angular/core';
import { PatientService } from "./../patient.service";
import { Router, ActivatedRoute } from "@angular/router";
declare var $: any;
@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {
  patientArr: any;
  constructor(private patientService: PatientService,
    private router: Router,
    private route: ActivatedRoute
    ) {
    this.patientArr = [];
   }
 
  ngOnInit(): void {
    $('.site-loading').css('display','block');
    $('body').addClass('body-loading');
    this.get();
  }

  goToAssesment(resp:any){
    this.router.navigate([`patient/${resp.sid}/assesments`]);
  }

  redirectTo(resp:any,page:any){
    if(page === "Assessment"){
      this.router.navigate([`patient/${resp.sid}/assesments`]);
    }else{
      this.router.navigate([`/referral/patient/${resp._id}`]);
    }
    
  }

  get(){
    this.patientService.get().subscribe((response) => {
      if (response) {
        if (!response.error) {
          this.patientArr = response;
        }
      } 
      $('.site-loading').css('display','none');
      $('body').removeClass('body-loading');
    });
  }

  

}
