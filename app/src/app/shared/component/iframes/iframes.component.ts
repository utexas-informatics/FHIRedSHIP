import {Component , OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges, SimpleChange} from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';


@Component({
  selector: 'app-iframes',
  templateUrl: './iframes.component.html',
  styleUrls: ['./iframes.component.scss']
})
export class IframesComponent implements OnInit {
  showIframe=false;
  url:any='';
  urlSafe: any='';
  @Input() inputFromParent : any;
  constructor(public sanitizer: DomSanitizer) { }
  
  @Output() change: EventEmitter<number> = new EventEmitter<number>();


   ngOnInit(): void {

    this.url=this.inputFromParent;
    this.show();
  }


  show(){
    this.showIframe=true;
    this.urlSafe= this.sanitizer.bypassSecurityTrustResourceUrl(this.url);
  }

}
