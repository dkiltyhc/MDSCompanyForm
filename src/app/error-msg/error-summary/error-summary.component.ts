import {AfterViewInit, ChangeDetectorRef, Component, Input, SimpleChanges} from '@angular/core';
import {GlobalsService} from '../../globals/globals.service';


@Component({
  selector: 'error-summary',
  templateUrl: './error-summary.component.html',
  styleUrls: ['./error-summary.component.css']
})
export class ErrorSummaryComponent implements AfterViewInit {
  @Input() headingPreamble: string;
  @Input() errorList;
  @Input() compId = 'error-summary-';
  @Input() label:string;
  public type: string;
  public errors = {};
  public componentId = '';

  constructor(private cdr: ChangeDetectorRef, private globals: GlobalsService) {
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

  /**
   * Creates an array of error elements based on the incoming error objects
   * Currently groups the errors by parent. Not doing anything with parent right now
   * @param errorList
   */
  public processErrors(errorList): void {
    this.errors = {};
    if (!errorList) {
      return;
    }
    console.log(errorList)

    for (let err of errorList) {
      if (!err) continue;
      let controlError = this.getEmptyError();
      controlError['index'] = err.index;
      controlError['label'] = err.label;
      controlError['controlId'] = err.controlId;
      controlError['error'] = err.currentError;
      controlError['type'] = err.type;
      controlError['tabSet'] = err.tabSet;
      controlError['tabId'] = err.tabId;

      //Case 1: an error summary Component
      if (err.hasOwnProperty('type') && err.type === 'ErrorSummaryComponent') {
        let parentError = {parentLabel: '', controls: []};
        parentError.parentLabel = err.componentId;
        parentError.controls.push(controlError);
        this.errors[err.componentId] = parentError;
      } else {
        //Case 2 Not an error summary. If has a parentId gourp the errors
        if (this.errors.hasOwnProperty(err.parentId)) {
          let id = err.parentId;
          this.errors[id].controls.push(controlError);
        } else {
          //create a parent tag and put errors under the controls list
          let parentError = {parentLabel: '', controls: []};
          parentError.parentLabel = err.parentLabel;
          parentError.controls.push(controlError);
          this.errors[err.parentId] = parentError;
        }
      }
    }
    console.log(this.errors);
  }

  public selectTab(error) {
    console.log('Selecting the tab');
    if (error && error.tabSet && error.tabId) {
      error.tabSet.select(error.tabId);
    }
  }

  public getEmptyError(): object {
    let controlError = {};
    controlError['index'] = '';
    controlError['label'] = '';
    controlError['controlId'] = '';
    controlError['error'] = '';
    controlError['type'] = '';
    controlError['tabSet'] = '';
    controlError['tabId'] = '';

    return controlError;
  }

}
