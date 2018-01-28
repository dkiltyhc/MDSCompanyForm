import {Injectable} from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';

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

}
