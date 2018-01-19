import {
  Component, Input, Output, OnInit, SimpleChanges, OnChanges, EventEmitter, ViewChildren, QueryList,
  AfterViewInit
} from '@angular/core';
import {FormGroup, Validators, FormBuilder} from '@angular/forms';
import {ControlMessagesComponent} from '../control-messages.component/control-messages.component';


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
  //@Input() formType: string;
/*  @Output() saveRecord = new EventEmitter();
  @Output() revertRecord = new EventEmitter();
  @Output() deleteRecord = new EventEmitter();*/
  @Output() errorList = new EventEmitter();
  @ViewChildren(ControlMessagesComponent) msgList: QueryList<ControlMessagesComponent>;

  constructor(private _fb: FormBuilder) {

  }

  ngOnInit() {
    if (!this.adressFormLocalModel) {
      this.adressFormLocalModel = this.initAddress();
    }
    this.detailsChanged = 0;
  }

  ngAfterViewInit() {

    this.msgList.changes.subscribe(errorObjs => {
      console.log('There are errors changed in the address details');
      let temp = [];
      errorObjs.forEach(
        error => {
          temp.push(error);
        }
      );
      this.errorList.emit(temp);
    });
  }


  ngOnChanges(changes: SimpleChanges) {

    if (changes['detailsChanged']) { //used as a change indicator for the model
      console.log('################ngOnChanges changed for Address Details');
      if (this.adressFormRecord) {
        console.log('################Setting to local model');
        this.setToLocalModel();
      } else {
        this.adressFormLocalModel = this.initAddress();
        console.warn('There was no model, not updating');
        this.adressFormLocalModel.markAsPristine();
      }
    }
  }

  setToLocalModel() {
    this.adressFormLocalModel = this.adressFormRecord;
    console.log(this.adressFormLocalModel);
    if (!this.adressFormLocalModel.pristine) {
      this.adressFormLocalModel.markAsPristine();
    }
  }


  /**
   * Changes the local model back to the last saved version of the address
   */
  revertAddress() {
    this.adressFormLocalModel = this.adressFormRecord;
  }

  /**
   * Intializes a local model for address. This is needed otherwise the component will fail since we are implementing reactive forms
   * @returns {FormGroup}
   */
  initAddress() {

    return this._fb.group({
      address: [null, Validators.required],
      city: [null, Validators.required, Validators.min(5)],
    });
  }

  /*public saveAddressRecord(): void {
    if (this.adressFormLocalModel.valid) {
      this.saveRecord.emit((this.adressFormLocalModel));
      this.adressFormLocalModel.markAsPristine();
    } else {
      //id is used for an error to ensure the record gets saved
      let temp = this.adressFormLocalModel.value.id;
      this.adressFormLocalModel.controls.id.setValue(1);
      if (this.adressFormLocalModel.valid) {
        this.adressFormLocalModel.controls.id.setValue(temp);
        this.saveRecord.emit((this.adressFormLocalModel));
      } else {
        this.adressFormLocalModel.controls.id.setValue(temp);
        this.saveRecord.emit((null));
      }
    }
  }*/

  /**
   * Reverts the address record to what was last saved in the model
   */
/*
  public revertAddressRecord(): void {
    this.revertRecord.emit(this.adressFormLocalModel);
    this.adressFormLocalModel.markAsPristine();
  }
*/

  /***
   * Deletes the address reocord with the selected id from both the model and the form
   */
/*
  public deleteAddressRecord(): void {
    this.deleteRecord.emit(this.adressFormLocalModel.value.id);
  }
*/

}

