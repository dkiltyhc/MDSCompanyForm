import {Component, EventEmitter, Input, OnChanges, Output, SimpleChanges} from '@angular/core';
import {FormGroup} from '@angular/forms';

@Component({
  selector: 'expander-component',
  templateUrl: 'expander.component.html'
})

/**
 * Sample component is used for nothing
 */
export class ExpanderComponent implements OnChanges {

  /**
   * When set to true, disables collapse of a details section that is in error
   * @type {boolean}
   */
  @Input() disableCollapse = true;
  /**
   * sets if the details form is valid. Controls collapses state
   * @type {boolean}
   */
  @Input() isValid = true;

  /**
   * The list of records to display in the expander component
   */
  @Input('group') itemsList;

  /**
   * Tracks the currently expanded row. -1 if all the rows are collapsed or no rows
   * @type {number}
   */
  @Input() addRecord: Number;
  @Input() deleteRecord: Number;


  @Output() expandedRow = new EventEmitter();

  private tableRowIndexCurrExpanded: number = -1;

  /**
   * for each table row, stores the state i.e. collapsed or expanded
   * @type {boolean[]}
   * @private
   */
  private _expanderTable: boolean[] = [];

  /**
   * an array of JSON objects to define the column labels, widths and bindings
   * @type {any[]}
   */
  @Input() columnDefinitions = [];

  /**
   * The number of columns for this expander. Used to determine columnSpan
   * @type {number}
   */
  private numberColSpan: number = 1;

  constructor() {
  }

  ngOnInit() {
  }

  /**
   * Looks for and reacts to changes in the expander component
   * @param {SimpleChanges} changes
   */
  ngOnChanges(changes: SimpleChanges) {
    console.log(changes);
    if (changes['columnDefinitions']) {
      this.numberColSpan = (changes['columnDefinitions'].currentValue).length + 1;
    }
    if (changes['addRecord']) {
      this.updateDataRows(this.itemsList);
      this.selectTableRowNoCheck(this._expanderTable.length - 1);
      console.log('EXPANDER: RECORD ADDED ' + this.itemsList.length);
    }
    if (changes['itemsList']) {
      console.log('*******changes to groups');
      this.updateDataRows(changes['itemsList'].currentValue);
    }
    if (changes['deleteRecord']) {
      this.updateDataRows(this.itemsList);
      console.log('EXPANDER: RECORD deleted ' + this.itemsList.length);
    }

  }

  /**
   * Adds an additional row to the expander UI state tracking array
   */
  public updateDataRows(srcList) {
    if (!srcList) return;
    if (srcList.length !== this._expanderTable.length) {
      this._expanderTable = new Array<boolean>(srcList.length);
    }
  }

  /**
   * For a given row denoted by a zero based index, returns if a row is collapsed or expanded
   * @param {number} index
   * @returns {boolean}
   */
  public getExpandedState(index: number) {
    return <boolean>(this._expanderTable)[index];
  }

  /**
   *  Checks if a given zero based row denoted by index is expanded
   * @param {number} index
   * @returns {boolean}
   */
  public isExpanded(index: number) {
    return this.tableRowIndexCurrExpanded === index;
  };

  /**
   *  Checks if a given zero based row denoted by index is collapsed
   * @param {number} index
   * @returns {boolean}
   */
  public isCollapsed(index: number) {
    return !this.isExpanded(index);
  }

  /**
   * Returns the row that is expanded. (-1) if no row is expanded
   * @returns {number}
   */

  /*saveAddressRecord(){
    // this.saveRecord=_.cloneDeep(this.adressFormLocalModel);

    this.saveRecord.emit((this.adressFormLocalModel));
    console.log(this.saveRecord);
  }*/

  public getExpandedRow2() {
    // return this.tableRowIndexCurrExpanded;
    this.expandedRow.emit(this.tableRowIndexCurrExpanded);
  }

  public getExpandedRow() {
    return this.tableRowIndexCurrExpanded;

  }

  /**
   * Selects the table row to expand or collapse. If disable expand is enabled, will not collapse a row if it is in error
   * @param {number} index
   */
  public selectTableRow(index: number) {
    /* if (!this.isValid && this.disableCollapse) {
       console.warn('select table row did not meet conditions');
       return;
     }*/
    if (this._expanderTable.length > index) {
      let temp = this._expanderTable[index];
      if (temp && !this.isValid && this.disableCollapse) {
        console.warn('select table row did not meet conditions');
        return;
      }
      this.collapseTableRows();
      this._expanderTable[index] = !temp;
      if (this._expanderTable[index]) {
        this.tableRowIndexCurrExpanded = index;
      } else {
        this.tableRowIndexCurrExpanded = -1;
      }
    } else {
      console.warn('The index is greater than the table length ' + index + ' ' + this._expanderTable.length);
    }
  }


  public selectTableRowNoCheck(index: number) {
    if (this._expanderTable.length > index) {
      let temp = this._expanderTable[index];
      this.collapseTableRows();
      this._expanderTable[index] = !temp;
      if (this._expanderTable[index]) {
        this.tableRowIndexCurrExpanded = index;
      } else {
        this.tableRowIndexCurrExpanded = -1;
      }
    } else {
      console.warn('The index is greater than the table length ' + index + ' ' + this._expanderTable.length);
    }
  }

  /**
   * Collapses all the table rows. Ignores any error states in the details.
   */
  public collapseTableRows() {
    for (let row of this._expanderTable) {
      row = false;
    }
    for (let i = 0; i < this._expanderTable.length; i++) {
      this._expanderTable[i] = false;
    }
    this.tableRowIndexCurrExpanded = -1;
  }

}
