import { Injectable } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

@Injectable()
export class TheraClassService {

  constructor() { }

  public static getReactiveModel(fb: FormBuilder): FormGroup {
    if (!fb) return null;
    return fb.group({
        id: -1,
      theraDetails:[null, [Validators.required]]
      }
    );
  }

  public static getRecordId(record:FormGroup):number{
    if(!record) return -999;
    return record.controls.id.value;
  }
  public static setRecordId(record:FormGroup,value:number):void{
    if(!record) return;
    record.controls.id.setValue(value);
  }

  public static formToModelData(formRecord:FormGroup, model) {
    model.id = TheraClassService.getRecordId(formRecord);
    model.theraDetails = formRecord.controls.theraDetails.value;
  }
  public static modelToFormData( model,formRecord:FormGroup,):void {
    //console.log(model);
    TheraClassService.setRecordId(formRecord,model.id) ;
     formRecord.controls.theraDetails.setValue(model.theraDetails);
  }

  public static getEmptyModelRecord(){
      return (
        {
          'id': -1,
          'theraDetails': ''
        }
      );
  }

}
