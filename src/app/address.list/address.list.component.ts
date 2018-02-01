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
  styleUrls: ['./address.list.component.css']

})
export class AddressListComponent extends ListOperations implements OnInit, OnChanges, AfterViewInit {
  @Input('group') public addresses: FormArray;
  @Input() public saveAddress;
  @Input() public showErrors: boolean = false;
  @Output() public errors = new EventEmitter();

  @ViewChild(CompanyAddressRecordComponent) companyAddressChild: CompanyAddressRecordComponent;
  @ViewChildren(ErrorSummaryComponent) errorSummaryChildList: QueryList<ErrorSummaryComponent>;

  private errorSummaryChild = null;
  //private prevRow = -1;
  public updateAddressDetails: number = 0;
  public addressListForm: FormGroup;
  public newAddressForm: FormGroup;
  public service: AddressListService;
  public addRecordMsg = 0;
  public deleteRecordMsg = 0;
  public errorList = [];
  public dataModel = [];
  public validRec=true;
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
    this.addressListForm = this._fb.group({
      addresses: this.addresses
    });
    this.dataModel = this.service.getModelRecordList(); //TODO this is temporary. Normally respond to events
    this._loadAddressListData();

  }

  ngAfterViewInit() {
    this.setExpander(this.expander);
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
    const mycontrol = this.getFormAddressList();
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
    this.isValid();
    this._syncCurrentExpandedRow();
  }

  /**
   *
   * @private syncs the address details record with the reactive model. Uses view child functionality
   */
  private _syncCurrentExpandedRow():void {
    if (this.companyAddressChild) {
      let addressFormList = this.getFormAddressList();
      let result = this.syncCurrentExpandedRow(addressFormList);
      //Onlu update the results if there is a change. Otherwise the record will not be dirty

      if (result) {
        this.companyAddressChild.adressFormRecord = result;
        this.updateAddressDetails++;
      }
    } else {
      console.warn('There is no company address child');
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
    if (this.newRecordIndicator) {
      this.validRec=false;
      return false;
    }
    else if (this.companyAddressChild && this.companyAddressChild.adressFormRecord) {
      this.validRec=this.addressListForm.valid && !this.companyAddressChild.adressFormRecord.dirty;
      return (this.addressListForm.valid && !this.companyAddressChild.adressFormRecord.dirty);
    }
    this.validRec=this.addressListForm.valid;
    return (this.addressListForm.valid);
  }

  public getFormAddressList(): FormArray {

    return <FormArray>(this.addressListForm.controls['addresses']);
  }

  /**
   * returns an address record with a given id
   * @param {number} id - the identifier for that address record
   * @returns {FormGroup} -the address record, null if theere is no match
   * @private
   */
  private _getFormAddress(id:number): FormGroup {
    let addressList = this.getFormAddressList();
    return this.getRecord(id,addressList);
  }

  /**
   * Adds an address UI record to the address List
   */
  public addAddress(): void {

    // add address to the list
    console.log('adding an address');
    // 1. Get the list of reactive form Records
    let addressFormList = this.getFormAddressList();
    //2. Get a blank Form Model for the new record
    let formAddress = CompanyAddressRecordService.getReactiveModel(this._fb);
    //3. Add the form record using the super class. New form is addded at the end
    this.addRecord(formAddress, addressFormList);
    // 4. Set the new form to the new address form reference.
    this.newAddressForm = <FormGroup> addressFormList.controls[addressFormList.length - 1];

  }

  /**
   * Saves the record to the list. If new adds to the end of the list. Does no error Checking
   * @param record
   */
  public saveAddressRecord(record: FormGroup) {
      this.saveRecord(record,this.service);
  }

  /**
   * Sets the address details controls form to a given row (not an id)
   * @param row
   */
  public getRow(row): void {
    if (row > -1) {
      let mycontrol = this.getFormAddressList();
      this.companyAddressChild.adressFormRecord = <FormGroup> mycontrol.controls[row];
      this.updateAddressDetails++;
    } else {
      console.info('Address List row number is ' + row);
    }
  }

  /**
   *  Updates the error list
   * @param errs - the list of errors to broadcast
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
      emitErrors.push(this.errorSummaryChild);
    }
    this.errors.emit(emitErrors);
  }




  /***
   * Loads the last saved version of the record data
   * @param record
   */
  public revertAddress(record): void {
    let recordId = record.controls.id.value;

    let modelRecord = this.service.getModelRecord(recordId);
    //IF a new record, there will be no id in the model
    if (!modelRecord) {
      modelRecord = this.service.getAddressModel();
    }
    let rec = this._getFormAddress(recordId);
    if (rec) {
      CompanyAddressRecordService.mapDataModelFormModel(modelRecord, rec);
    } else {
      //should never happen, there should always be a UI record
      console.warn('AddressList:rec is null');
    }
  }

  /**
   * Deletes a record from the UI list and the model list, if it exists
   * @param id
   */
  public deleteAddress(id): void {
    let addressList = this.getFormAddressList();
    this.deleteRecord(id,addressList,this.service);
    this.deleteRecordMsg++;
  }


}
