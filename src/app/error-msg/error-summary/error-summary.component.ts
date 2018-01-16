import {Component, Input, OnInit, SimpleChanges} from '@angular/core';


@Component({
  selector: 'error-summary',
  templateUrl: './error-summary.component.html',
  styleUrls: ['./error-summary.component.css']
})
export class ErrorSummaryComponent implements OnInit {
  @Input() headingPreamble: String;
  @Input() errorList;
  public errors={};
  constructor() {
  }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {

    if (changes['errorList']) {
      console.log(changes['errorList'].currentValue);
      //this.processErrors(changes['errorList'].currentValue)
    }
  }

  processErrors(errorList) {
    console.log('Processing errors');


    //let errors = {};
    if (!errorList) return;
    errorList.forEach(err => {
      console.log(err);
      if (this.errors.hasOwnProperty(err.parentId)) {
        //parent properties already set
        // let controlError={};
        let id = err.parentId;
        let controlError = {};
        controlError['index'] = err.index;
        controlError['label'] = err.label;
        controlError['controlId'] = err.controlId;
        controlError['error'] = err.currentError;
        this.errors[id].controls.push(controlError);
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
        this.errors[err.parentId] = parentError;
        console.log(err);
      }
      console.log(this.errors);
    });
  }

}
