import {Component, EventEmitter, Input, OnChanges, OnInit, Output, QueryList, SimpleChanges, ViewChildren} from '@angular/core';
import {FormGroup, FormBuilder, Validators } from '@angular/forms';
import {ControlMessagesComponent} from '../../error-msg/control-messages.component/control-messages.component';

@Component({
  selector: 'therapeutic-classification',
  templateUrl: './therapeutic-classification.component.html',
  styleUrls: ['./therapeutic-classification.component.css']
})
export class TherapeuticClassificationComponent implements OnInit, OnChanges {
  @Input('group') public theraFormRecord: FormGroup;
  //@Input() detailsChanged: number;
  @Input() showErrors:boolean;
  @Output() errorList = new EventEmitter();
  @ViewChildren(ControlMessagesComponent) msgList: QueryList<ControlMessagesComponent>;
  public theraDetailsModel: FormGroup;

  public showFieldErrors:boolean=false;

  constructor(private _fb:FormBuilder) { }

  ngOnInit() {
      if(!this.theraDetailsModel){
        console.log("creating a model");
        this.theraDetailsModel=
          this._fb.group({
            id: [null, Validators.required],
            theraDetails: [null, Validators.required]
          });
      }
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes['showErrors']) {
      this.showFieldErrors = changes['showErrors'].currentValue;
      let temp = [];
      if (this.msgList) {
        this.msgList.forEach(item => {
          temp.push(item);
        });
      }
      this.errorList.emit(temp);
    }
    if(changes['group']){
      this.theraDetailsModel= this.theraFormRecord;
    }

  }

}
