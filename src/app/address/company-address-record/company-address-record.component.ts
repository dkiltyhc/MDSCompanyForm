import {Component, EventEmitter, Input, OnInit, Output, QueryList, SimpleChanges, ViewChild, ViewChildren} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ControlMessagesComponent} from '../../control-messages.component/control-messages.component';
import {AddressDetailsComponent} from '../address.details/address.details.component';
import {CompanyAddressRecordService} from './company-address-record.service';


@Component({
  selector: 'company-address-record',
  templateUrl: './company-address-record.component.html',
  styleUrls: ['./company-address-record.component.css']
})
export class CompanyAddressRecordComponent implements OnInit {

  public adressRecordModel: FormGroup;
  @Input('group') public adressFormRecord: FormGroup;
  @Input() detailsChanged: number;
  @Output() saveRecord = new EventEmitter();
  @Output() revertRecord = new EventEmitter();
  @Output() deleteRecord = new EventEmitter();
  @Output() createRecord; //TODO don't know if needed
  @Output() public errors = new EventEmitter();


  @ViewChildren(ControlMessagesComponent) msgList: QueryList<ControlMessagesComponent>;
  @ViewChild (AddressDetailsComponent) addressDetailsChild;

  public updateChild: number = 0;
  public errorList = null;

  constructor(private _fb: FormBuilder) {

  }

  ngOnInit() {
    console.log(this._initAddress());
    if (!this.adressRecordModel) {
      this.adressRecordModel = this._initAddress();
    }
    this.detailsChanged = 0;

  }

  private _initAddress() {
    let temp= CompanyAddressRecordService.getReactiveModel(this._fb);
    console.log(temp);
    return temp;
  }

  ngOnChanges(changes: SimpleChanges) {

    if (changes['detailsChanged']) { //used as a change indicator for the model
      console.log('*******************ngOnChanges changed for Address record***************');
      if (this.adressFormRecord) {
        console.log('************Setting to local model for Address Record****************');
        this.setToLocalModel();
      } else {
        this.adressRecordModel = this.initAddress();
        console.warn('**************There was no model for Address Record, not updating*****************');
        this.adressRecordModel.markAsPristine();
      }
      this.updateChild++;
    }
  }
  /**
   * Intializes a local model for address. This is needed otherwise the component will fail since we are implementing reactive forms
   * @returns {FormGroup}
   */
  initAddress() {

    return this._fb.group({
      id: -1,
      detailsDirty: false,
      addressDetails:  this.addressDetailsChild.initAddress()
    });
  }


  setToLocalModel() {
    console.log('Address Record being set to the address form');
    console.log(this.adressFormRecord);
    this.adressRecordModel = this.adressFormRecord;
    this.adressRecordModel.markAsPristine();
  }

  updateErrorList(errs) {
    this.errorList = errs;
    this.errors.emit(this.errorList);
  }

  /**
   * Changes the local model back to the last saved version of the address
   */
  public revertAddressRecord(): void {
    this.revertRecord.emit(this.adressRecordModel);
    this.adressRecordModel.markAsPristine();
  }

  /***
   * Deletes the address reocord with the selected id from both the model and the form
   */
  public deleteAddressRecord(): void {
    this.deleteRecord.emit(this.adressRecordModel.value.id);
  }

  public saveAddressRecord(): void {
    if (this.adressRecordModel.valid) {
      this.saveRecord.emit((this.adressRecordModel));
      this.adressRecordModel.markAsPristine();
    } else {
      //id is used for an error to ensure the record gets saved
      let temp = this.adressRecordModel.value.id;
      this.adressRecordModel.controls.id.setValue(1);
      if (this.adressRecordModel.valid) {
        this.adressRecordModel.controls.id.setValue(temp);
        this.saveRecord.emit((this.adressRecordModel));
      } else {
        this.adressRecordModel.controls.id.setValue(temp);
        this.saveRecord.emit((null));
      }
    }
  }


}
