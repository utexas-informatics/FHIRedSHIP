import { Component, OnInit, Output,Input,EventEmitter,ViewChild} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {AutocompleteService} from '../../../services/autocomplete/autocomplete.service';

@Component({
  selector: 'app-autocomplete',
  templateUrl: './autocomplete.component.html',
  styleUrls: ['./autocomplete.component.scss']
})
export class AutocompleteComponent implements OnInit {

  @Input() keyword: any;
  @Input() searchUrl: any;
  data: any;
  @Output() newItemEvent = new EventEmitter<string>();
  errorMsg: any;
  isLoadingResult: any;
  @Input() inputClear: any;
  @ViewChild('auto') auto:any;

  constructor(
    private http: HttpClient,
    private autocompleteService:AutocompleteService
  ) { }

  ngOnInit() {
  }

  
  getData(searchText:string){
  this.autocompleteService.get(this.searchUrl+"?s=" + searchText).subscribe((data) => {
       if(data && data.length > 0){
          this.data = data;
        }
        else{
          this.data = [];
          this.errorMsg = "Not Found";
        }
        this.isLoadingResult = false;
      
    });
    
   // this.http.get(this.searchUrl+"?s=" + searchText)
   //    .subscribe((data:any) => {

   //      if(data && data.length > 0){
   //        this.data = data;
   //      }
   //      else{
   //        this.data = [];
   //        this.errorMsg = "Not Found";
   //      }
   //      this.isLoadingResult = false;
   //    });


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
  }

  selectEvent(item:any) {
    if(this.inputClear === 'true'){
      this.auto.clear();
    }
     this.newItemEvent.emit(item);
     this.searchCleared();
    // do something with selected item
  }

  onChangeSearch(val: string) {
    // fetch remote data from here
    // And reassign the 'data' which is binded to 'data' property.
  }

  onFocused(e:any) {
  let searchText = e.currentTarget.value;
  this.getData(searchText);

    // do something when input is focused
  }

}