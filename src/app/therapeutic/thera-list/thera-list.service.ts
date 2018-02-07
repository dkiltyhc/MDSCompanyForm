import {Injectable} from '@angular/core';
import {IMasterDetails} from '../../master-details';
import {TheraClassService} from '../therapeutic-classification/thera-class.service';
import {ListOperations} from '../../list-operations';
import {FormGroup} from '@angular/forms';

@Injectable()
export class TheraListService extends ListOperations implements IMasterDetails {

  private modelList = [];

  constructor() {
    super();
  }

  deleteModelRecord(id): boolean {
    let modelList = this.getModelRecordList();
    for (let i = 0; i < modelList.length; i++) {
      if (modelList[i].id === id) {
        this.modelList.splice(i, 1);
        return true;
      }
    }
    return false;
  }

  getModelRecordList() {

    return this.modelList;
  }

  getModelRecord(id) {
    let modelList = this.getModelRecordList();
    for (let i = 0; i < modelList.length; i++) {
      if (modelList[i].id === id) {
        return modelList[i];
      }
    }
    return null;
  }

  public saveRecord(record: FormGroup) {

    if (this.getRecordId(record) === -1) {
      record.controls.id.setValue(this.getNextIndex());
      let theraModel = this.getEmptyModel();
      TheraClassService.formToModelData(record, theraModel);
      this.modelList.push(theraModel);
      return theraModel.id;
    } else {
      let theraModel = this.getModelRecord(this.getRecordId(record));
      TheraClassService.formToModelData(record, theraModel);
    }
  }



  public getEmptyModel() {
    return (
      {
        'id': -1,
        'theraDetails': ''
      }
    );
  }

  public getRecordId(record: FormGroup): number {
    return TheraClassService.getRecordId(record);
  }

  public setRecordId(record: FormGroup, value:number): void {
    return TheraClassService.setRecordId(record,value);
  }

  public updateModelRecord(modelList,formRecord) {
    let recId=TheraClassService.getRecordId(formRecord);
    for (let modelRec of modelList) {
      if (modelRec.id === recId) {
        TheraClassService.formToModelData(formRecord,modelRec);
        return;
      }
    }
  }



}
