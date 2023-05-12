import { Component, OnInit,Output,Input,EventEmitter } from '@angular/core';

@Component({
  selector: 'app-checkbox',
  templateUrl: './checkbox.component.html',
  styleUrls: ['./checkbox.component.scss']
})
export class CheckboxComponent implements OnInit {
 @Input() fieldData: any;
@Output() newItemEvent = new EventEmitter<string>();
@Input() responseData: any;
inputField:any = [];

  constructor() { }

  ngOnInit(): void {
    if(this.responseData && this.responseData != undefined){
      this.renderData(this.responseData);
    }
  }

 returnIndex(data:any,key:any,value:any){
     const index = data.findIndex((object:any) => {
           return object[key] === value;
       });
     return index;


  }

  selectField(val:any,event:any){
  let obj:any ={};
  obj["key"] = this.fieldData.fieldName;
  obj['value'] =  this.fieldData.options;
  this.newItemEvent.emit(obj);
 }

  async renderData(data:any){
  if(data[this.fieldData.fieldName] && data[this.fieldData.fieldName].length > 0){
  
  for(var a=0; a < data[this.fieldData.fieldName].length; a++){
   
   let index = await this.returnIndex(this.fieldData.options,'name',data[this.fieldData.fieldName][a].name); 
   if(index != -1){
    this.fieldData.options[index].selected = data[this.fieldData.fieldName][a].selected;
   }
  }


  }
  
  }

}
