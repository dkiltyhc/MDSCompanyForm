import {Component, Input, ViewChild, OnInit, AfterViewInit, Inject, forwardRef, AfterContentInit, DoCheck, SimpleChanges,OnChanges,KeyValueDiffers} from '@angular/core';
import {NgForm, FormArray, FormGroup, Validators, FormBuilder} from '@angular/forms';
import {AddressData} from '../company.interfaces'; // TODO do we need this as an approach

import {ValidationService} from '../validation.service';
import {ExpanderComponent} from '../expander.component';
import {init} from 'protractor/built/launcher';


@Component({
  selector: 'address-details',
  templateUrl: 'address.details.component.html'
})

/**
 * Sample component is used for nothing
 */
export class AddressDetailsComponent implements DoCheck, OnInit, OnChanges {

  @Input('group')
  public adressForm: FormGroup;
  public index=-1;
  @Input('index') public ind;
  differ: any;

  constructor(private _fb: FormBuilder) {
   // @Inject(forwardRef(() => ExpanderComponent)) private _parent: ExpanderComponent,private differs: KeyValueDiffers
    //this.parent = _parent;
    //addressForm=_parent
    //console.log(_parent.tableRowIndexCurrExpanded);


  }

  ngOnInit() {
    if(!this.adressForm) {
      this.adressForm = this.initAddress();
    }
  }

  ngAfterViewChecked() {
  }

  ngDoCheck() {
    //console.log('######################Start AddressDetals: DoCheck ' + this.parent.tableRowIndexCurrExpanded);

   // if (this.parent.tableRowIndexCurrExpanded > -1 &&this.index!==this.parent.tableRowIndexCurrExpanded ) {
     //console.log("changing the form");
     //this.adressForm = this.parent.test2[this.parent.tableRowIndexCurrExpanded];

  // }
  }

  ngOnChanges(changes: SimpleChanges){
    //console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@Changes have been made to address Details!!");
  }

  initAddress() {
    // initialize our address

    return this._fb.group({
      id: -1,
      address: ['', Validators.required],
      city: ['']
    });
  }

/*
  ngAfterViewInit() {
    console.log('After View Init' + this.parent.tableRowIndexCurrExpanded);
  }
*/

}

