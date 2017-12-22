import {Component, OnInit, Input, ViewChild, SimpleChanges,OnChanges} from '@angular/core';
import {Form, FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ExpanderComponent} from '../expander.component';
import {AddressDetailsComponent} from '../address/address.details.component';

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
  private indexId: number = 0;
  private prevRow=-1;
  private updateAddressDetails:number=0;
  public newRecordInd=false;
  public addressListForm: FormGroup;

  public columnDefinitions=[
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

  }

  ngOnInit() {

    //if(!this.addressListForm) {
      this.addressListForm = this._fb.group({
        addresses: this.addresses
      });
    //}
    //this.addressListForm = this._fb.group({
    //  addresses: this._fb.array([])

    //});
    //this.addAddress();
  }

  ngDoCheck(){
    const rowNum =this.expander.getExpandedRow();
    //used to sync the expander with the details
    //TODO will prevrow work with the delete scenario
    if(rowNum>-1 && this.prevRow!==rowNum) {
      const mycontrol = <FormArray>this.addressListForm.controls['addresses'];
      this.addressDetailsChild.adressFormRecord = <FormGroup> mycontrol.controls[rowNum];
      this.updateAddressDetails++;
      this.prevRow=rowNum
    }
  }
  ngOnChanges(changes:SimpleChanges){

    if(changes['saveRecord2']){
      this.saveAddressRecord(changes['saveRecord'].currentValue);
    }
  }

  addAddress() {
    // add address to the list
    const mycontrol = <FormArray>this.addressListForm.controls['addresses'];
    mycontrol.push(this.initAddress());
    this.addressDetailsChild.adressFormRecord = <FormGroup> mycontrol.controls[mycontrol.controls.length - 1];
    this.expander.addDataRow();
    this.expander.selectTableRow(mycontrol.length - 1);
    this.addressDetailsChild.detailsChanged++;
    this.newRecordInd=true;

    //console.log(mycontrol.length);
    // console.log(mycontrol);
  }

  initAddress() {
    // initialize our address
    this.indexId++;
    return this._fb.group({
      id: [this.indexId],
      address: ['', Validators.required],
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
  saveAddressRecord(record){
    const addressList = <FormArray>this.addressListForm.controls['addresses'];

    for (var i=0;i<addressList.length;i++){
        if((addressList.at(i)).value.id===record.value.id){
          console.log("found a match "+record.value.id);
        }

    }

  }


}
