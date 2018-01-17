import {Component, Input, Output, OnInit, SimpleChanges, OnChanges, EventEmitter, ViewChildren, QueryList} from '@angular/core';
import { FormGroup, Validators, FormBuilder} from '@angular/forms';
import {ControlMessagesComponent} from '../control-messages.component/control-messages.component';



@Component({
  selector: 'address-details',
  templateUrl: 'address.details.component.html'
})

/**
 * Sample component is used for nothing
 */
export class AddressDetailsComponent implements OnInit, OnChanges {

  @Input('group')
  public adressFormRecord: FormGroup;
  public adressFormLocalModel: FormGroup;
  @Input ()  detailsChanged:number;
  @Output () saveRecord =new EventEmitter() ;
  @Output () revertRecord =new EventEmitter() ;
  @Output () deleteRecord =new EventEmitter() ;
  @Output () errorList =new EventEmitter() ;

  @Output() createRecord; //TODO don't know if needed
  @ViewChildren(ControlMessagesComponent) msgList: QueryList<ControlMessagesComponent>

  @Input() formType:string;


  constructor(private _fb: FormBuilder) {

  }

  ngOnInit() {
    console.log(this.adressFormRecord);
    console.log(this.adressFormLocalModel);
    if(!this.adressFormLocalModel) {
      this.adressFormLocalModel = this.initAddress();
    }else{
     // this.setToLocalModel();
    }
    this.detailsChanged=0;

  }
  ngAfterViewInit() {

    this.msgList.changes.subscribe(errorObjs => {
      console.log("There are errors changed in the address details")

      let temp=[];
      errorObjs.forEach(

        error =>{
            temp.push(error)
        }
      )
      this.errorList.emit(temp);
    })

  }


  ngOnChanges(changes: SimpleChanges){

    console.log("There have been changes to details");

    if(changes['detailsChanged']){ //used as a change indicator for the model
      console.log("copying the adressFormLocalModel ");
      console.log(this.adressFormRecord);
      if(this.adressFormRecord) {
        this.setToLocalModel();
      }else{
        this.adressFormLocalModel = this.initAddress();
        console.warn("There was no model, not updating")

      }
    }

  }
   setToLocalModel(){

     this.adressFormLocalModel=this.adressFormRecord;
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
      city: [null, Validators.required]
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

