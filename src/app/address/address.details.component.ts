import {Component, Input,Output, OnInit, DoCheck, SimpleChanges,OnChanges,EventEmitter} from '@angular/core';
import { FormGroup, Validators, FormBuilder} from '@angular/forms';
import * as _ from "lodash";
import {IAddressData}  from '../data-models/address-data';


@Component({
  selector: 'address-details',
  templateUrl: 'address.details.component.html'
})

/**
 * Sample component is used for nothing
 */
export class AddressDetailsComponent implements DoCheck, OnInit, OnChanges {

  @Input('group')
  public adressFormRecord: FormGroup;
  public adressFormLocalModel: FormGroup;
  @Input ()  detailsChanged:number;
  @Output () saveRecord =new EventEmitter() ;
/*  @Output('addStudentEvent')
  addStdEvent = new EventEmitter<Student>();*/

  @Output() createRecord; //TODO don't know if needed
  public index=-1;
  @Input('index') public ind;
  @Input() formType:string;


  constructor(private _fb: FormBuilder) {

  }

  ngOnInit() {
    console.log(this.adressFormRecord);
    if(!this.adressFormRecord) {
      this.adressFormLocalModel = this.initAddress();
    }
    this.detailsChanged=0;
  }

  ngDoCheck() {
    //console.log(this.adressFormRecord)
    //console.log("Thisis "+this.detailsChanged)
  }

  ngOnChanges(changes: SimpleChanges){

    console.log("There have been changes");

    if(changes['detailsChanged']){
      console.log(changes['detailsChanged']);
      console.log("copying the adressFormLocalModel ");

      //TODO this deep copy works! needs a save
     // this.adressFormLocalModel=_.cloneDeep(this.adressFormRecord);
      this.adressFormLocalModel=(this.adressFormRecord);
    }

  }

  /**
   * Changes the local model back to the last saved version of the address
   */
  revertAddress(){
    this.adressFormLocalModel=this.adressFormRecord;
  }

  /**
   * Intializes a local model for address. This is needed otherwise the component will fail since we are implementing reactive forms
   * @returns {FormGroup}
   */
  initAddress() {

    return this._fb.group({
      id: -1,
      address: ['', Validators.required],
      city: ['']
    });
  }

    saveAddressRecord(){
    // this.saveRecord=_.cloneDeep(this.adressFormLocalModel);

      this.saveRecord.emit(_.cloneDeep(this.adressFormLocalModel));
     console.log(this.saveRecord);
  }

}

