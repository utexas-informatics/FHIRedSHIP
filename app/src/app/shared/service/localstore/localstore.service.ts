import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Observable } from 'rxjs';
//import { environment} from './../../environments/environment'; 
import { Router,ActivatedRoute } from '@angular/router';
import { map } from 'rxjs/operators';// This is where I import map operator
import { HttpClient, HttpHeaders } from "@angular/common/http";

declare var $:any;

@Injectable({
  providedIn: 'root'
})
export class LocalstoreService {
responseData: any;
  constructor(
    private http: HttpClient, private router:Router) { }

    removeRecod(){
	  	localStorage.removeItem('localAuthCred');
	  }

	  addRecord(obj:any){
	  let tempstorage = JSON.stringify(obj);
       localStorage.setItem("localAuthCred", tempstorage);	
	  }

	  mergeRecord(obj:any){
	  	  try{
          if(obj.fieldMapping){
            obj.fieldMapping=JSON.parse(obj.fieldMapping);
          }
        }catch(err){
        }
	  	let oldRec=this.getFullRec();
	  	let finalRec=Object.assign(oldRec, obj);
	  	this.addRecord(finalRec);
	  }

	  getFullRec(){
	  let localData:any={};
	         let userInfo = localStorage.getItem("localAuthCred");
	         if(userInfo!=null){
	           let userData = JSON.parse(userInfo);
	            if(userData){
	            localData=userData
	         }
	    }
	         return localData;	
	  }


	  getRec(key:any){
	         let userInfo = localStorage.getItem("localAuthCred");
	         let keyVal="";
	         if(userInfo!=null){
	           let userData = JSON.parse(userInfo);
	            if(userData){
	            if(userData[key]){
	             keyVal=userData[key];
	            }	
	         }
	         }
	         return keyVal;
	    }

     setRec(key:any,val:any){
     	let localData=this.getFullRec();
        localData[key]=val;
        this.addRecord(localData);
    }




   
    
    
}
