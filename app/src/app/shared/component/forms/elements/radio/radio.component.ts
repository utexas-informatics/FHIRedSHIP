import { Component, OnInit,Output,Input,EventEmitter } from '@angular/core';

@Component({
  selector: 'app-radio',
  templateUrl: './radio.component.html',
  styleUrls: ['./radio.component.scss']
})
export class RadioComponent implements OnInit {
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

  selectField(val:any,event:any){
  let obj:any ={};
  obj["key"] = this.fieldData.fieldName;
  obj['value'] =  this.inputField;
  this.newItemEvent.emit(obj);
  }
  renderData(data:any){
  this.inputField = data[this.fieldData.fieldName];
 }

}
