import {
  Component, OnInit, Input, ViewChild, SimpleChanges, OnChanges, ViewChildren, QueryList, EventEmitter, Output,
  AfterViewInit, ChangeDetectionStrategy
} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';

import {ErrorSummaryComponent} from '../error-msg/error-summary/error-summary.component';
import {CompanyAddressRecordComponent} from '../address/company-address-record/company-address-record.component';
import {CompanyAddressRecordService} from '../address/company-address-record/company-address-record.service';
import {AddressListService} from './address-list.service';
import {ListOperations} from '../list-operations';

@Component({
  selector: 'address-list',
  templateUrl: './address.list.component.html',
  styleUrls: ['./address.list.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddressListComponent extends ListOperations implements OnInit, OnChanges, AfterViewInit {
  @Input('group') public addresses: FormArray;
  @Input() public saveAddress;
  @Input() public showErrors: boolean = false;
  @Output() public errors = new EventEmitter();

  //@ViewChild(ExpanderComponent) expander: ExpanderComponent;
  @ViewChild(CompanyAddressRecordComponent) companyAddressChild: CompanyAddressRecordComponent;
  @ViewChildren(ErrorSummaryComponent) errorSummaryChildList: QueryList<ErrorSummaryComponent>;

  private errorSummaryChild = null;
  //private prevRow = -1;
  public updateAddressDetails: number = 0;
  public newRecordInd = false;
  public addressListForm: FormGroup;
  public newAddressForm: FormGroup;
  public service: AddressListService;
  public addRecordMsg = 0;
  public deleteRecordMsg = 0;
  public errorList = [];
  //public showErrorSummary: boolean = false;
  public dataModel = [];
  //public newRecordIndicator:boolean;
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
    super();
    this.service = new AddressListService();
    this.dataModel = this.service.getModelRecordList();
  }

  ngOnInit() {
    // this.service.setExpander(this.expander);
    this.addressListForm = this._fb.group({
      addresses: this.addresses
    });
    this.dataModel = this.service.getModelRecordList();
    this._loadAddressListData();

  }

  ngAfterViewInit() {
    console.log('Starting adddress list onViewInit');
    this.service.setExpander(this.expander);
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

    let addressDataList = this.service.getModelRecordList();
    const mycontrol = <FormArray>this.addressListForm.controls['addresses'];
    //TODO temp setting some initial data
    for (let i = 0; i < addressDataList.length; i++) {
      let formAddressRecord = this.service.getAddressFormRecord(this._fb);
      this.service.addressDataToForm(addressDataList[i], formAddressRecord);
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
    console.log('AddressList process Summaries');
    this.errorSummaryChild = list.first;
    this.service.setErrorSummary(this.errorSummaryChild);
    console.log(this.errorSummaryChild);
    this._emitErrors();
  }


  ngDoCheck() {
    // let mycontrol = <FormArray>this.addressListForm.controls['addresses'];
    //this.service.setExpander(this.expander);
    // this.companyAddressChild.adressFormRecord = <FormGroup> mycontrol.controls[rowNum];
    // console.log(mycontrol);
    //this.service.setExpander(this.expander);
    this._syncCurrentExpandedRow();
  }

  /**
   *
   * @private syncs the address details record with the reactive model. Uses view child functionality
   */
  _syncCurrentExpandedRow() {
    let addressFormList = <FormArray>this.addressListForm.controls['addresses'];
    console.log(this.companyAddressChild);
    if (this.companyAddressChild) {
      let result = this.syncCurrentExpandedRow(addressFormList);
      if (result) this.companyAddressChild.adressFormRecord = result;
      this.updateAddressDetails++;
    } else {
      console.log('There is no company address child');
    }
  }

  /**
   * Processes change events from inputs
   * @param {SimpleChanges} changes
   */
  ngOnChanges(changes: SimpleChanges) {
    if (changes['saveAddress']) {
      this.saveAddressRecord(changes['saveAddress'].currentValue);
    }
  }

  public isValid(override: boolean = false): boolean {
    if (override) {
      return true;
    }
    if (this.newRecordInd) {
      return false;
    }
    else if (this.companyAddressChild && this.companyAddressChild.adressFormRecord) {
      return (this.addressListForm.valid && !this.companyAddressChild.adressFormRecord.dirty);
    }
    return (this.addressListForm.valid);
  }

  public getFormAddressList(): FormArray {

    return <FormArray>(this.addressListForm.controls['addresses']);
  }

  public addAddress(): void {

    // add address to the list
    //this.expander.collapseTableRows(); //if you don't do this view will not look right
    console.log('adding an address');
    let addressFormList = this.getFormAddressList();
    let formAddress = CompanyAddressRecordService.getReactiveModel(this._fb);
    this.service.addRecord(formAddress, addressFormList);
    this.newRecordIndicator = true;
    console.log('!!!!NewRecord indicator ' + this.getNewRecordInd());
    // mycontrol.push(formAddress);
    //this.companyAddressChild.adressFormRecord = <FormGroup> mycontrol.controls[mycontrol.length - 1];
    //set the reactive form model to the correct compoenent instance
    this.newAddressForm = <FormGroup> addressFormList.controls[addressFormList.length - 1];
    // this.newRecordInd = true;
    //this.newRecordIndicator=true;

  }


  /**
   * Removes an address FormGroup from the UI
   * @param {number} i
   */
  public removeAddress(id: number): void {
    // remove address from the reactive form list of recorcs
    let formList = this.getFormAddressList();
    console.log(formList);
    for (let i = 0; i < formList.controls.length; i++) {
      let form = <FormGroup> formList.controls[i];
     if (form.controls.id.value === id) {
        formList.removeAt(i);
          console.log("deleting the form adddress")
      }
    }
  }


  /**
   * Saves the record to the list. If new adds to the end of the list. Does no error Checking
   * @param record
   */
  public saveAddressRecord(record: FormGroup) {

      this.saveRecord(record,this.service);
      this.newRecordIndicator=false;
  //  let recId = this.service.saveRecord(record);
   // record.controls.id.setValue(recId); //in caae new

    /* //Case 1 no record, just show error summary, shoud never happen
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
     //this.dataModel = this.service.getAddresses();*/

  }

  /**
   * Sacves a new address record
   * @param record
   */

  /*public saveNewAddress(record){
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
  }*/


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
    if (this.errorList) {
      emitErrors = this.errorList;
    }
    if (this.errorSummaryChild) {
      console.log('AddressList: Threre is a summary child');
      emitErrors.push(this.errorSummaryChild);
    }
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

    let modelRecord = this.service.getModelRecord(recordId);
    if (!modelRecord) {
      modelRecord = this.service.getAddressModel();
    }
    let rec = this._getFormAddress(recordId);
    if (rec) {

      CompanyAddressRecordService.mapDataModelFormModel(modelRecord, rec);
    } else {
      console.warn('AddressList:rec is null');
    }
  }

  public deleteAddress(id): void {


    // const serviceResult = this.service.deleteModelAddress(id); ///TODO check result? There is a use case for no model?
    let addressList = <FormArray>this.addressListForm.controls['addresses'];

    this.deleteRecord(id,addressList,this.service);

    //this.service.deleteModelRecord(id);
    this.newRecordIndicator = false;
    //this.removeAddress(id);
    this.deleteRecordMsg++;
    /* for (let i = 0; i < addressList.controls.length; i++) {
      let temp = <FormGroup> addressList.controls[i];
      if (temp.controls.id.value === id) {
        addressList.removeAt(i);
      }
      this.deleteRecordMsg++;
      this.expander.collapseTableRows();
      this.prevRow = -1;
      this.newRecordInd=false;
    }*/
  }

}
