import {Injectable} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {TheraClassService} from '../../therapeutic/therapeutic-classification/thera-class.service';

@Injectable()
export class AddressDetailsService {

  constructor() {
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
      city: [null, [Validators.required, Validators.min(5)]],
      country: [null, Validators.required],

    });
  }
  public static mapFormModelToDataModel(formRecord:FormGroup, addressModel){
    addressModel.address=formRecord.controls.address.value;
    addressModel.city=formRecord.controls.city.value
    if(formRecord.controls.country.value &&formRecord.controls.country.value.length>0) {
      addressModel.country = formRecord.controls.country.value[0];
    }else{
      addressModel.country=null;
    }
  }
  public static mapDataModelToFormModel(addressModel,formRecord:FormGroup,){
    formRecord.controls.address.setValue(addressModel.address);
    formRecord.controls.city.setValue(addressModel.city);
    console.log(addressModel.country);
    if(addressModel.country) {
      formRecord.controls.country.setValue([addressModel.country]);
    }else{
      formRecord.controls.country.setValue(null);
    }
  }

  public static getRecordId(record:FormGroup){
    return(record.controls.id.value);
  }
  public static setRecordId(record:FormGroup,value:number):void{
    if(!record) return;
    record.controls.id.setValue(value);
  }



}
