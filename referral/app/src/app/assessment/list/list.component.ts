import { Component, OnInit } from '@angular/core';
import { AssessmentService } from './../assessment.service';
import { PatientService } from './../../patient/patient.service';
import { Router, ActivatedRoute } from '@angular/router';
import { LocalStore } from '../../shared/service/localstore/localstore.service';
import { MsgService } from '../../services/msg/msg.service';
import { environment } from "../../../environments/environment";

declare var $: any;
@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
})
export class ListComponent implements OnInit {
  assessments: any;
  shareTitle: any;
  dropdownList: any;
  selectedItems: any;
  dropdownSettings = {};
  selectedAssessment: any;
  searchText: any;
  typingTimer: any;               //timer identifier
  doneTypingInterval: any = 2000;
  isDisable:any=false;
  patientValue:any="";
  patientUrl:any=environment.apiBaseUrl+"/user/patient/search";
  constructor(
    private assessmentService: AssessmentService,
    private router: Router,
    private route: ActivatedRoute,
    private patientService: PatientService,
    private localStore: LocalStore,
    private msgService:MsgService
  ) {
    this.assessments = [];
    this.shareTitle = '';
    this.searchText = '';
  }

  ngOnInit(): void {
    $('.site-loading').css('display','block');
    $('body').addClass('body-loading');
    this.dropdownList = [];
    this.selectedItems = [];
    this.dropdownSettings = {
      singleSelection: false,
      text: 'Select Patients',
      enableSearchFilter: true,
      enableCheckAll: false,
      classes: 'myclass custom-class',
    };
    this.get();
  }

  onSearch(evt: any) {
 
    this.searchText = evt.target.value;
    clearTimeout(this.typingTimer);
    this.typingTimer = setTimeout(this.doneTyping, this.doneTypingInterval);
  }
 
  doneTyping = () => {
    this.dropdownList = [];
    this.patientService.search(this.searchText).subscribe((response) => {
      if (response) {
        if (!response.error) {
          this.dropdownList = [];
          //  this.dropdownList = response;
          if (response.length != 0) {
            for (let i = 0; i < response.length; i++) {
              // let item = {
              //   id: response[i].sid ? response[i].sid : '',
              //   itemName: response[i].email,
              // };
              let item = {
                id: response[i]._id ? response[i]._id : '',
                itemName: response[i].email,
                sid: response[i].sid ? response[i].sid : ''
              };
              this.dropdownList.push(item);
            }
          }
        }
      }
    });
  }

  onItemSelect(item: any) {

  }

  onClose(item: any) {
    this.searchText = '';
  }

  onOpen(item: any) {
    this.searchText = '';
  }

  OnItemDeSelect(item: any) {

  }
  onSelectAll(items: any) {

  }
  onDeSelectAll(items: any) {
   // console.log(items);
  }

  get() {
    this.assessmentService.get().subscribe((response) => {
      if (response) {
        if (!response.error) {
          this.assessments = response;
        }
      }
      $('.site-loading').css('display','none');
      $('body').removeClass('body-loading');
    });
  }
 
  receivePatient(event:any){
    this.selectedItems = [];
    if(event.sid){
      let item = {
        id: event._id ? event._id : '',
        itemName: event.email,
        sid: event.sid ? event.sid : ''
      };
      this.selectedItems.push(item);
    }
   
    }

  share() {
    let data: any = {};
    data['sharedByUuid'] = this.localStore.getField('ref-auth','uuid');
    data['sharedBy'] = this.localStore.getField('ref-auth','_id');
    data['sharedTo'] = this.selectedItems;
    data['templateId'] = this.selectedAssessment._id;
    data['templateName'] = this.selectedAssessment.name;

    this.assessmentService.share(data).subscribe((response) => {
      if (response) {
        if (!response.error) {
          this.msgService.show("",this.msgService.msgObject.tempShared,'success','4000');
      
          this.selectedItems = [];
          this.patientValue = '';
        }
      }
    });
  } 

  setShareModal(item: any) {
    this.assessmentService.clearData.next('yes');
    this.patientValue = '';
    this.selectedAssessment = item;
    this.shareTitle = item.name;
    this.dropdownList = [];
    this.selectedItems = [];
    this.searchText = '';

    // let data: any = {};
    // data['sharedBy'] = '1234';
    // data['templateId'] = this.selectedAssessment._id;

    // this.assessmentService.getSharedData(data).subscribe((response) => {
    //   if (response) {
    //     if (!response.error) {
    //       console.log('response');
    //       this.selectedItems = response.sharedTo;
    //     }
    //   }
    // });
  }
}
