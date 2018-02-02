import { Injectable } from '@angular/core';
import {FormBuilder, FormGroup } from '@angular/forms';

@Injectable()
export class TheraClassService {

  constructor() { }

  public static getReactiveModel(fb: FormBuilder): FormGroup {
    if (!fb) return null;
    return fb.group({
        id: -1,
      theraDetails:''
      }
    );
  }

}
