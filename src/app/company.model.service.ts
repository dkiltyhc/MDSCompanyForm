import {Injectable} from '@angular/core';
import {FormGroup, Validators, FormBuilder} from '@angular/forms';

@Injectable()
export class CompanyModelService {

  private addressList = [
    {
      id: 1,
      address: 'address1',
      city: 'city1'
    },
    {
      id: 2,
      address: 'address2',
      city: 'city2'
    }

  ];
  private _indexValue=-1;


  _initIndex(){

    for(var i=0;i<this.addressList.length;i++){
      if(this.addressList[i].id>this._indexValue){
          this._indexValue=this.addressList[i].id;
        console.log("This is the index id"+this.addressList[i].id);
      }
    }
  }

  getNextIndex(){
    this._indexValue++;
    return this._indexValue;
  }
  resetIndex(){
    this._indexValue=-1;
  }

  constructor() {
    this._initIndex();
  }


  getAddresses() {
    return this.addressList;
  }

  addAddress(record) {
    //TODO error checking
    this.addressList.push(record);
  }

  getAddressModel() {
    return {
      id: -1,
      address: null,
      city: null
    };
  }

  saveAddress(record) {
    //new record. Verify the index is -1. Set it to the next index
    if(record.id===-1) {
      record.id=this.getNextIndex();
      this.addressList.push(record);
      return record.id;
    }
    for (var i = 0; i < this.addressList.length; i++){
      if (this.addressList[i].id === record.id) {
        this.addressList[i].address=record.address;
        this.addressList[i].city=record.city;
       return record.id;
      }
    }
    return -1;
  }

  getModelAddress(id) {
    var modelList = this.getAddresses();

    for (var i = 0; i < modelList.length; i++) {
      if (modelList[i].id === id) {
        return modelList[i];
      }
    }
    return null;
  }

  deleteModelAddress(id):boolean{
    var modelList = this.getAddresses();
    for (var i = 0; i < modelList.length; i++) {
      if (modelList[i].id === id) {
        this.addressList.splice(i,1);
        return true;
      }
    }
    return false
  }

}
