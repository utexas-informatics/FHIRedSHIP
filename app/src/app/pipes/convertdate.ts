//our root app component
import {Component, NgModule, Pipe, PipeTransform} from '@angular/core'
import { DomSanitizer } from '@angular/platform-browser'

@Pipe({ name: 'convert'})
export class ConvertDatePipe implements PipeTransform  {
  constructor(private sanitized: DomSanitizer) {}
  transform(value:any) {
  let msg = (value)?value:"";
  let convertedDate:any = "";
  let result = msg.match(/<d>(.*?)<\/d>/g).map(function(val:any){
   return val.replace(/<\/?d>/g,'');
  });
  if(result.length > 0){
  convertedDate = new Date(result[0]);
  msg.replace(/<d>(.*?)<\/d>/g,convertedDate.toString());  
  }
  return msg

    //return this.sanitized.bypassSecurityTrustHtml(value);
  }
}