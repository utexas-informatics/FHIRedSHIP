import { Component, OnInit } from '@angular/core';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LocalstoreService } from '../../shared/service/localstore/localstore.service';
import { UserService } from '../../user.service';
import { Router, ActivatedRoute } from "@angular/router";

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent implements OnInit {
 receiverId:any='';
 showNotifications:boolean=false;
 defnotificationrecords:string='no';
 showviewallnotificationoption:boolean=false;
  constructor(private localstoreService: LocalstoreService, private userService: UserService,private router: Router,
    private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.userService.bcrumb.next([{name:'Dashboard',last:false,url:"/dashboard"},{name:'Notifications',last:true,url:""}]);
  	this.getReceiver();
  }

  async getReceiver(){
  	this.receiverId =  await this.localstoreService.getRec('_id');	
	this.showNotifications=true;
  }
}
