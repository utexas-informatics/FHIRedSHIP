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
export class LocalStore {
responseData: any;
  constructor(
    private http: HttpClient, private router:Router) { }

    set(key:string,data:any){
	  	localStorage.setItem(key,JSON.stringify(data));
	  }
	  get(key:string){
	  	return localStorage.getItem(key);
	  }

      getField(key:string,field:string){
      let data:any = this.get(key);
      return JSON.parse(data)[field];
      
      }
    
    update(key:string,data:any){
    let newData:any = this.get(key);
    let finalRec=Object.assign(JSON.parse(newData),data);
    this.set(key,finalRec);
    }
    remove(key:string){
    localStorage.removeItem(key)
    }

}
