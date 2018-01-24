import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import * as FileSaver from 'file-saver';
import {TranslateService} from '@ngx-translate/core';

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
  public errorList = [];

  constructor(private _fb: FormBuilder, private cdr: ChangeDetectorRef) {
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
    this.errorList = errorList;
    this.cdr.detectChanges();
  }

  public hideErrorSummary() {
    if (!this.errorList) return false;
    return this.errorList.length == 0;

  }

  public saveFile() {
    /*let blob = new Blob([document.getElementById('exportDiv').innerHTML], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-16le"
    });*/
    var makeStrSave = 'test';
    let blob = new Blob([makeStrSave], {type: 'text/plain;charset=utf-8'});
    FileSaver.saveAs(blob, 'test.txt');

  }
  public processFile(data){
    console.log("processing file.....")
    console.log(data)
  }
}
