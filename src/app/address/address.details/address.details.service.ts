import {AfterViewInit, Injectable, OnChanges, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
//import {TheraClassService} from '../../therapeutic/therapeutic-classification/thera-class.service';
import {GlobalsService} from '../../globals/globals.service';
import {ValidationService} from '../../validation.service';

@Injectable()
export class AddressDetailsService  {

  private countryList: Array<any>;
  private stateList: Array<any>;
  public provinces: Array<any>=[
    {"id":"ON","label_en":"Ontario","label_fr":"Ontario"},
    {"id":"MN","label_en":"Manitoba","label_fr":"Manitoba"}
  ];


  constructor() {
    this.countryList = [];
  }

  /**
   * Gets the reactive forms Model for address details
   * @param {FormBuilder} fb
   * @returns {any}
   */
  public static getReactiveModel(fb: FormBuilder) {
    if (!fb) return null;
    return fb.group({
      address: [null, Validators.required],
      provText: '',
      provList: '',
      city: [null, [Validators.required, Validators.min(5)]],
      country: [null, Validators.required],
      postal:[null,[]]
    });
  }

  public static mapFormModelToDataModel(formRecord: FormGroup, addressModel) {
    addressModel.address = formRecord.controls.address.value;
    addressModel.city = formRecord.controls.city.value;
    if (formRecord.controls.country.value && formRecord.controls.country.value.length > 0) {
      addressModel.country = formRecord.controls.country.value[0];
    } else {
      addressModel.country = null;
    }
  }

  public static mapDataModelToFormModel(addressModel, formRecord: FormGroup,) {
    formRecord.controls.address.setValue(addressModel.address);
    formRecord.controls.city.setValue(addressModel.city);
    console.log(addressModel.country);
    if (addressModel.country) {
      formRecord.controls.country.setValue([addressModel.country]);
    } else {
      formRecord.controls.country.setValue(null);
    }
  }

  public static getRecordId(record: FormGroup) {
    return (record.controls.id.value);
  }

  public static setRecordId(record: FormGroup, value: number): void {
    if (!record) return;
    record.controls.id.setValue(value);
  }

  public  setProvinceState(record: FormGroup, eventValue) {

    if (AddressDetailsService.isCanadaOrUSA(eventValue)) {

      record.controls.provText.setValue("");
      record.controls.provText.setValidators([]);
      if(AddressDetailsService.isCanada(eventValue.id))
      {
        record.controls.postal.setValidators([Validators.required, ValidationService.canadaPostalValidator]);
      }else{
        record.controls.postal.setValidators([Validators.required, ValidationService.usaPostalValidator]);
      }
      record.controls.provText.updateValueAndValidity();
      record.controls.postal.updateValueAndValidity();
      return this.provinces;
    } else {
      record.controls.provText.setValidators([Validators.required]);
      record.controls.postal.setValidators([]);
      record.controls.provText.updateValueAndValidity();
      record.controls.postal.updateValueAndValidity();
      return [];
    }

  }

  /**
   * Sets the country list to be used for all addres details records
   * @param {Array<any>} value
   */
  public setCountryList(value:Array<any>) {
    this.countryList = value;

  }

  public static isCanadaOrUSA(value){
    let countryValue:string;
    if(value){
      countryValue=value.id;
    }else{
      return false;
    }
   return (AddressDetailsService.isCanada(countryValue)|| AddressDetailsService.isUsa(countryValue ));
  }

  public static isCanada(value){

    return (value===GlobalsService.CANADA);
  }
  public static isUsa(value){

    return (value===GlobalsService.USA);
  }

}
