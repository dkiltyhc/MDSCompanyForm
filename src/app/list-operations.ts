import {FormArray, FormGroup} from '@angular/forms';
import {ExpanderComponent} from './expander.component';
import {ErrorSummaryComponent} from './error-msg/error-summary/error-summary.component';
import {ViewChild} from '@angular/core';


export abstract class ListOperations {

  private prevRow: number;
  protected showErrorSummary: boolean;
  public newRecordIndicator: boolean;
  public foo;

  @ViewChild(ExpanderComponent) expander: ExpanderComponent;
  private errorSummary: ErrorSummaryComponent;

  /**
   * Used to create address ids
   * @type {number}
   * @private
   */
  private _indexValue = -1;

  constructor() {
    this.prevRow = -1;
    this.showErrorSummary= false;
    //this.newRecordIndicator=false;
  }



  /**
   * Parses the current data and finds the largest ID
   * @public
   */
  public initIndex(recordList) {
    for (let record of recordList) {
      if (record.id > this._indexValue) {
        this._indexValue =record.id;
      }
    }
  }

  /**
   * Gets the next index id for the details record
   * @returns {number}
   */
  getNextIndex() {
    this._indexValue++;
    return this._indexValue;
  }

  /**
   * Resets the index to the base value
   */
  public resetIndex() {
    this._indexValue = -1;
  }
  getCurrentIndex(){

    return  this._indexValue;
  }
  public setIndex(value:number){
    this._indexValue=value;
  }

  public setErrorSummary(errorSummaryInstance: ErrorSummaryComponent) {
    this.errorSummary = errorSummaryInstance;
  }

  public setExpander(expanderInstance: ExpanderComponent) {
    this.expander = expanderInstance;
  }


  public syncCurrentExpandedRow(reactiveFormList:FormArray):FormGroup {

    if(!this.expander){
      console.warn("ListOperations-syncCurrentExpandedRow: There is no expander") ;
      console.log(this.expander);
      return;
    }
    const rowNum = this.expander.getExpandedRow();
    console.log("This is the row number "+rowNum);
    //used to sync the expander with the details
    if (rowNum > -1 && this.prevRow !== rowNum) {
      this.prevRow = rowNum;
      return <FormGroup> reactiveFormList.controls[rowNum];
    } else {
      //do nothing?
      return null;
    }
  }

  private collapseExpanderRows() {
    if (this.expander) {
      this.expander.collapseTableRows();
    }

  }


  public saveRecord(record: FormGroup, service): number {
    //Case 1 no record, just show error summary, shoud never happen
    if (!record) {
      this.showErrorSummary = true;
      return;
    }
    let recordId = service.saveRecord(record);
    this.showErrorSummary = false;
    //this.newRecordIndicator = false; //in case this was a new record
    this.collapseExpanderRows();
  }

  public addRecord(formRecord:FormGroup,formList:FormArray){
    this.collapseExpanderRows(); //if you don't do this view will not look right
    console.log("In super the value is "+ this.newRecordIndicator);
    formList.push(formRecord);
    this.newRecordIndicator = true;
    console.log("###In function the add record listOperations "+ this.newRecordIndicator);
  }

  public deleteRecord(id:number, recordList:FormArray,service){

    let serviceResult = service.deleteModelRecord(id);
    for (let i = 0; i < recordList.controls.length; i++) {
      let temp = <FormGroup> recordList.controls[i];
      if (temp.controls.id.value === id) {
        recordList.removeAt(i);
        break;
      }
    }
    this.collapseExpanderRows();
    this.prevRow = -1;
   // this.newRecordIndicator=false;
  }

  public getNewRecordInd(){
    console.log(this.newRecordIndicator)
    return this.newRecordIndicator;
  }
}
