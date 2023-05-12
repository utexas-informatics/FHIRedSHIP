import { Component, OnInit,Input,Output, EventEmitter} from '@angular/core';

@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss']
})



export class InputComponent implements OnInit {
@Input() fieldData: any;
@Input() responseData: any;
@Output() newItemEvent = new EventEmitter<string>();
inputField:any;


  constructor() { }

  ngOnInit(): void {
    if(this.responseData && this.responseData != undefined){
      this.renderData(this.responseData);
    }
  }
  onKeyup($event:any){
  let obj:any ={};
  obj["key"] = this.fieldData.fieldName;
  obj['value'] =  this.inputField;
  this.newItemEvent.emit(obj);
  
  }
 
  renderData(data:any){

  this.inputField = data[this.fieldData.fieldName];
 }



}
