import { Component, OnInit, Input } from '@angular/core';
import { NotificationService } from '../../../services/notification/notification.service';
import { LocalstoreService } from '../../../shared/service/localstore/localstore.service';
import { MessageService } from '../../../services/message/message.service';
import { Router, ActivatedRoute } from "@angular/router";
import * as CryptoJS from 'crypto-js';
import * as moment from 'moment';
declare var $: any;

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss'],
})
export class MessageComponent implements OnInit {
  currentMessage: any;
  htmlToAdd: any;
  sender: any;
  receiver: any;
  onMessage: any;
  isSocketConnected:any;
  roomId: any;
  messages: any;
  currentUser: any;
  role:any;
  isLoaded:boolean = false;
  fullName:string = "";
  prevMessageDate:string = "";
  fetchRecord:any=20;
  currentPage:any=1;
  moreRecordExist:boolean=false;
  totalMessages:any=[];
  isScroll:any=false;
  chatFor:any;
  inMessage:any;
  onNotification:any;
  @Input() senderList: any;
  @Input() moduleId: any;
  @Input() moduleName: any;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private notificationService: NotificationService,
    private localstoreService: LocalstoreService,
    private messageService: MessageService
  ) {}
 
  async ngOnInit(): Promise<void> {
    this.resetValues();

    if(this.onNotification){
       this.onNotification.unsubscribe();
    }
    if(this.inMessage){
     this.inMessage.unsubscribe();
    }
    if(this.onMessage){
    this.onMessage.unsubscribe();
    }
    if(this.isSocketConnected){
      this.isSocketConnected.unsubscribe();
    }
    
    
    this.sender = this.localstoreService.getRec('_id');
    let role:any = await this.localstoreService.getRec('role');
    this.fullName = await this.currentLoggedInUser();
    this.role = role.role;
    if(this.role === 'Patient'){
      this.notificationService.sendMessage('join', this.sender, this.sender);
    }
    if(this.sender){
      await this.getNotificaionByRoom();
    };

  
  

    this.onNotification = this.notificationService
    .onNotification()
    .subscribe(async (data: any) => {
        if (data.meta && data.meta.roomId) {
          await this.getNotificaionByRoom();
        } 
     
    });


 
    this.inMessage = this.messageService.inMessage.subscribe((res) => {

      if(res){
        const index = this.senderList.findIndex((object:any) => {
          return object.user.chatFor === res;
      });
      this.selectChat(this.senderList[index].user,index);
      }
     
    });
    this.route.queryParams.subscribe(async (queryParams: any) => {
     if(queryParams && queryParams.chatFor){
      if(this.roomId && this.sender){
        this.notificationService.sendMessage('leave', this.roomId,this.sender);
      }
      this.chatFor = queryParams.chatFor;
        const index = this.senderList.findIndex((object:any) => {
           return object.user.chatFor === this.chatFor;
       });
        this.chatFor = this.senderList[index].user.chatFor;
       this.receiver = this.senderList[index].user.receiver;
       this.currentUser = this.senderList[index].user.name;

       this.selectChat(this.senderList[index].user,index);
     }
     else{
      if(this.roomId && this.sender){
        this.notificationService.sendMessage('leave', this.roomId,this.sender);
      }
    this.chatFor = this.senderList[0].user.chatFor;
    this.receiver = this.senderList[0].user.receiver;
    this.currentUser = this.senderList[0].user.name;
    //this.roomId = this.createRoomId(this.senderList[0].user.roomId);
    this.selectChat(this.senderList[0].user,0);
    //this.settabinfo(this.chatFor);
    }

    // await this.getMessages(this.roomId,true);
    // this.isLoaded = true;
    // setTimeout(()=>{
    //   this.scrollBottom();
    // },0);
  

    });


    this.isSocketConnected = this.notificationService
      .socketConnected()
      .subscribe((data: any) => {
      this.notificationService.sendMessage('leave', this.roomId,this.sender);
      this.notificationService.sendMessage('join', this.roomId,this.sender);
        
      });


    this.onMessage = this.notificationService
      .addMessage()
      .subscribe(async (data: any) => {

        // this.addNewMessage('receiver', data);
        if(data){
          let message = data.message;
          message = await this.decrypt(message);
          data.message = message;
          
          const base64RegExp = /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{4})$/;
          let senderInfoCheck = base64RegExp.test(data.sdi);
          if(senderInfoCheck == true){
            data.sdi = await atob(data.sdi);
          }

           let senderIdCheck = base64RegExp.test(data.sd);
          if(senderIdCheck == true){
            data.sd = await atob(data.sd);
          }

          data.sender = data.sd;
          data.time = this.returntime(data.createdAt);
          let currentDate = this.returnDate(data.createdAt);
          if(data.sd === this.sender){
            data.sdi = "You";
           }

          const index = this.returnIndex(this.totalMessages,"date",currentDate);
          if(index == -1){
          this.totalMessages.push({date:currentDate,messages:[data]});
          }
          else{
          this.totalMessages[index].messages.push(data);
          }       

          if(data.sd == this.sender){
           this.scrollBottom();
          }
          else{ 

           this.scrollCheck();
          }
        }
        
      });
      setTimeout(()=>{
        $('#message-scroll').unbind('scroll');
         $('#message-scroll').bind('scroll',() =>
                              {
                               this.isScroll = true;
                             
                                if($('#message-scroll').scrollTop() + $('#message-scroll').innerHeight()>=$('#message-scroll')[0].scrollHeight)
                                {
                                 this.isScroll = false;
                                }
                              })
      },200);
   


    this.notificationService.sendMessage('leave', this.roomId,this.sender);
    this.notificationService.sendMessage('join', this.roomId,this.sender);
    $('.site-loading').css('display', 'none');
    $('body').removeClass('body-loading');
  
  }


 

  async fetchMoreRecords(){
    this.currentPage = this.currentPage + 1;
    this.getMessages(this.roomId,false);
  }



  async currentLoggedInUser(){
    let fname  = this.localstoreService.getRec('firstName');
    let fullName = fname;
    if(fname && fname != "" && fname != undefined){
     let lname  = this.localstoreService.getRec('lastName');
     if(lname && lname != "" && lname != undefined){
      fullName = fname+" "+lname;
     }

    }
    else{
      fullName  = this.localstoreService.getRec('email');
    }
   return fullName;

}

  resetValues(){
    this.htmlToAdd = ``;
    this.receiver = [];
    this.currentMessage = '';
    this.messages = [];
    this.totalMessages = [];
    this.currentUser = '';
    this.prevMessageDate = '';
  }


  async getNotificaionByRoom(){
    
    for(var a=0; a < this.senderList.length; a++){
      this.senderList[a].user.count = 0;
      this.senderList[a].user.notId = "";
      let user = this.senderList[a].user;
      // let roomId =  this.createRoomId(user.roomId);
       let roomId =  user.roomId;
      let response = await this.notificationService.getNotificationByroomId(
        roomId,this.sender
      );
      if (response && !response.error) {
        let data = response.data;
        this.senderList[a].user.notId = data && data._id ? data._id:'';
        this.senderList[a].user.count = data && data.meta && data.meta.count ? data.meta.count: 0;
       
      }
      }
  }

  async selectChat(userData:any,index:any){
    if(this.senderList[index].user && this.senderList[index].user.count  && this.senderList[index].user.count !== 0){
     if(this.senderList[index].user.notId){
      this.notificationService.notUpdate.next(this.senderList[index].user.notId);
      this.senderList[index].user.count  = 0;
      this.senderList[index].user.notId = "";
     }
    }
    this.notificationService.sendMessage('leave', this.roomId,this.sender);
    this.resetValues();
    if(userData.chatFor != this.chatFor){
    //this.settabinfo(userData.chatFor);
    this.chatFor = userData.chatFor;
    }

    this.currentPage = 1;
    this.currentUser = userData.name;
    this.receiver = userData.receiver;
    //this.roomId = this.createRoomId(userData.roomId);
    this.roomId = userData.roomId;
    this.isScroll = false;
    this.notificationService.sendMessage('join', this.roomId,this.sender);
    await this.getMessages(this.roomId,true);
    this.isLoaded = true;
    setTimeout(()=>{
      this.scrollBottom();
    },0);
  }

  returnFirstChar(text: string) {
    let char = text.charAt(0);
    return char;
  }
  
  returntime(createdAt:any){
  let date = new Date(createdAt);
  let time = moment(date).format("LT");
  return time;
  }

  returnDate(createdAt:any){
   let date = new Date(createdAt);
   let groupDate = moment(date).format('ll');
   return groupDate;
  }

  scrollBottom(){
  let elm:any = document.getElementById("message-scroll");
  setTimeout(() => {
  if(elm && elm.scrollHeight && elm.scrollHeight != undefined && elm.scrollHeight != null){
   elm.scrollTop = elm.scrollHeight+50;
    }
    }, 0);
  }

  scrollTop(){
  let elm:any = document.getElementById("message-scroll");
  let totalElmScroll = elm.scrollHeight;
  setTimeout(() => {
  if(elm && elm.scrollHeight && elm.scrollHeight != undefined && elm.scrollHeight != null){
      if(totalElmScroll != undefined) {
        elm.scrollTop = elm.scrollHeight-totalElmScroll;
      }
    }
    
    }, 0);

  }
  scrollCheck(){
  let elm:any = document.getElementById("message-scroll");
  setTimeout(() => {
  if(this.isScroll == false){
     
        elm.scrollTop = elm.scrollHeight+50;
    }
    
    }, 0);
  }
  returnIndex(data:any,key:any,value:any){
     const index = data.findIndex((object:any) => {
           return object[key] === value;
       });
     return index;


  }
  settabinfo(chatFor:any){
   if (window.history.pushState) {
    var newurl = window.location.protocol + "//" + window.location.host + window.location.pathname + '?tab=messages&chatFor='+chatFor;
    window.history.pushState({path:newurl},'',newurl);
}
}

  async getMessages(roomId: any,isInit:boolean) {

    let response = await this.messageService.getMessages(roomId,this.fetchRecord,this.currentPage);
    if (response && !response.error) {
      this.messages = response.messages;
      this.moreRecordExist = response.moreRecord;



      for (let i = 0; i < this.messages.length; i++) {
        if(this.messages[i].roomId == this.roomId){
        let message = this.messages[i].message;
        let time = this.returntime(this.messages[i].createdAt);
        let currentDate = this.returnDate(this.messages[i].createdAt);

        message = await this.decrypt(message);


        this.messages[i].time = time;
        this.messages[i].message = message;

        // let sender = this.messages[i].senderId.firstName
        //   ? this.messages[i].senderId.firstName +
        //     (this.messages[i].senderId.lastName?' '+this.messages[i].senderId.lastName:'')
        //   : this.messages[i].senderId.email;
        const base64RegExp = /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{4})$/;
        let senderInfoCheck = base64RegExp.test(this.messages[i].sdi);
        if(senderInfoCheck == true){
           this.messages[i].sdi = await atob(this.messages[i].sdi)
        }
       
        let senderIdCheck = base64RegExp.test(this.messages[i].sd);
        if(senderIdCheck == true){
         this.messages[i].sd = await atob(this.messages[i].sd) 
        }
        
        let sender = this.messages[i].sdi;

          if(this.messages[i].sd === this.sender){
             this.messages[i].sdi = "You";
          } 
          else{
            this.messages[i].sdi = sender;
          }

           this.messages[i].sender = this.messages[i].sd;


          const index = this.returnIndex(this.totalMessages,"date",currentDate);
          if(index == -1){
          this.totalMessages.unshift({date:currentDate,messages:[this.messages[i]]});
          }
          else{
          this.totalMessages[index].messages.unshift(this.messages[i]);
          }
        }
      
      }

      if(isInit == false){
      this.scrollTop();
      }

    }
  }

  ngOnDestroy(): void {
    if(this.onNotification){
       this.onNotification.unsubscribe();
    }
    if(this.inMessage){
     this.inMessage.unsubscribe();
    }
    if(this.role === 'Patient'){
      this.notificationService.sendMessage('leave', this.sender, this.sender);
    }
    this.notificationService.sendMessage('leave', this.roomId,this.sender);
    if(this.onMessage){
    this.onMessage.unsubscribe();
    }
    if(this.isSocketConnected){
      this.isSocketConnected.unsubscribe();
    }
    

  }

  encrypt(value: string): string {
  return CryptoJS.AES.encrypt(value, this.roomId.trim()).toString();
  }

  async decrypt(textToDecrypt: string) {
    let decryptText:any = await CryptoJS.AES.decrypt(textToDecrypt, this.roomId.trim());
   
    if(decryptText.toString() == ""){
      return textToDecrypt;
    }
    else{
      //console.log("check message",decryptText.toString());
      // return await decryptText.toString(CryptoJS.enc.Utf8);
       return await CryptoJS.AES.decrypt(textToDecrypt, this.roomId.trim()).toString(
      CryptoJS.enc.Utf8
    );
    }


    // return CryptoJS.AES.decrypt(textToDecrypt, this.roomId.trim()).toString(
    //   CryptoJS.enc.Utf8
    // );
  }

  createRoomId(roomId:string) {
    let id =  roomId.split('').sort().join('');
    return id;

  }

  sendMessage() {
    this.currentMessage = this.currentMessage ? this.currentMessage.trim():'';
    if(this.currentMessage){
      let message = this.encrypt(this.currentMessage);

    let chatTab = '';
    if(this.chatFor === 'Group'){
      chatTab = this.chatFor;
    }else{
      if(this.role === 'Patient'){
        chatTab = this.role;
      }else{
        chatTab = this.role.toUpperCase();
      }
    }
    let data = {
      roomId: this.roomId,
      // senderId: this.sender,
      // senderInfo:this.fullName,
      // receiverId: this.receiver,
      ntToken:btoa(JSON.stringify(this.receiver)),
      message: message,
      type: 'text',
      moduleId: this.moduleId,
      meta: {'module':this.moduleName,'moduleId':this.moduleId,'chatFor':chatTab},
    };

    this.notificationService.sendMessage('newMessage', data,this.sender);
    this.currentMessage = '';
    }
    
  }
}
