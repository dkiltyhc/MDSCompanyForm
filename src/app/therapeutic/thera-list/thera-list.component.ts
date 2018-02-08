import {AfterViewInit, Component, OnChanges, OnInit, SimpleChanges, ViewChild} from '@angular/core';
//import {ErrorSummaryComponent} from '../../error-msg/error-summary/error-summary.component';
import {ListOperations} from '../../list-operations';
import {FormArray, FormBuilder, FormGroup} from '@angular/forms';
import {TheraClassService} from '../therapeutic-classification/thera-class.service';
import {TherapeuticClassificationComponent} from '../therapeutic-classification/therapeutic-classification.component';
import {TheraListService} from './thera-list.service';

@Component({
  selector: 'thera-list',
  templateUrl: './thera-list.component.html',
  styleUrls: ['./thera-list.component.css']
})
export class TheraListComponent extends ListOperations implements OnInit, OnChanges, AfterViewInit {

  @ViewChild(TherapeuticClassificationComponent) theraDetailsRecord: TherapeuticClassificationComponent;
  public theraListForm: FormGroup;
  public errorList = [];
  public dataModel = [];
  public addRecordMsg:number=0;
  //public theraRecs:FormArray;
  public deleteRecordMsg:number;
  public validRec:boolean;
  public service:TheraListService;
  public updateDetails:number=0;
  public columnDefinitions = [
    {
      label: 'THERACLASS',
      binding: 'theraDetails',
      width: '100'
    },
  ];


  constructor(private _fb:FormBuilder) {
    super();
    this.validRec=true;
    this.service=new TheraListService();
    this.deleteRecordMsg=0;
  }

  ngOnInit() {
    this.theraListForm = this._fb.group({
      theraList:   this._fb.array([])
    });
    this.dataModel=this.service.getModelRecordList();
  }

  ngAfterViewInit() {
    //subscribe to value changes in the form. Going to update modal automatically as the
    this.theraListForm.valueChanges.subscribe(form => {
        this.validRec=this.theraListForm.valid;
        this._updateModelRecord();
    });

  }

  ngOnChanges(changes: SimpleChanges) {

  }
  ngDoCheck() {
    this._syncCurrentExpandedRow();
  }

  /**
   * Synchs the model record with the form record since there is no save
   * @private
   */
  private _updateModelRecord(){

    let rowNum=this.getExpandedRow();
    if(rowNum<0) return;
    //MOVE to record service
    let formList=this.getFormList();
    if(!formList) return;
    console.log(formList)
    let formRecord=<FormGroup> formList.controls[rowNum];
    if(!formRecord) return;
    this.service.updateModelRecord(this.dataModel,formRecord);
  }

  public addClassRecord(){
    //1. Get a blank form record
    let rec=TheraClassService.getReactiveModel(this._fb);
    //Set the index immediately
    rec.controls.id.setValue(this.getNextIndex());
    //get an empty model record, update idea and add
    var emptyModel=this.service.getEmptyModel();
    emptyModel.id= rec.controls.id.value;
    this.dataModel.push(emptyModel);
    //add the form data record
    this.addRecord(rec,this.getFormList());
    //set the child details to the recrod
    this.theraDetailsRecord.theraFormRecord=rec;
    //update the expander message
    this.addRecordMsg++;
    //update the details message - Alternate just attach directly to the model?
    this.updateDetails++;
    this.validRec=false;
  }
  public getFormList(): FormArray {
    return <FormArray>(this.theraListForm.controls['theraList']);
  }
  private _syncCurrentExpandedRow():void {
    if (this.theraDetailsRecord) {
      let formList = this.getFormList();
      let result = this.syncCurrentExpandedRow(formList);
      //Onlu update the results if there is a change. Otherwise the record will not be dirty
      if (result) {
        //alternate attach to the model directly. Is there any benefit to doing this?
        this.theraDetailsRecord.theraFormRecord = result;
        this.updateDetails++;
      }
    } else {
      console.warn('There is no company address child');
    }
  }
  public delete(id): void {
    this.deleteRecord(id,this.getFormList(),this.service);
    this.deleteRecordMsg++;
  }

}
