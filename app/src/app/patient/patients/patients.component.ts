import { Component, OnInit } from '@angular/core';
import { PatientService } from './../patient.service';
import { LocalstoreService } from '../../shared/service/localstore/localstore.service';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService } from '../../user.service';

@Component({
  selector: 'app-patients',
  templateUrl: './patients.component.html',
  styleUrls: ['./patients.component.scss'],
})
export class PatientsComponent implements OnInit {
  patients: any;
  showLoading: boolean = false;
  totalCount:number=0;
  pageLimit: number = 10;
  page:number=1;
  show_access_message=false;
  constructor(
    private localstoreService: LocalstoreService,
    private patientService: PatientService,
    private router: Router,
    private route: ActivatedRoute,
    private userService: UserService
  ) {
    this.patients = [];
  }

  ngOnInit(): void {
    this.patients = [];
    this.userService.bcrumb.next([{name:'Patients',last:true,url:""}]);
    this.get();
  }

   onPageChange(pageNumber:any) {
    this.page = pageNumber;
    this.get();
    }

  async get() {
    this.showLoading = true;
    let facility: any = await this.localstoreService.getRec('facility');
    let organization: any = await this.localstoreService.getRec('organization');
    let queryParams = `page=${this.page}&limit=${this.pageLimit}`;
    this.patientService.get(organization,queryParams).subscribe((response) => {
      if (response) {
        if (!response.error) {
          if (
            response.status &&
            response.status == true &&
            response.data &&
            response.data.length > 0
          ) {
            this.patients = response.data;
            this.totalCount = response.count;
          }
        }
        else{
          this.show_access_message = true;
        }
      }
      this.showLoading = false;
    });
  }

  redirectTo(resp: any, page: any) {
    if (page === 'Assessment') {
      this.router.navigate([`patients/${resp._id}/assessments`]);
    } else {
      this.router.navigate([`/referrals/patient/${resp._id}`]);
    }
  }
}
