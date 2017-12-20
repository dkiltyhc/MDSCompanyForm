import {Component, OnInit,ViewChild} from '@angular/core';
import {CompanyData} from './company.interfaces';
import {Validators, FormGroup, FormArray, FormBuilder} from '@angular/forms';
import {AddressDetailsComponent} from './address/address.details.component';
import {ExpanderComponent} from './expander.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent  implements OnInit {
  title = 'App component';
  indexId=0;
  public myForm: FormGroup; // our form model
  @ViewChild(ExpanderComponent) expander:ExpanderComponent;
  @ViewChild(AddressDetailsComponent) addressDetailsChild:AddressDetailsComponent;

// we will use form builder to simplify our syntax
  constructor(private _fb: FormBuilder) { }

  ngOnInit() {
    this.myForm = this._fb.group({
      name: ['', [Validators.required, Validators.minLength(5)]],
      addresses: this._fb.array([])

    });
    this.addAddress();

    // add address

    /* subscribe to addresses value changes */
    // this.myForm.controls['addresses'].valueChanges.subscribe(x => {
    //   console.log(x);
    // })
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

  addAddress() {
    // add address to the list
    const mycontrol = <FormArray>this.myForm.controls['addresses'];
    mycontrol.push(this.initAddress());
   this.addressDetailsChild.adressForm=<FormGroup> mycontrol.controls[mycontrol.controls.length-1];
    this.expander.addDataRow();
    this.expander.selectTableRow(mycontrol.length-1);
   //console.log(mycontrol.length);
  // console.log(mycontrol);
  }

  removeAddress(i: number) {
    // remove address from the list
    const control = <FormArray>this.myForm.controls['addresses'];
    control.removeAt(i);
  }


  save(model: CompanyData) {
    // call API to save customer
    //console.log(model);
  }

  ngDoCheck() {
   const rowNum =this.expander.getExpandedRow();
   if(rowNum>-1) {
     const mycontrol = <FormArray>this.myForm.controls['addresses'];
     this.addressDetailsChild.adressForm = <FormGroup> mycontrol.controls[rowNum];
   }
  }

}
