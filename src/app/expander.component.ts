import {Component, Input, ViewChild} from '@angular/core';
import {FormGroup, NgForm} from '@angular/forms';


@Component({
  selector: 'expander-component',
  // template: `<h1>Sample Expander component</h1>`
  templateUrl: 'expander.component.html'
})

/**
 * Sample component is used for nothing
 */
export class ExpanderComponent {
  @ViewChild('rowForm') public detailsFrm: NgForm;
  @Input() disableExpand = true;
  @Input() listItems2 = {};
  @Input('group') test2;

  name: string;
  rowIndex: number;
  tableRowIndexCurrExpanded = -1;
  public formSelected;
  public _expanderTable = [false, false];
  @Input() columnDefinitions = [
    {
      label: 'FIRSTNAME',
      binding: 'givenName',
      width: '25'
    },
    {
      label: 'LASTNAME',
      binding: 'lastName',
      width: '25'
    }
  ];
  numberColumns = this.columnDefinitions.length + 1;
  listItems = [
  ];

  constructor() {

  }

  ngOnInit() {
    if (this.test2) {
      this.formSelected = this.test2[this.test2.length];
    }
  }

  public addDataRow() {
    if (!this.test2) return;
    if (this.test2.length !== this._expanderTable.length) {
      this._expanderTable = new Array<boolean>(this.test2.length);
      if (this.tableRowIndexCurrExpanded > -1) {
        this.formSelected = this.test2[this.tableRowIndexCurrExpanded];
      }
    }
  }

  public getExpandedState(index: number) {
    return (this._expanderTable)[index];
  }

  public isExpanded(index: number) {

    return this.tableRowIndexCurrExpanded === index;
  };

  public isCollapsed(index: number) {
    return  !this.isExpanded(index);
  }

  public isDetailsVisible(index) {
    if (this.tableRowIndexCurrExpanded < 0) return false;
    return (index === this.tableRowIndexCurrExpanded);

  }

  public selectTableRow(index: number) {
    if ((this.detailsFrm && !this.detailsFrm.valid) && this.disableExpand) {
      console.warn('select table row did not meet conditions');
      return;
    }
    if (this._expanderTable.length > index) {
      let temp = this._expanderTable[index];
      this.collapseTableRows();
      this._expanderTable[index] = !temp;
      if (this._expanderTable[index]) {
        this.tableRowIndexCurrExpanded = index;
      } else {
        this.tableRowIndexCurrExpanded = -1;
      }
      console.log('Expander row ' + this.tableRowIndexCurrExpanded);
    } else {
      console.warn('The index is greater than the table length');
    }
  }

  public getExpandedRow() {

    return this.tableRowIndexCurrExpanded;
  }

  public collapseTableRows() {
    for (let row of this._expanderTable) {
      row = false;
    }
    for (let i = 0; i < this._expanderTable.length; i++) {
      this._expanderTable[i] = false;
    }
    this.tableRowIndexCurrExpanded = -1;
  }

  public rowInError() {
    if (this.detailsFrm) {
      return (!this.detailsFrm.valid);
    } else {
      return false;
    }
  }

  public rowIsValid() {
    console.log(this.detailsFrm);
    if (this.detailsFrm) {
      return (this.detailsFrm.valid);
    } else {
      return true;
    }
  }

}
