import {Injectable} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AddressDetailsService} from '../address.details/address.details.service';

@Injectable()
export class CompanyAddressRecordService {

  constructor() {
  }

  public static getReactiveModel(fb: FormBuilder): FormGroup {
    if (!fb) return null;
    return fb.group({
        id: -1,
        detailsDirty: [false, Validators.required],
        addressDetails: AddressDetailsService.getReactiveModel(fb)
      }
    );
  }

  public static mapFormModelToDataModel(formRecord: FormGroup, addressRecordModel) {
    addressRecordModel.id = formRecord.controls.id.value;
    AddressDetailsService.mapFormModelToDataModel((<FormGroup>formRecord.controls.addressDetails), addressRecordModel);

  }


  public static mapDataModelFormModel(addressRecordModel, formRecord: FormGroup) {
    formRecord.controls.id.setValue(addressRecordModel.id);
    AddressDetailsService.mapDataModelToFormModel(addressRecordModel, <FormGroup>formRecord.controls.addressDetails);
  }
}
