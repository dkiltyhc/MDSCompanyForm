import {
  AfterViewInit,
  ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, QueryList, SimpleChanges, ViewChild,
  ViewChildren
} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
//import {ControlMessagesComponent} from '../../control-messages.component/control-messages.component';
import {AddressDetailsComponent} from '../address.details/address.details.component';
import {CompanyAddressRecordService} from './company-address-record.service';
import {ErrorSummaryComponent} from '../../error-msg/error-summary/error-summary.component';


@Component({
  selector: 'company-address-record',
  templateUrl: './company-address-record.component.html',
  styleUrls: ['./company-address-record.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CompanyAddressRecordComponent implements OnInit, AfterViewInit {

  public adressRecordModel: FormGroup;
  @Input('group') public adressFormRecord: FormGroup;
  @Input() detailsChanged: number;
  @Output() saveRecord = new EventEmitter();
  @Output() revertRecord = new EventEmitter();
  @Output() deleteRecord = new EventEmitter();
  @Output() errors = new EventEmitter();
  @Output() createRecord; //TODO don't know if needed
  //@Output() public errors = new EventEmitter();


  //@ViewChildren(ControlMessagesComponent) msgList: QueryList<ControlMessagesComponent>;
  @ViewChild(AddressDetailsComponent) addressDetailsChild;
  @ViewChildren(ErrorSummaryComponent) errorSummaryChildList: QueryList<ErrorSummaryComponent>;

  public updateChild: number = 0;
  public errorList = [];
  public showErrorSummary:boolean;
  public showErrors:boolean;
  public errorSummaryChild:ErrorSummaryComponent=null;

  constructor(private _fb: FormBuilder,  private cdr: ChangeDetectorRef) {
    this.showErrors=false;
    this.showErrorSummary=false;
  }

  ngOnInit() {
    if (!this.adressRecordModel) {
      this.adressRecordModel = this._initAddress();
    }
    this.detailsChanged = 0;

  }

  ngAfterViewInit() {
    this.errorSummaryChildList.changes.subscribe(list => {
      this.processSummaries(list);
    });
  }

  private processSummaries(list: QueryList<ErrorSummaryComponent>): void {
    if (list.length > 1) {
      console.warn('Address List found >1 Error Summary ' + list.length);
    }
    this.errorSummaryChild = list.first;
    console.log("Processing summaries in the Address Record Component")
    console.log(this.errorSummaryChild);
    this._emitErrors();
  }
  /***
   * Emits errors to higher level error summaries. Used for linking summaries
   * @private
   */
  private _emitErrors(): void {
    let emitErrors = [];
    if (this.errorSummaryChild) {
      console.log("Address Record emit errors has a child")
      emitErrors.push(this.errorSummaryChild);
    }
    this.errors.emit(emitErrors);
  }



  private _initAddress() {
    return CompanyAddressRecordService.getReactiveModel(this._fb);
  }

  ngOnChanges(changes: SimpleChanges) {

    if (changes['detailsChanged']) { //used as a change indicator for the model
      console.log('*******************ngOnChanges changed for Address record***************');
      if (this.adressFormRecord) {
        console.log('************Setting to local model for Address Record****************');
        this.setToLocalModel();
      } else {
        this.adressRecordModel = this._initAddress();
        console.warn('**************There was no model for Address Record, not updating*****************');
        this.adressRecordModel.markAsPristine();
      }
      console.log('Updating the child');
      this.updateChild++;
    }
  }

  setToLocalModel() {
    console.log('Address Record being set to the address form');
    console.log(this.adressFormRecord);
    this.adressRecordModel = this.adressFormRecord;
    this.adressRecordModel.markAsPristine();
  }

  updateErrorList(errs) {
    this.errorList = errs;
    console.log('The error list is updated');
    //this.errors.emit(this.errorList);
  }

  /**
   * Changes the local model back to the last saved version of the address
   */
  public revertAddressRecord(): void {
    this.revertRecord.emit(this.adressRecordModel);
    this.adressRecordModel.markAsPristine();
  }

  /***
   * Deletes the address reocord with the selected id from both the model and the form
   */
  public deleteAddressRecord(): void {
    this.deleteRecord.emit(this.adressRecordModel.value.id);
  }

  public saveAddressRecord(): void {
    if (this.adressRecordModel.valid) {
      this.saveRecord.emit((this.adressRecordModel));
      this.showErrorSummary = false;
      this.showErrors=false;
      this.adressRecordModel.markAsPristine();
    } else {
      //id is used for an error to ensure the record gets saved
      let temp = this.adressRecordModel.value.id;
      this.adressRecordModel.controls.id.setValue(1);
      if (this.adressRecordModel.valid) {
        this.adressRecordModel.controls.id.setValue(temp);
        this.saveRecord.emit((this.adressRecordModel));
      } else {
        this.adressRecordModel.controls.id.setValue(temp);
        this.showErrorSummary = true;
        this.showErrors=true;
        this.cdr.detectChanges();
        console.log("The error list length is + "+this.errorList)
        //this.saveRecord.emit((null));
      }
    }
  }


}
