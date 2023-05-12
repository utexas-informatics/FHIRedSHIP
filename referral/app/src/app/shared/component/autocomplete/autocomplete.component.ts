import { Component, OnInit, Output,Input,EventEmitter,ViewChild} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AssessmentService } from '../../../assessment/assessment.service';
 
@Component({
  selector: 'app-autocomplete',
  templateUrl: './autocomplete.component.html',
  styleUrls: ['./autocomplete.component.scss']
})
export class AutocompleteComponent implements OnInit {

  @Input() keyword: any;
  @Input() searchUrl: any;
  @Input() searchType: any;
  data: any;
 
  @Output() newItemEvent = new EventEmitter<string>();
  errorMsg: any = "Not Found";
  isLoadingResult: any;
  clearDataListener: any;
  @Input() inputClear: any;
  @Input() isDisable:any;
  @Input() value:any;
  @ViewChild('auto') auto:any;


  constructor(
    private http: HttpClient,private assessmentService: AssessmentService
  ) { }

  ngOnInit() {
    this.clearDataListener = this.assessmentService.isClearData.subscribe(
      (res) => {
        if (res === 'yes') {
          this.auto.clear();
         this.data = [];
        }
      }
    );
  }

  ngOnDestroy() {
    this.clearDataListener.unsubscribe();
  }

  getData(searchText:string){
   this.http.get(this.searchUrl+"?s=" + searchText)
      .subscribe((data:any) => {

        if(data && data.length > 0){
          this.data = data;
        }
        else{
          if(this.searchType){
            this.errorMsg = `No ${this.searchType} Found`;
          }else{
            this.errorMsg = "Not Found";
          }
          this.data = [];
        }
        this.isLoadingResult = false;
      });


  }

  getServerResponse(searchText:any) {

    this.isLoadingResult = true;

    if(searchText == ""){
      this.data = [];
      this.isLoadingResult = false;
    }
    else{
     this.getData(searchText);

    }

  
  } 

  searchCleared() {
    this.data = [];
    let obj:any = {};
    this.newItemEvent.emit(obj);
  }

  selectEvent(item:any) {
    if(typeof item !== 'string'){
    this.newItemEvent.emit(item);
    if(this.inputClear === 'true'){
      this.auto.clear();
       this.data = [];
    }
 }
    
    // do something with selected item
  }

  onChangeSearch(val: string) {

    // fetch remote data from here
    // And reassign the 'data' which is binded to 'data' property.
  }

  onFocused(e:any) {
  let searchText = e.currentTarget.value;
  this.data = [{name:"",item:""}]
  this.isLoadingResult = true;
  this.getData(searchText);

    // do something when input is focused
  }

}