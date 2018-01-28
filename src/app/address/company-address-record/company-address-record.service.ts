import {Injectable} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AddressDetailsService} from '../address.details/address.details.service';

@Injectable()
export class CompanyAddressRecordService {

  constructor() {
  }

  public static getReactiveModel(fb: FormBuilder):FormGroup {
    if (!fb) return null;
    return fb.group({
        id: -1,
        detailsDirty: [false, Validators.required],
        addressDetails: AddressDetailsService.getReactiveModel(fb)
      }
    );
  }

}
