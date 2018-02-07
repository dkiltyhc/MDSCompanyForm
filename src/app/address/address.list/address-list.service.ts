import { Injectable } from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {CompanyAddressRecordService} from '../company-address-record/company-address-record.service';
import {IMasterDetails} from '../../master-details';
import {ListOperations} from '../../list-operations';
import {TheraClassService} from '../../therapeutic/therapeutic-classification/thera-class.service';
import {AddressDetailsService} from '../address.details/address.details.service';

@Injectable()
export class AddressListService extends ListOperations implements IMasterDetails  {

  /***
   *  The data list of address records
   * @type {{id: number; address: string; city: string; country: {id: string; text: string}}[]}
   */
  private addressList = [];
  constructor() {
    super();
  this.addressList = [
      {
        id: 1,
        address: 'address1',
        city: 'city1',
        country:
          {
            "id": "ABW",
            "text": "Aruba"
          }
      },
      {
        id: 2,
        address: 'address2',
        city: 'city2',
        country:
          {
            "id": "ABW",
            "text": "Aruba"
          }
      }];

    this.initIndex(this.addressList);
  };

  /**
   * Gets the array of  model records
   * @returns {{id: number; address: string; city: string; country: {id: string; text: string}}[]}
   */
 public  getModelRecordList() {
    return this.addressList;
  }

  /**
   * Ad
   * @param record
   */
  addAddress(record) {
    //TODO error checking
    this.addressList.push(record);
  }

  getAddressModel() {
    return {
      id: -1,
      address: null,
      city: null,
      country:null
    };
  }
  getAddressFormRecord(fb:FormBuilder){

    return CompanyAddressRecordService.getReactiveModel(fb);
  }


  public addressFormToData(record:FormGroup,addressModel){

    CompanyAddressRecordService.mapFormModelToDataModel(record,addressModel);
    return(addressModel);

  }

  public addressDataToForm(addressModel,record:FormGroup){
    CompanyAddressRecordService.mapDataModelFormModel(addressModel,record);
    return(record);
  }



  public saveRecord(record:FormGroup) {
    if (this.getRecordId( record) === -1) {
      this.setRecordId(record,this.getNextIndex());
      let addressModel=this.getAddressModel();
      this.addressList.push(this.addressFormToData(record,addressModel));
      return addressModel.id;
    }else{
      let modelRecord= this.getModelRecord(record.controls.id.value);
      console.log(record);
      console.log(record.controls.id.value);
      this.addressFormToData(record,modelRecord);
    }
  }

  public getModelRecord(id:number) {
    let modelList = this.getModelRecordList();

    for (let i = 0; i < modelList.length; i++) {
      if (modelList[i].id === id) {
        return modelList[i];
      }
    }
    return null;
  }

  deleteModelRecord(id): boolean {
    let modelList = this.getModelRecordList();
    for (let i = 0; i < modelList.length; i++) {
      if (modelList[i].id === id) {
        this.addressList.splice(i, 1);
        return true;
      }
    }
    return false;
  }
  public getRecordId(record:FormGroup){
    return AddressDetailsService.getRecordId(record);
  }
  public  setRecordId(record:FormGroup,value:number):void{
   AddressDetailsService.setRecordId(record,value);
  }



}
