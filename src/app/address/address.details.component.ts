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
  @Output () revertRecord =new EventEmitter() ;
  @Output () deleteRecord =new EventEmitter() ;
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
    console.log("Address Detials docheck")
    console.log(this.adressFormRecord)
    //console.log("Thisis "+this.detailsChanged)
  }

  ngOnChanges(changes: SimpleChanges){

    console.log("There have been changes");

    if(changes['detailsChanged']){ //used as a change indicator for the model
      console.log("copying the adressFormLocalModel ");
      console.log(this.adressFormRecord);
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
      address: [null, Validators.required],
      city: [null]
    });
  }

    saveAddressRecord(){
    // this.saveRecord=_.cloneDeep(this.adressFormLocalModel);
     if( this.adressFormLocalModel.valid) {
       this.saveRecord.emit((this.adressFormLocalModel));
     }else{
       var temp=this.adressFormLocalModel.value.id;
       this.adressFormLocalModel.controls.id.setValue(1);
       if( this.adressFormLocalModel.valid){
         this.adressFormLocalModel.controls.id.setValue(temp);
         this.saveRecord.emit((this.adressFormLocalModel));
       }else{
         this.adressFormLocalModel.controls.id.setValue(temp);
       }

     }
     console.log(this.saveRecord);
  }

  revertAddressRecord(){
    this.revertRecord.emit(this.adressFormLocalModel);
    this.adressFormLocalModel.markAsPristine();
  }
  deleteAddressRecord(){
    this.deleteRecord.emit(this.adressFormLocalModel.value.id);
  }


}

