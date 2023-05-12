import {Component , OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges, SimpleChange} from '@angular/core';
import { NgxFileDropEntry, FileSystemFileEntry, FileSystemDirectoryEntry } from 'ngx-file-drop';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { Observable,throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { MsgService } from '../../../services/msg/msg.service';
import { apiBaseUrl, apiUrlConfig } from '../../../constants';
import { FileuploadService } from '../../../services/fileupload/fileupload.service';
import { environment } from "../../../../environments/environment";
import { LocalstoreService } from '../../service/localstore/localstore.service';
  
@Component({
  selector: 'app-fileupload',
  templateUrl: './fileupload.component.html',
  styleUrls: ['./fileupload.component.scss']
})
export class FileuploadComponent implements OnInit {
@Input() linking : any=''; 
@Input() fieldData : any = null; 
@Output() newItemEvent = new EventEmitter<string>();
 public files: NgxFileDropEntry[] = [];
 uploadedFiles:any=[];
 selectedItem:any={};
 @Input() isRender: any;
 selectedIndex:number=-1;
 showLoading:boolean=false;
 progress1:boolean=false;
 progress2:boolean=false;
 progress3:boolean=false;
 role: any = '';
 email:string='';
  constructor(private http: HttpClient, private fileuploadService:FileuploadService, private localstoreService:LocalstoreService, private msgService:MsgService) { }

  async ngOnInit(): Promise<void> {
    let role: any = await this.localstoreService.getRec('role');
    this.role = role.role;
    this.showLoading = true;
    this.getFiles();
  }

  fileUploaded(evt:any){
  if(evt.currentTarget && evt.currentTarget.files && evt.currentTarget.files.length !== 0){
  let files = evt.currentTarget.files;
  for (const file of files) {
  this.uploadFile(file,file.name);
  }
  }
  }

  uploadFile(file:any,relativePath:any){
    const formData = new FormData()
    formData.append('logo', file,relativePath)


let token = this.localstoreService.getRec('access_token');
let patientId='';
let researcherId='';
let authorization:any = token ? { Authorization: `bearer ${token}` } : '';

    // Headers
   // const headers = new HttpHeaders(authorization)
   
     this.progress1=true;
     this.progress2=true;
     this.progress3=true;

    
  this.http.post(`${apiUrlConfig.fileupload}`+`?linking=`+this.linking+`&email=`+this.email, formData,  {headers: new HttpHeaders().set('Authorization',  `bearer ${token}`)})
      .pipe(
        catchError((err) => {
          if (
            err.status === 413 
          ) {
             this.progress1=false;
               this.progress2=false;
                 this.progress3=false;
           this.msgService.show("",this.msgService.msgObject.fileUploadSizeError,'danger','4000'); 
          }
         
          return throwError(err);
        })
      ) 

    .subscribe((data:any) => {


      if(data && data.status == true){
        this.progress1=false; 
         setTimeout(() => {
         this.progress2=false;
        }, 1000);
           setTimeout(() => {
         this.progress3=false;
        this.msgService.show("",this.msgService.msgObject.fileUpload,'success','4000'); 
        }, 2000);
        this.uploadedFiles.push(data.data);
        this.setFileLink();
        if(this.fieldData){
          let obj:any ={};
          obj["key"] = this.fieldData.fieldName;
          obj['value'] = this.uploadedFiles;
          this.newItemEvent.emit(obj);
        }
       
        
      }
      else{
     this.progress1=false;
     this.progress2=false;
     this.progress3=false;
     this.msgService.show("",data.msg,'danger','4000'); 
    }


     

    })
  }
  
  public dropped(files: NgxFileDropEntry[]) {
    this.files = files;
    for (const droppedFile of files) {
      if (droppedFile.fileEntry.isFile ) {
        if(this.isFileAllowed(droppedFile.fileEntry.name)){
          const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;
          fileEntry.file((file: File) => {
            this.uploadFile(file,droppedFile.relativePath);
          });
        }else{
          this.msgService.show("",`Failed to upload ${droppedFile.fileEntry.name}.File Format not supported.`,'danger','4000'); 
        }
       
      } else {
        const fileEntry = droppedFile.fileEntry as FileSystemDirectoryEntry;
  
      }
    }
  }
  
  isFileAllowed(fileName: string) {
    let isFileAllowed = false;
    const allowedFiles = [".png",".jpg",".jpeg",".pdf",".doc",".docx"];
    const regex = /(?:\.([^.]+))?$/;
    const extension = regex.exec(fileName);
    
    if (extension) {
        for (const ext of allowedFiles) {
            if (ext === extension[0]) {
                isFileAllowed = true;
            }
        }
    }
    return isFileAllowed;
  }

  public fileOver(event:any){

  }

  public fileLeave(event:any){
    

  }

  public openFileSelector(){

  }

 async getFiles(){
    this.email = await this.localstoreService.getRec('email');
    this.fileuploadService.get(this.linking).subscribe((response) => {
  
        if (response && !response.error) {
           if(response.length>0){
            this.uploadedFiles=response;
           
            this.setFileLink();
            this.showLoading = false;
            
           
          }
          else{
           this.showLoading = false;
          }
          if(this.fieldData){
            let obj:any ={};
            obj["key"] = this.fieldData.fieldName;
            obj['value'] = this.uploadedFiles;
            this.newItemEvent.emit(obj);
          }
        }
        else{
         this.showLoading = false;
        }
      
    });
  }

  removeFile(item:any,i:any){
  this.fileuploadService.remove(item._id,this.email,this.linking,item.originalName).subscribe((response) => {
      if (response && response.status == true) {
        this.uploadedFiles.splice(i,1);
        if(this.fieldData){
          let obj:any ={};
          obj["key"] = this.fieldData.fieldName;
          obj['value'] = this.uploadedFiles;
          this.newItemEvent.emit(obj);
        }

       this.msgService.show("",this.msgService.msgObject.removeFile,'success','4000'); 

      }
      else{
       this.msgService.show("",response.msg,'danger','4000');
      }
    });
  }


setFileLink(){
  for(var i=0;i<this.uploadedFiles.length;i++){
    this.uploadedFiles[i]['link']=environment.appUrl+'/uploads/'+this.uploadedFiles[i]['name'];
  }
}

selectItem(item:any,i:any){
this.selectedIndex=i;
this.selectedItem=item;
}

remove(){
this.removeFile(this.selectedItem, this.selectedIndex);
}

}
