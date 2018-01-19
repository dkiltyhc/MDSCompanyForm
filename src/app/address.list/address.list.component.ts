import {
  Component, OnInit, Input, ViewChild, SimpleChanges, OnChanges, ViewChildren, QueryList, EventEmitter, Output,
  AfterViewInit
} from '@angular/core';
import {Form, FormArray, FormControl, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ExpanderComponent} from '../expander.component';
import {AddressDetailsComponent} from '../address/address.details.component';
import {CompanyModelService} from '../company.model.service';
//import {ControlMessagesComponent} from '../control-messages.component/control-messages.component';
import {ErrorSummaryComponent} from '../error-msg/error-summary/error-summary.component';
import {CompanyAddressRecordComponent} from '../address/company-address-record/company-address-record.component';


@Component({
  selector: 'address-list',
  templateUrl: './address.list.component.html',
  styleUrls: ['./address.list.component.css']
})
export class AddressListComponent implements OnInit, OnChanges, AfterViewInit {
  @Input('group') public addresses: FormArray;
  @Input() public saveRecord;
  @Input() public showErrors:boolean=false;
  @Output() public errors = new EventEmitter();

  @ViewChild(ExpanderComponent) expander: ExpanderComponent;
 // @ViewChild(AddressDetailsComponent) addressDetailsChild: AddressDetailsComponent;
  @ViewChild(CompanyAddressRecordComponent)companyAddressChild: CompanyAddressRecordComponent;
  @ViewChildren(ErrorSummaryComponent) errorSummaryChildList: QueryList<ErrorSummaryComponent>;

  private errorSummaryChild = null;
  private prevRow = -1;
  public updateAddressDetails: number = 0;
  public newRecordInd = false;
  public addressListForm: FormGroup;
  public service: CompanyModelService;
  public addRecordMsg = 0;
  public deleteRecordMsg = 0;
  public errorList = [];
  public showErrorSummary:boolean=false;
  public columnDefinitions = [
    {
      label: 'ADDRESS',
      binding: 'address',
      width: '25'
    },
    {
      label: 'CITY',
      binding: 'city',
      width: '25'
    }
  ];


  constructor(private _fb: FormBuilder) {
    this.service = new CompanyModelService();

  }

  ngOnInit() {
    this.addressListForm = this._fb.group({
      addresses: this.addresses
    });
    let addressDataList = this.service.getAddresses();
    const mycontrol = <FormArray>this.addressListForm.controls['addresses'];
    //TODO temp setting some initial data
    for (let i = 0; i < addressDataList.length; i++) {
      let formAddress = this.initAddress(true);
      formAddress.controls.city.setValue(addressDataList[i].city);
      formAddress.controls.address.setValue(addressDataList[i].address);
      formAddress.controls.id.setValue(addressDataList[i].id);
      mycontrol.push(formAddress);
      console.log(formAddress);
    }

  }
  ngAfterViewInit() {
    console.log('Starting adddress list onViewInit');
    this.processSummaries(this.errorSummaryChildList);
    this.errorSummaryChildList.changes.subscribe(list => {
      this.processSummaries(list);
    });
  }

  /**
   * Updates the error list to include the error summaries. Messages upwards
   * @param {QueryList<ErrorSummaryComponent>} list
   */
  private processSummaries(list: QueryList<ErrorSummaryComponent>): void {
    if (list.length > 1) {
      console.warn('Address List found >1 Error Summary ' + list.length);
    }
    this.errorSummaryChild = list.first;
    this._emitErrors();
  }


  ngDoCheck() {
    this._syncCurrentExpandedRow();
  }

  /**
   *
   * @private syncs the address details record with the reactive model. Uses view child functionality
   */
  _syncCurrentExpandedRow() {
    const rowNum = this.expander.getExpandedRow();
    //used to sync the expander with the details
    //TODO will prevrow work with the delete scenario && this.prevRow !== rowNum
    if (rowNum > -1 && this.prevRow!=rowNum) {
      console.log("####### Synching current row...")
      const mycontrol = <FormArray>this.addressListForm.controls['addresses'];
      this.companyAddressChild.adressFormRecord = <FormGroup> mycontrol.controls[rowNum];
      this.updateAddressDetails++;
      this.prevRow = rowNum;
    } else {
      //do nothing?
    }
  }

  /**
   * Processes change events from inputs
   * @param {SimpleChanges} changes
   */
  ngOnChanges(changes: SimpleChanges) {
    if (changes['saveRecord']) {
      this.saveAddressRecord(changes['saveRecord'].currentValue);
    }
  }

  public isValid(override: boolean=false): boolean {
    if (override) {
      return true;
    }
    if(this.companyAddressChild && this.companyAddressChild.adressFormRecord) {
      return (this.addressListForm.valid && !this.companyAddressChild.adressFormRecord.dirty);
    }
    return (this.addressListForm.valid);
  }

  public addAddress(): void {
    // add address to the list
    this.expander.collapseTableRows(); //if you don't do this view will not work properly
    let mycontrol = <FormArray>this.addressListForm.controls['addresses'];

    let formAddress = this.initAddress(true);
    mycontrol.push(formAddress);
    this.addRecordMsg++;
    this.companyAddressChild.adressFormRecord = <FormGroup> mycontrol.controls[mycontrol.length - 1];
    this.updateAddressDetails++;
    this.newRecordInd = true;
  }


  public initAddress(skipIndex: boolean = false): FormGroup {

    // initialize our address
    let indexValue = -1;
    if (!skipIndex) {
      indexValue = this.service.getNextIndex();
    }

    return this._fb.group({
      id: [indexValue, Validators.min(0)],
      address: [null, Validators.required],
      city: [null, Validators.required]
    });
  }

  /**
   * Removes an address FormGroup from the UI
   * @param {number} i
   */
  public removeAddress(i: number): void {
    // remove address from the list
    const control = <FormArray>this.addressListForm.controls['addresses'];
    control.removeAt(i);
  }

  /**
   * Saves the record to the list. If new adds to the end of the list. Does no error Checking
   * @param record
   */
  public saveAddressRecord(record): void {

    if(!record){
      this.showErrorSummary=true;
      //set the focus
      //this.errorSummaryChild.nativeElement.focus(); //TODO this seems bad
      return;
    }
    let modelAddresses = this.service.getAddresses();
    let addressModel = this.service.getAddressModel();
    addressModel.id = record.controls.id.value;
    addressModel.address = record.controls.address.value;
    addressModel.city = record.controls.address.value;
    let resultId = this.service.saveAddress(addressModel);
    record.controls.id.setValue(resultId);
    this.companyAddressChild.adressFormRecord.markAsPristine();
    this.expander.collapseTableRows();
    this.showErrorSummary=false;
  }

  /**
   * Sets the address details controls form to a given row
   * @param row
   */
  public getRow(row): void {
    if (row > -1) {
      console.log("####### Getting Row...")
      let mycontrol = <FormArray>this.addressListForm.controls['addresses'];
      this.companyAddressChild.adressFormRecord = <FormGroup> mycontrol.controls[row];
      this.updateAddressDetails++;
    } else {
      console.info('Address List row number is ' + row);
    }
  }

  /**
   * Returns a model json object for a given record id
   * @param id
   * @returns {Json}
   * @private
   */
  private _getModelAddress(id) {
    const modelList = this.service.getAddresses();
    for (let i = 0; i < modelList.length; i++) {
      if (modelList[i].id === id) {
        return modelList[i];
      }
    }
    return null;
  }

  /**
   *  Updates the error list
   * @param errs
   */
  updateErrorList(errs) {
    this.errorList = errs;
    this._emitErrors(); //needed or will generate a valuechanged error
  }

  /***
   * Emits errors to higher level error summaries. Used for linking summaries
   * @private
   */
  private _emitErrors(): void {
    let emitErrors = [];
    if (this.errorSummaryChild) {
      emitErrors.push(this.errorSummaryChild);
    }
    console.log('####Emitting Errors');
    console.log(emitErrors);
    this.errors.emit(emitErrors);
  }

  _getFormAddress(id): FormGroup {
    const addressList = <FormArray>this.addressListForm.controls['addresses'];
    for (let i = 0; i < addressList.controls.length; i++) {
      let temp = <FormGroup> addressList.controls[i];
      if (temp.controls.id.value === id) {
        return temp;
      }
    }
    return null;
  }

  /***
   * Loads the last saved version of the record data
   * @param record
   */
  public revertAddress(record):void {
    let recordId = record.controls.id.value;
    let modelRecord = this._getModelAddress(recordId);
    console.log(modelRecord);
    //assume if it is not on the list it is null
    if (!modelRecord) {
      modelRecord = this.service.getAddressModel();
    }
    let rec = this._getFormAddress(recordId);
    rec.controls.address.setValue(modelRecord.address);
    rec.controls.city.setValue(modelRecord.city);
    this.companyAddressChild.adressFormRecord.markAsPristine();
  }

  public deleteAddress(id):void {
    const serviceResult = this.service.deleteModelAddress(id); ///TODO check result? There is a use case for no model?
    let addressList = <FormArray>this.addressListForm.controls['addresses'];
    for (let i = 0; i < addressList.controls.length; i++) {
      let temp = <FormGroup> addressList.controls[i];
      if (temp.controls.id.value === id) {
        addressList.removeAt(i);
      }
      this.deleteRecordMsg++;
      this.expander.collapseTableRows();
      this.prevRow = -1;
    }
  }

}
