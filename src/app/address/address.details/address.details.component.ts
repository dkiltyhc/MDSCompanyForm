import {
  Component, Input, Output, OnInit, SimpleChanges, OnChanges, EventEmitter, ViewChildren, QueryList,
  AfterViewInit, ChangeDetectionStrategy
} from '@angular/core';
import {FormGroup, Validators, FormBuilder, FormControl} from '@angular/forms';
import {ControlMessagesComponent} from '../../control-messages.component/control-messages.component';
import {AddressDetailsService} from './address.details.service';


@Component({
  selector: 'address-details',
  templateUrl: 'address.details.component.html'
})

/**
 * Sample component is used for nothing
 */
export class AddressDetailsComponent implements OnInit, OnChanges, AfterViewInit {

  public adressFormLocalModel: FormGroup;
  @Input('group') public adressFormRecord: FormGroup;
  @Input() detailsChanged: number;
  @Input() showErrors:boolean;
  @Output() errorList = new EventEmitter();
  @ViewChildren(ControlMessagesComponent) msgList: QueryList<ControlMessagesComponent>;
  public countries: Array<any> = [
    {'id': 'ABW', 'text': 'Aruba' , langs:{en:'dd',fr:'fdf'}},
    {'id': 'AFG', 'text': 'Afghanistan',langs:{en:'AFff',fr:'fdf'}}
  ];
  public showFieldErrors:boolean=false;

  private detailsService: AddressDetailsService;

  constructor(private _fb: FormBuilder) {
    this.showFieldErrors=false;
    this.showErrors=false;
  }

  ngOnInit() {
    if (!this.adressFormLocalModel) {
      this.adressFormLocalModel = AddressDetailsService.getReactiveModel(this._fb);
    }
    this.detailsChanged = 0;

  }

  ngAfterViewInit() {
    this.msgList.changes.subscribe(errorObjs => {
      let temp = [];
      errorObjs.forEach(
        error => {
          temp.push(error);
        }
      );
      this.errorList.emit(temp);
    });
    this.msgList.notifyOnChanges();
  }


  ngOnChanges(changes: SimpleChanges) {

    //since we can't detect changes on objects, using a separate flag
    if (changes['detailsChanged']) { //used as a change indicator for the model
      if (this.adressFormRecord) {
        this.setToLocalModel();
      } else {
        this.adressFormLocalModel = AddressDetailsService.getReactiveModel(this._fb);
        this.adressFormLocalModel.markAsPristine();
      }
    }
    if(changes['showErrors']){

      this.showFieldErrors=changes['showErrors'].currentValue;
      let temp=[];
      if(this.msgList) {
        this.msgList.forEach(item=>{
          temp.push(item);
        });
      }
      this.errorList.emit(temp);
    }
  }


  /**
   * Uses the updated reactive forms model locally
   */

  setToLocalModel() {
    this.adressFormLocalModel = this.adressFormRecord;
    if (!this.adressFormLocalModel.pristine) {
      this.adressFormLocalModel.markAsPristine();
    }
  }

  //note ng-select expects an array of values even with a single select
  selected(rec){
    console.log(rec)
    //this.adressFormLocalModel.controls.country.setValue([rec.id]);
    //this.adressFormLocalModel.controls.country.setValue([rec]);
  }
  removed(rec){
    console.log(rec)
    //this.adressFormLocalModel.controls.country.setValue(null)
  }
  typed(rec){
    var content = rec.replace(/[\x00-\x7F]/g,'', '');
    if(content && this.existsInList(content)) {
      this.adressFormLocalModel.controls.country.setValue([content]);
    }
  }

  existsInList(rec){
    for(let country of this.countries){
        if(country.id==rec){
          return true;
        }
    }
    return false;
  }


}

