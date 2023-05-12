import { Component, OnInit } from '@angular/core';
import { LocalstoreService } from '../../shared/service/localstore/localstore.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {
  id: any;
  list : any;
  constructor(private localstoreService: LocalstoreService) { }

  ngOnInit(): void {
    this.id = '123456';
    let role :any = this.localstoreService.getRec('role');
    if(role.role === 'Chw'){
      this.list = {
        user1:{'name':'test@gmail.com','email':'test@gmail.com','receiver':['62f36003f7ebfc24f8b67a0a']},
        user2:{'name':'William Smith','email':'test@vigyanix.com','receiver':['62f36003f7ebfc24f8b67a01']},
        group :{'name':'Group','receiver':['62f36003f7ebfc24f8b67a01','62f36003f7ebfc24f8b67a0a']}
      };
    }else{
      this.list = {
        user1:{'name':'John Doe','email':'abkumar-c@vigyanix.com','receiver':['624bdedd4edede6d6ba8f48a']},
        user2:{'name':'William Smith','email':'test@vigyanix.com','receiver':['62f36003f7ebfc24f8b67a01']},
        group :{'name':'Group','receiver':['62f36003f7ebfc24f8b67a01','62f36003f7ebfc24f8b67a0a']}
      };
    }
   
  }

}
