import {AfterViewInit, ChangeDetectorRef, Component, Input, SimpleChanges} from '@angular/core';
import {GlobalsService} from '../../globals/globals.service';


@Component({
  selector: 'error-summary',
  templateUrl: './error-summary.component.html',
  styleUrls: ['./error-summary.component.css']
})
export class ErrorSummaryComponent implements AfterViewInit{
  @Input() headingPreamble: string;
  @Input() errorList;
  @Input() compId = 'error-summary-';
  public type: string;
  public errors = {};
  public componentId = '';

  constructor(private cdr: ChangeDetectorRef,private globals: GlobalsService) {
    this.type = globals.errorSummClassName;
  }

  ngAfterViewInit() {
    this.cdr.detectChanges();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['errorList']) {
      this.processErrors(changes['errorList'].currentValue);
    }
    if (changes['compId']) {
      this.componentId = changes['compId'].currentValue;
    }
  }

  processErrors(errorList) {
    this.errors = {};
    if (!errorList) {
      return;
    }
    for (let err of errorList) {
      if(!err) continue;
      if (err.hasOwnProperty('type') && err.type === 'ErrorSummaryComponent') {
        let parentError = {parentLabel: '', controls: []};
        parentError.parentLabel = err.componentId;
        let controlError = {};
        controlError['label'] = err.headingPreamble;
        controlError['componentId'] = err.componentId;
        controlError['type'] = err.type;
        parentError.controls.push(controlError);
        this.errors[err.componentId] = parentError;
      } else {
        if (this.errors.hasOwnProperty(err.parentId)) {
          let id = err.parentId;
          let controlError = {};
          controlError['index'] = err.index;
          controlError['label'] = err.label;
          controlError['controlId'] = err.controlId;
          controlError['error'] = err.currentError;
          controlError['type'] = err.type;
          this.errors[id].controls.push(controlError);
        } else {
          let parentError = {parentLabel: '', controls: []};
          parentError.parentLabel = err.parentLabel;
          let controlError = {};
          controlError['index'] = err.index;
          controlError['label'] = err.label;
          controlError['controlId'] = err.controlId;
          controlError['error'] = err.currentError;
          controlError['type'] = err.type;
          parentError.controls.push(controlError);
          this.errors[err.parentId] = parentError;
        }
      }
    }
    console.log(this.errors);
  }
}
