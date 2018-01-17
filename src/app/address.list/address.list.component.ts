import {Component, OnInit, Input, ViewChild, SimpleChanges, OnChanges, ViewChildren, QueryList, EventEmitter, Output} from '@angular/core';
import {Form, FormArray, FormControl, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ExpanderComponent} from '../expander.component';
import {AddressDetailsComponent} from '../address/address.details.component';
import {CompanyModelService} from '../company.model.service';
import {ControlMessagesComponent} from '../control-messages.component/control-messages.component';

@Component({
  selector: 'address-list',
  templateUrl: './address.list.component.html',
  styleUrls: ['./address.list.component.css']
})
export class AddressListComponent implements OnInit, OnChanges {
  @Input('group') public addresses: FormArray;
  @Input() public saveRecord2;
  @Output() public errors=new EventEmitter();

  @ViewChild(ExpanderComponent) expander: ExpanderComponent;
  @ViewChild(AddressDetailsComponent) addressDetailsChild: AddressDetailsComponent;
  @ViewChildren(AddressDetailsComponent) addressDetailsList: QueryList<AddressDetailsComponent>

  private prevRow = -1;
  public updateAddressDetails: number = 0;
  public newRecordInd = false;
  public addressListForm: FormGroup;
  public service: CompanyModelService;
  public addRecordMsg = 0;
  public deleteRecordMsg=0;
  private errorList=[];
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

    for (let i = 0; i < addressDataList.length; i++) {
      let formAddress = this.initAddress(true);
      formAddress.controls.city.setValue(addressDataList[i].city);
      formAddress.controls.address.setValue(addressDataList[i].address);
      formAddress.controls.id.setValue(addressDataList[i].id);
      mycontrol.push(formAddress);
      console.log(formAddress);
    }


  }
  ngOnViewInit(){




    this.addressDetailsList.changes.subscribe(list => {
      list.forEach(writer => console.log(writer));
    })


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
    if (rowNum > -1 ) {
      const mycontrol = <FormArray>this.addressListForm.controls['addresses'];
      this.addressDetailsChild.adressFormRecord = <FormGroup> mycontrol.controls[rowNum];
      this.updateAddressDetails++;
      this.prevRow = rowNum;
    }else{

    }
  }

  ngOnChanges(changes: SimpleChanges) {

    if (changes['saveRecord2']) {
      this.saveAddressRecord(changes['saveRecord'].currentValue);
    }
  }

  isValid(override: boolean) {
    if (override) {
      return true;
    }
    return this.addressListForm.valid;
  }

  addAddress() {
    // add address to the list
    this.expander.collapseTableRows(); //if you don't do this view will not work properly
    let mycontrol = <FormArray>this.addressListForm.controls['addresses'];

      let formAddress=this.initAddress(true);
      mycontrol.push(formAddress);
      this.addRecordMsg++;
    this.addressDetailsChild.adressFormRecord = <FormGroup> mycontrol.controls[mycontrol.length-1];
    this.updateAddressDetails++;
    this.newRecordInd = true;
  }



  initAddress(skipIndex:boolean=false) {

    // initialize our address
    let indexValue=-1;
    if(!skipIndex) {
      indexValue= this.service.getNextIndex();
    }

    return this._fb.group({
      id: [indexValue, Validators.min(0)],
      address: [null, Validators.required],
      city: [null,Validators.required]
    });
  }

  removeAddress(i: number) {
    // remove address from the list
    const control = <FormArray>this.addressListForm.controls['addresses'];
    control.removeAt(i);
  }

  /**
   * Saves the record to the list. If new adds to the end of the list
   * @param record
   */
  saveAddressRecord(record) {
    //const addressList = <FormArray>this.addressListForm.controls['addresses'];
    let modelAddresses=this.service.getAddresses();
    let addressModel=this.service.getAddressModel();
    addressModel.id=record.controls.id.value;
    addressModel.address=record.controls.address.value;
    addressModel.city=record.controls.address.value;
    let resultId=this.service.saveAddress(addressModel);
    record.controls.id.setValue(resultId);
    this.addressDetailsChild.adressFormRecord.markAsPristine();
    this.expander.collapseTableRows();

  }

  /**
   * Gets a
   * @param row
   */
  getRow(row){
    if(row>-1){
      let mycontrol = <FormArray>this.addressListForm.controls['addresses'];
      this.addressDetailsChild.adressFormRecord = <FormGroup> mycontrol.controls[row];
      this.updateAddressDetails++;
    }else{
      console.info("Address List row number is "+row);
    }
  }

  _getModelAddress(id){
    const modelList=this.service.getAddresses();

    for (let i = 0; i < modelList.length; i++) {
      if(modelList[i].id===id){
        return modelList[i];
      }
    }

    return null;
  }
  updateErrorList(errs){

    this.errorList=errs;
    this.errors.emit(errs);
    console.log(this.errorList);
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
  revertAddress(record) {
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
    this.addressDetailsChild.adressFormRecord.markAsPristine();
  }

  deleteAddress(id) {

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
