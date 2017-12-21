import {Component, Input, OnInit, DoCheck, SimpleChanges,OnChanges} from '@angular/core';
import { FormGroup, Validators, FormBuilder} from '@angular/forms';
import * as _ from "lodash";



@Component({
  selector: 'address-details',
  templateUrl: 'address.details.component.html'
})

/**
 * Sample component is used for nothing
 */
export class AddressDetailsComponent implements DoCheck, OnInit, OnChanges {

  @Input('group')
  public adressForm2: FormGroup;
  public adressForm: FormGroup;
  @Input ()  detailsChanged:number;

  public index=-1;
  @Input('index') public ind;
  differ: any;

  constructor(private _fb: FormBuilder) {

  }

  ngOnInit() {
    console.log(this.adressForm2);
    if(!this.adressForm2) {
      this.adressForm = this.initAddress();
    }
    this.detailsChanged=0;
  }

  ngDoCheck() {
    //console.log(this.adressForm2)
    //console.log("Thisis "+this.detailsChanged)
  }

  ngOnChanges(changes: SimpleChanges){

    console.log("There have been changes");

    if(changes['detailsChanged']){
      console.log(changes['detailsChanged']);
      console.log("copying the adressForm ");

      //TODO this deep copy works! needs a save
     // this.adressForm=_.cloneDeep(this.adressForm2);
      this.adressForm=(this.adressForm2);
    }

  }

  initAddress() {
    // initialize our address

    return this._fb.group({
      id: -1,
      address: ['', Validators.required],
      city: ['']
    });
  }

}

