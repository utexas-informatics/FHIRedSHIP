import {Component , OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges, SimpleChange} from '@angular/core';


@Component({
  selector: 'app-conditionscreen',
  templateUrl: './conditionscreen.component.html',
  styleUrls: ['./conditionscreen.component.scss']
})
export class ConditionscreenComponent implements OnInit {
  @Input() conditionsArr : any=[];	
  showLoading = false;
  constructor() { }

  @Output() change: EventEmitter<number> = new EventEmitter<number>();

  ngOnInit(): void {

  }

  setNeedInCondition(event:any, i:any){
  }
  onKeyup(event:any,i:any){

  }

}
