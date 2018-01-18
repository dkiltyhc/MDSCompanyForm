import {ChangeDetectorRef, Component, OnInit, QueryList, ViewChild, ViewChildren} from '@angular/core';
import {AddressListComponent} from '../address.list/address.list.component';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
//import {ErrorSummaryComponent} from '../error-msg/error-summary/error-summary.component';

@Component({
  selector: 'company-base',
  templateUrl: './company-base.component.html',
  styleUrls: ['./company-base.component.css']
})
export class CompanyBaseComponent implements OnInit {
  public errors;
 // @ViewChildren(AddressListComponent) addressLists: QueryList<AddressListComponent>;
  //@ViewChild(ErrorSummaryComponent) errorSummary: ErrorSummaryComponent;

  public myForm: FormGroup; // our form model
  public errorList = {};

  constructor(private _fb: FormBuilder,private cdr: ChangeDetectorRef) {
  }

  ngOnInit() {
    this.myForm = this._fb.group({
      addresses: this._fb.array([])
    });
  }

  ngAfterViewInit() {

   /* this.addressLists.changes.subscribe(list => {
      list.forEach(writer => console.log(writer));
    });*/
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
    console.log('@@@@@@@@@@@@ Processing errors in Company base component @@@@@@@@@@@@');
    console.log(errorList);
    this.errorList=errorList;
    this.cdr.detectChanges();

  }
}
