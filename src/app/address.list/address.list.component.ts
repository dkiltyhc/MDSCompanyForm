import {
  Component, OnInit, Input, ViewChild, SimpleChanges, OnChanges, ViewChildren, QueryList, EventEmitter, Output,
  AfterViewInit, ChangeDetectionStrategy
} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ExpanderComponent} from '../expander.component';

import {CompanyModelService} from '../company.model.service';
import {ErrorSummaryComponent} from '../error-msg/error-summary/error-summary.component';
import {CompanyAddressRecordComponent} from '../address/company-address-record/company-address-record.component';
import {CompanyAddressRecordService} from '../address/company-address-record/company-address-record.service';

@Component({
  selector: 'address-list',
  templateUrl: './address.list.component.html',
  styleUrls: ['./address.list.component.css']
})
export class AddressListComponent implements OnInit, OnChanges, AfterViewInit {
  @Input('group') public addresses: FormArray;
  @Input() public saveRecord;
  @Input() public showErrors: boolean = false;
  @Output() public errors = new EventEmitter();

  @ViewChild(ExpanderComponent) expander: ExpanderComponent;
  @ViewChild(CompanyAddressRecordComponent) companyAddressChild: CompanyAddressRecordComponent;
  @ViewChildren(ErrorSummaryComponent) errorSummaryChildList: QueryList<ErrorSummaryComponent>;

  private errorSummaryChild = null;
  private prevRow = -1;
  public updateAddressDetails: number = 0;
  public newRecordInd = false;
  public addressListForm: FormGroup;
  public newAddressForm:FormGroup;
  public service: CompanyModelService;
  public addRecordMsg = 0;
  public deleteRecordMsg = 0;
  public errorList = [];
  public showErrorSummary: boolean = false;
  public dataModel = [];
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
    this.dataModel = this.service.getAddresses();
  }

  ngOnInit() {
    this.addressListForm = this._fb.group({
      addresses: this.addresses
    });
    this.dataModel = this.service.getAddresses();
    this._loadAddressListData();
  }

  ngAfterViewInit() {
    console.log('Starting adddress list onViewInit');
    this.processSummaries(this.errorSummaryChildList);
    this.errorSummaryChildList.changes.subscribe(list => {
      this.processSummaries(list);
    });
  }


  /***
   * Loads the model data for the addresss into the form Model
   * @private
   */
  private _loadAddressListData() {

    let addressDataList = this.service.getAddresses();
    const mycontrol = <FormArray>this.addressListForm.controls['addresses'];
    //TODO temp setting some initial data
    for (let i = 0; i < addressDataList.length; i++) {
      let formAddressRecord=this.service.getAddressFormRecord(this._fb);
      this.service.addressDataToForm(addressDataList[i],formAddressRecord);
      mycontrol.push(formAddressRecord);
    }
  }


  /**
   * Updates the error list to include the error summaries. Messages upwards
   * @param {QueryList<ErrorSummaryComponent>} list
   */
  private processSummaries(list: QueryList<ErrorSummaryComponent>): void {
    if (list.length > 1) {
      console.warn('Address List found >1 Error Summary ' + list.length);
    }
    console.log("AddressList process Summaries");
    this.errorSummaryChild = list.first;
    console.log(this.errorSummaryChild)
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
    if (rowNum > -1 && this.prevRow !== rowNum) {
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

  public isValid(override: boolean = false): boolean {

    console.log(this.newAddressForm);
    if (override) {
      return true;
    }if (this.newAddressForm){
      console.log("There is an new Address Form")
      return false;
    }
    else if (this.companyAddressChild && this.companyAddressChild.adressFormRecord) {
      return (this.addressListForm.valid && !this.companyAddressChild.adressFormRecord.dirty);
    }
    return (this.addressListForm.valid);
  }

  public addAddress(): void {
    // add address to the list
    this.expander.collapseTableRows(); //if you don't do this view will not look right
    let mycontrol = <FormArray>this.addressListForm.controls['addresses'];
    let formAddress = CompanyAddressRecordService.getReactiveModel(this._fb);
    mycontrol.push(formAddress);
    this.companyAddressChild.adressFormRecord = <FormGroup> mycontrol.controls[mycontrol.length - 1];
    this.newAddressForm= <FormGroup> mycontrol.controls[mycontrol.length - 1];
    this.newRecordInd = true;
  }

  /**
   * Removes an address FormGroup from the UI
   * @param {number} i
   */
  public removeAddress(i: number): void {
    // remove address from the reactive form list of recorcs
    const control = <FormArray>this.addressListForm.controls['addresses'];
    control.removeAt(i);
  }

  /**
   * Saves the record to the list. If new adds to the end of the list. Does no error Checking
   * @param record
   */
  public saveAddressRecord(record): FormGroup {

    //Case 1 no record, just show error summary, shoud never happen
    if (!record) {
      this.showErrorSummary = true;
      return;
    }
    //Case 2 a new record, save a new model record.
    //TODO should we be checking the record Id? or rely on the indicator
    if(this.newRecordInd ||record.controls.id.value<0) {
      this.saveNewAddress(record);
      this.newAddressForm=null;
      return;
    }
    //case 3 an existing record. Update the model
    let resultId = this.service.saveAddress(record);
    this.showErrorSummary = false;
    this.expander.collapseTableRows()
    this.dataModel = this.service.getAddresses();

  }

  /**
   * Sacves a new address record
   * @param record
   */
  public saveNewAddress(record){
    if (!record) {
      this.showErrorSummary = true;
      return;
    }
    console.log("Writing to the model")
    let resultId = this.service.saveAddress(record);
    record.controls.id.setValue(resultId);
    this.showErrorSummary = false;
    this.dataModel = this.service.getAddresses();
    this.newRecordInd = false;
  }


  /**
   * Sets the address details controls form to a given row
   * @param row
   */
  public getRow(row): void {
    if (row > -1) {
      console.log('####### Getting Row...');
      let mycontrol = <FormArray>this.addressListForm.controls['addresses'];
      this.companyAddressChild.adressFormRecord = <FormGroup> mycontrol.controls[row];
      this.updateAddressDetails++;
    } else {
      console.info('Address List row number is ' + row);
    }
  }


  /**
   *  Updates the error list
   * @param errs
   */
  updateErrorList(errs) {
    console.log("Adddress List: Updating the errors")
    this.errorList = errs;
    this._emitErrors(); //needed or will generate a valuechanged error
  }

  /***
   * Emits errors to higher level error summaries. Used for linking summaries
   * @private
   */
  private _emitErrors(): void {
    let emitErrors = [];

    //adding the child errors
    if(this.errorList){
      emitErrors=this.errorList;
    }
    if (this.errorSummaryChild) {
      console.log("AddressList: Threre is a summary child")
      emitErrors.push(this.errorSummaryChild);
    }
    console.log(this.errorSummaryChild)
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
  public revertAddress(record): void {
    let recordId = record.controls.id.value;
    let modelRecord =   this.service.getModelAddress(recordId);
    if (!modelRecord) {
      modelRecord = this.service.getAddressModel();
    }
    let rec = this._getFormAddress(recordId);
    if (rec) {
      let addressDetails:FormGroup=<FormGroup>rec.controls.addressDetails;
      addressDetails.controls.address.setValue(modelRecord.address);
      addressDetails.controls.city.setValue(modelRecord.city);
      addressDetails.controls.country.setValue([modelRecord.country]);
      this.companyAddressChild.adressFormRecord.markAsPristine();
    } else {
      console.warn('AddressList:rec is null');
    }
  }

  public deleteAddress(id): void {
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
      this.newRecordInd=false;
    }
  }

}
