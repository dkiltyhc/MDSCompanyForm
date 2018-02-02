import {AfterViewInit, Component, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {ErrorSummaryComponent} from '../../error-msg/error-summary/error-summary.component';
import {ListOperations} from '../../list-operations';
import {FormArray, FormBuilder, FormGroup} from '@angular/forms';
import {TheraClassService} from '../therapeutic-classification/thera-class.service';

@Component({
  selector: 'thera-list',
  templateUrl: './thera-list.component.html',
  styleUrls: ['./thera-list.component.css']
})
export class TheraListComponent extends ListOperations implements OnInit, OnChanges, AfterViewInit {


  public theraListForm: FormGroup;
  public errorList = [];
  public dataModel = [];
  public theraRecs:FormArray;
  public columnDefinitions = [
    {
      label: 'THERACLASS',
      binding: 'address',
      width: '100'
    },
  ];


  constructor(private _fb:FormBuilder) {
    super();
  }

  ngOnInit() {
    this.theraListForm = this._fb.group({
      theraList:   this._fb.array([])
    });
  }

  ngAfterViewInit() {
    //this.setExpander(this.expander);
    //this.processSummaries(this.errorSummaryChildList);
    //this.errorSummaryChildList.changes.subscribe(list => {
    //this.processSummaries(list);
    //});
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['saveAddress']) {
     // this.saveAddressRecord(changes['saveAddress'].currentValue);
    }
  }

  public addClassRecord(){
    console.log(this.getFormList());
    this.addRecord(TheraClassService.getReactiveModel(this._fb),this.getFormList());
  }
  public getFormList(): FormArray {

    return <FormArray>(this.theraListForm.controls['theraList']);
  }
}
