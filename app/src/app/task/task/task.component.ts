import { Component, OnInit } from '@angular/core';
import { UserService } from '../../user.service';

@Component({
  selector: 'app-tasks',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.scss']
})
export class TaskComponent implements OnInit {
  showTasks:boolean=false;
  deftaskrecords:string='no';
  showviewallTask:boolean=false;
  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.userService.bcrumb.next([{name:'Dashboard',last:false,url:"/dashboard"},{name:'Tasks',last:true,url:""}]);
    this.showTasks=true;
  }

}
 