import {Component, OnInit, QueryList, ViewChild, ViewChildren} from '@angular/core';
import {AddressListComponent} from '../address.list/address.list.component';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ErrorSummaryComponent} from '../error-msg/error-summary/error-summary.component';

@Component({
  selector: 'company-base',
  templateUrl: './company-base.component.html',
  styleUrls: ['./company-base.component.css']
})
export class CompanyBaseComponent implements OnInit {
  public errors;
  @ViewChildren(AddressListComponent) addressLists: QueryList<AddressListComponent>;
  @ViewChild(ErrorSummaryComponent) errorSummary: ErrorSummaryComponent;

  public myForm: FormGroup; // our form model
  public errorList = {};

  constructor(private _fb: FormBuilder) {
  }

  ngOnInit() {
    this.myForm = this._fb.group({
      addresses: this._fb.array([])
    });
  }

  ngAfterViewInit() {
    this.addressLists.forEach(addressList => console.log(addressList));

    this.addressLists.changes.subscribe(list => {
      list.forEach(writer => console.log(writer));
    });
  }

  initAddress() {
    // initialize our address
    // this.indexId++;
    return this._fb.group({
      id: [14],
      address: ['test1', Validators.required],
      city: ['test1']
    });
  }

  processErrors(errorList) {
    console.log('Processing errors');
    //this.errorList=errorList;
    this.errorSummary.processErrors(errorList);

    /*
    let errors = {};
    if (!errorList) return;
    errorList.forEach(err => {
      console.log(err);
      if (errors.hasOwnProperty(err.parentId)) {
        //parent properties already set
        // let controlError={};
        let id = err.parentId;
        let controlError = {};
        controlError['index'] = err.index;
        controlError['label'] = err.label;
        controlError['controlId'] = err.controlId;
        controlError['error'] = err.currentError;
        errors[id].controls.push(controlError);
      } else {
        console.log('The error does not exist....');
        console.log(err);
        let parentError = {parentLabel: '', controls: []};
        parentError.parentLabel = err.parentLabel;
        let controlError = {};
        controlError['index'] = err.index;
        controlError['label'] = err.label;
        controlError['controlId'] = err.controlId;
        controlError['error'] = err.currentError;
        parentError.controls.push(controlError);
        errors[err.parentId] = parentError;
        console.log(err,);
      }
      console.log(errors);
    });*/
  }
}
