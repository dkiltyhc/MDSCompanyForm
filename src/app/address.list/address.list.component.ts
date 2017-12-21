import {Component, OnInit,Input, ViewChild} from '@angular/core';
import {Form, FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ExpanderComponent} from '../expander.component';
import {AddressDetailsComponent} from '../address/address.details.component';

@Component({
  selector: 'address-list',
  templateUrl: './address.list.component.html',
  styleUrls: ['./address.list.component.css']
})
export class AddressListComponent implements OnInit {
  @Input('group') public addresses: FormArray;
  @ViewChild(ExpanderComponent) expander: ExpanderComponent;
  @ViewChild(AddressDetailsComponent) addressDetailsChild: AddressDetailsComponent;
 // public addressListForm: FormGroup; // our form model
  private indexId: number = 0;
  private prevRow=-1;
  private updateAddressDetails:number=0;
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
      this.addressDetailsChild.adressForm2 = <FormGroup> mycontrol.controls[rowNum];
      this.updateAddressDetails++;
      this.prevRow=rowNum
    }
  }

  addAddress() {
    // add address to the list
    const mycontrol = <FormArray>this.addressListForm.controls['addresses'];
    mycontrol.push(this.initAddress());
    this.addressDetailsChild.adressForm2 = <FormGroup> mycontrol.controls[mycontrol.controls.length - 1];
    this.expander.addDataRow();
    this.expander.selectTableRow(mycontrol.length - 1);
    this.addressDetailsChild.detailsChanged++;

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



}
