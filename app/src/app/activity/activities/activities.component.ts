import { Component, OnInit } from '@angular/core';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LocalstoreService } from '../../shared/service/localstore/localstore.service';
import { UserService } from '../../user.service';
import { Router, ActivatedRoute } from "@angular/router";


@Component({
  selector: 'app-activities',
  templateUrl: './activities.component.html',
  styleUrls: ['./activities.component.scss']
})
export class ActivitiesComponent implements OnInit {
  showViewAllOption:boolean=false;
  linkedUser:any='';
  showActivity:boolean=false;
  constructor(private localstoreService: LocalstoreService, private userService: UserService,private router: Router,
    private route: ActivatedRoute) { }

  ngOnInit(): void {
  	this.getLinkedUser();
    this.userService.bcrumb.next([{name:'Dashboard',last:false,url:"/dashboard"},{name:'Activities',last:true,url:""}]);
  	
  }
	async getLinkedUser(){
	this.linkedUser =  await this.localstoreService.getRec('_id');	
	this.showActivity=true;
	}

}
