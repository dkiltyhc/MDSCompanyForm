import {Component, EventEmitter, Input, OnChanges, OnInit, Output, QueryList, SimpleChanges, ViewChildren} from '@angular/core';
import {FormGroup, FormBuilder, Validators } from '@angular/forms';
import {ControlMessagesComponent} from '../../error-msg/control-messages.component/control-messages.component';
import {TheraClassService} from './thera-class.service';

@Component({
  selector: 'therapeutic-classification',
  templateUrl: './therapeutic-classification.component.html',
  styleUrls: ['./therapeutic-classification.component.css']
})
export class TherapeuticClassificationComponent implements OnInit, OnChanges {
  @Input('group') public theraFormRecord: FormGroup;
  @Input() detailsChanged: number;
  @Input() showErrors:boolean;
  @Output() errorList = new EventEmitter();
  @Output() deleteRecord=new EventEmitter();
  @ViewChildren(ControlMessagesComponent) msgList: QueryList<ControlMessagesComponent>;
  public theraDetailsModel: FormGroup;

  public showFieldErrors:boolean=false;
  private service:TheraClassService;

  constructor(private _fb:FormBuilder) {
    this.service=new TheraClassService();
    this.theraDetailsModel=TheraClassService.getReactiveModel(_fb);
  }

  ngOnInit() {
      if(!this.theraDetailsModel){
        console.warn("OnInit: creating a model for thera details");
        this.theraDetailsModel==TheraClassService.getReactiveModel(this._fb);

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
    if (changes['group']) {
      this.theraDetailsModel = this.theraFormRecord;
    }
    if (changes['detailsChanged']) { //used as a change indicator for the model
      if (this.theraFormRecord) {
        this.theraDetailsModel = this.theraFormRecord;
      } else {
        this.theraFormRecord = TheraClassService.getReactiveModel(this._fb);
      }
      this.theraFormRecord.markAsPristine();

    }
  }

  public deleteThera(){
      this.deleteRecord.emit(this.theraDetailsModel.controls.id.value);
  }


}
