import { Component, OnInit } from '@angular/core';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LocalstoreService } from '../../shared/service/localstore/localstore.service';
import { UserService } from '../../user.service';
import { SettingsService } from '../../services/settings/settings.service';
import { NotificationService } from '../../services/notification/notification.service';
import { Router, ActivatedRoute } from "@angular/router";
import { MsgService } from '../../services/msg/msg.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
}) 
export class DashboardComponent implements OnInit {
linkingEmail='';
linkingForm: FormGroup;
activities:any=[];
role: any;
showLoading: boolean = true;
emailNotFound: boolean=false;
showViewAllOption:boolean=true;
showActivity:boolean=false;
linkedUser:any='';
receiverId:any='';
showNotifications:boolean=false;
showTasks:boolean=false;
defnotificationrecords:string='yes';
deftaskrecords:string='yes';
showviewallTask:boolean=true;
show_access_message:boolean=false;
showviewallnotificationoption:boolean=true;
  constructor(private settingsService:SettingsService,private modalService: NgbModal,private fb: FormBuilder,private localstoreService: LocalstoreService, private userService: UserService,private notificationService: NotificationService,private router: Router,
    private route: ActivatedRoute,private msgService:MsgService) {
   this.linkingForm = this.fb.group({
      email: [ 
        '',
        Validators.compose([Validators.required, Validators.email]),
      ],
    });

   }
 
  async ngOnInit(): Promise<void> {
    this.linkedUser =  await this.localstoreService.getRec('_id');
    this.receiverId = this.linkedUser;
    this.showActivity=true;
    this.showNotifications=true;
    this.showTasks = true;
    let role:any = await this.localstoreService.getRec('role');
    this.role = role.role;
    if(this.role == 'Patient' || this.role == 'patient'){
    this.show_access_message = true;
    }
    this.userService.bcrumb.next([{name:'Dashboard',last:true,url:""}]);
    this.getActivity();
   // this.checkAndOpenModal();
  }


  async redirectTo(page:any){
    let id:any = await this.localstoreService.getRec('_id');
    if(page === "Assessment"){
      this.router.navigate([`patients/${id}/assessments`]);
    }else{
      this.router.navigate([`/referrals/patient/${id}`]);
    }
    
  }
 
//    openModal(){
//   let eleId='linkingModal';
//    let ele:HTMLElement=document.getElementById(eleId) as HTMLElement;
//    ele.click();
//   }
// async save(modal:any){

//     const controls = this.linkingForm.controls;
//     if (this.linkingForm.invalid) {
//       Object.keys(controls).forEach((controlName) =>
//         controls[controlName].markAsTouched()
//       );
//       return;
//     }

//     this.linkingEmail=controls['email'].value;
     
    
//    let facility:any=await this.localstoreService.getRec('facility');

//    let curEmail:any = await this.localstoreService.getRec('email');
//    let refEmail:any = this.linkingEmail 
//    let object:any={curEmail,refEmail,facility}

// modal.close();
// this.msgService.show("",this.msgService.msgObject.accountLinked,'success','4000');

//   let dataSet:any = {};
//   dataSet['linkData'] = object;
//   dataSet['setting'] = {};

// this.settingsService.enableReferral(dataSet).subscribe((response) => {
//       if (response) {
//         if (response.status == true && !response.error) {
//             let linkObj={'uuidLinked':true,'uuid': response.linkId};
//             this.localstoreService.mergeRecord(linkObj);
//         }
//         else{
//           this.msgService.show("",response.msg,'danger','3000');
//           this.emailNotFound = true;
//         }
//       }
//       else{
//         this.emailNotFound = true;
//       }

   
      
//     });


//   }

  //   open(content:any) {
  //     this.emailNotFound = false;
  //   this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
  //    // this.closeResult = `Closed with: ${result}`;
  //   }, (reason) => {
  //     //this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
  //   });
  // }

  // checkValue(){
  //   this.emailNotFound = false;
  // }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  getActivity(){
   this.userService
        .getActivity()
        .subscribe((res) => {
        if(res ){
       this.activities=res;
 
          
        }else{
    
        }
        this.showLoading = false;
       })
  }

}
