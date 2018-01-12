import {Component, OnInit, Input, ViewChild, SimpleChanges, OnChanges} from '@angular/core';
import {Form, FormArray, FormControl, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ExpanderComponent} from '../expander.component';
import {AddressDetailsComponent} from '../address/address.details.component';
import {CompanyModelService} from '../company.model.service';

@Component({
  selector: 'address-list',
  templateUrl: './address.list.component.html',
  styleUrls: ['./address.list.component.css']
})
export class AddressListComponent implements OnInit, OnChanges {
  @Input('group') public addresses: FormArray;
  @Input() public saveRecord2;
  @ViewChild(ExpanderComponent) expander: ExpanderComponent;
  @ViewChild(AddressDetailsComponent) addressDetailsChild: AddressDetailsComponent;

  private prevRow = -1;
  private updateAddressDetails: number = 0;
  public newRecordInd = false;
  public addressListForm: FormGroup;
  private service: CompanyModelService;
  private addRecordMsg = 0;
  private deleteRecordMsg=0;
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
    var addressDataList = this.service.getAddresses();
    const mycontrol = <FormArray>this.addressListForm.controls['addresses'];

    for (var i = 0; i < addressDataList.length; i++) {
      var formAddress = this.initAddress(true);
      formAddress.controls.city.setValue(addressDataList[i].city);
      formAddress.controls.address.setValue(addressDataList[i].address);
      formAddress.controls.id.setValue(addressDataList[i].id);
      mycontrol.push(formAddress);
      console.log(formAddress);
    }
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

      var formAddress=this.initAddress(true);
      mycontrol.push(formAddress);
      this.addRecordMsg++;
    this.addressDetailsChild.adressFormRecord = <FormGroup> mycontrol.controls[mycontrol.length-1];
    this.updateAddressDetails++;
    this.newRecordInd = true;
  }



  initAddress(skipIndex:boolean=false) {

    // initialize our address
    var indexValue=-1;
    if(!skipIndex) {
      indexValue= this.service.getNextIndex();
    }

    return this._fb.group({
      id: [indexValue, Validators.min(0)],
      address: [null, Validators.required],
      city: [null]
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
    var modelAddresses=this.service.getAddresses();
    console.log("SAVING ADDRESS");
    console.log(record);
    console.log(modelAddresses);
    var addressModel=this.service.getAddressModel();
    addressModel.id=record.controls.id.value;
    addressModel.address=record.controls.address.value;
    addressModel.city=record.controls.address.value;
    var resultId=this.service.saveAddress(addressModel);
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
      const mycontrol = <FormArray>this.addressListForm.controls['addresses'];
      this.addressDetailsChild.adressFormRecord = <FormGroup> mycontrol.controls[row];
      this.updateAddressDetails++;
    }else{
      console.info("Address List row number is "+row);
    }
  }

  _getModelAddress(id){
    var modelList=this.service.getAddresses();

    for (var i = 0; i < modelList.length; i++) {
      if(modelList[i].id===id){
        console.log("found a model");
        return modelList[i];
      }
    }

    return null;
  }

  _getFormAddress(id): FormGroup {
    const addressList = <FormArray>this.addressListForm.controls['addresses'];
    for (var i = 0; i < addressList.controls.length; i++) {
      var temp = <FormGroup> addressList.controls[i];
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
    console.log('starting the revert process');
    console.log(record);
    var recordId = record.controls.id.value;
    var modelRecord = this._getModelAddress(recordId);
    console.log(modelRecord);
    //assume if it is not on the list it is null
    if (!modelRecord) {
      modelRecord = this.service.getAddressModel();
    }
    var rec = this._getFormAddress(recordId);
    console.log(rec);
    rec.controls.address.setValue(modelRecord.address);
    rec.controls.city.setValue(modelRecord.city);
    this.addressDetailsChild.adressFormRecord.markAsPristine();
  }

  deleteAddress(id) {
    console.log("Starting deletion of " + id);
    //var modelRecord = this._getModelAddress(id);
    const serviceResult = this.service.deleteModelAddress(id);
    let addressList = <FormArray>this.addressListForm.controls['addresses'];
    console.log(addressList);
    for (var i = 0; i < addressList.controls.length; i++) {
      var temp = <FormGroup> addressList.controls[i];
      if (temp.controls.id.value === id) {
        console.log("Deleting record " + id);
        console.log(addressList);
        addressList.removeAt(i);
      }
      this.deleteRecordMsg++;
      this.expander.collapseTableRows();
      this.prevRow = -1;
    }
  }


}
