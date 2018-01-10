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
  //@ViewChildren(AddressDetailsComponent) addressDetailsChild: AddressDetailsComponent;
  // public addressListForm: FormGroup; // our form model
  private prevRow = -1;
  private updateAddressDetails: number = 0;
  public newRecordInd = false;
  public addressListForm: FormGroup;
  private service: CompanyModelService;
  private addRecordMsg=0;
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
    console.log('Service...');
    console.log(this.service.getAddresses());
  }

  ngOnInit() {

    //if(!this.addressListForm) {
    this.addressListForm = this._fb.group({
      addresses: this.addresses
    });
    var addressDataList=this.service.getAddresses();
    const mycontrol = <FormArray>this.addressListForm.controls['addresses'];

    for (var i = 0; i < addressDataList.length; i++) {
      var formAddress=this.initAddress(true);
      formAddress.controls.city.setValue(addressDataList[i].city);
      formAddress.controls.address.setValue(addressDataList[i].address);
      formAddress.controls.id.setValue(addressDataList[i].id);
      mycontrol.push(formAddress);
    }

  }

  ngDoCheck() {

    this._syncCurrentExpandedRow();
  }

  /**
   *
   * @private syncs the address details record with the reactive model. Uses view child functionality
   */
  _syncCurrentExpandedRow(){
    const rowNum = this.expander.getExpandedRow();
    //used to sync the expander with the details
    //TODO will prevrow work with the delete scenario
    if (rowNum > -1 && this.prevRow !== rowNum) {
      const mycontrol = <FormArray>this.addressListForm.controls['addresses'];
      this.addressDetailsChild.adressFormRecord = <FormGroup> mycontrol.controls[rowNum];
      this.updateAddressDetails++;
      this.prevRow = rowNum;
    }

  }
  ngOnChanges(changes: SimpleChanges) {

    if (changes['saveRecord2']) {
      this.saveAddressRecord(changes['saveRecord'].currentValue);
    }
  }

  isValid(override:boolean){
    if(override){
      return true;
    }
    return this.addressListForm.valid
  }

  addAddress() {
    // add address to the list
    const mycontrol = <FormArray>this.addressListForm.controls['addresses'];

   // for (var i = 0; i < addressDataList.length; i++) {
      var formAddress=this.initAddress(true);
     /* formAddress.controls.city.setValue('');
      formAddress.controls.address.setValue('');*/
      mycontrol.push(formAddress);
      this.addRecordMsg++;
    this.updateAddressDetails++;
    //sync the address details child
    this.addressDetailsChild.adressFormRecord = <FormGroup> mycontrol.controls[mycontrol.length-1];
    //}


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
      address: ['fff ', Validators.required],
      city: ['']
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
  _getFormAddress(id){
    const addressList = <FormArray>this.addressListForm.controls['addresses'];
    console.log(addressList)
    for(var i=0;i<addressList.length;i++){
      if(addressList[i].controls.id.value===id){
        return addressList[i];
      }
    }
  }


  revertAddress(record){
    console.log("starting the revert process"+record.controls.id.value);
    var modelRecord=this._getModelAddress(record.controls.id.value);
    console.log(modelRecord);
    //assume if it is not on the list it is null
    if(!modelRecord){
        modelRecord=this.service.getAddressModel();
    }
    //record.controls.id.value=modelRecord.id;
    var rec=this._getFormAddress(record.controls.id.value);
    rec.controls.address.value=modelRecord.address;
    rec.controls.city.value=modelRecord.city;
   //  record.controls.address.value=modelRecord.address;
   // record.controls.city.value=modelRecord.city;
  }


}
