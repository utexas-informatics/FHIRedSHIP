import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { PatientService } from "./../patient.service";
declare var $: any;
@Component({
  selector: 'app-patassesments',
  templateUrl: './patassesments.component.html',
  styleUrls: ['./patassesments.component.scss']
})
export class PatassesmentsComponent implements OnInit {
questionnaireresponses:any=[];
id:string='';
  constructor(private router: Router,
    private route: ActivatedRoute,
    private patientService: PatientService) { }

  ngOnInit(): void {
    
  	this.route.params.subscribe((params:any) => {
      if (params.id != undefined && params.id != null && params.id != "") {
        $('.site-loading').css('display','block');
        $('body').addClass('body-loading');
        this.id=params.id;
        this.get();
     }
    });
  }

 get() {
    this.patientService.getAssesmentResponses(this.id).subscribe((response) => {
      if (response) {
        if (!response.error) {
          this.questionnaireresponses = response;
        }
      }
      $('.site-loading').css('display','none');
      $('body').removeClass('body-loading');
    });
  }

  goTOAssesment(resp:any){
   this.router.navigate([`patient/${resp.sid}/response/${resp._id}`]);
  }
}
