import {Component, Input,OnChanges,SimpleChanges} from '@angular/core';

@Component({
  selector: 'expander-component',
  templateUrl: 'expander.component.html'
})

/**
 * Sample component is used for nothing
 */
export class ExpanderComponent implements OnChanges{

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
  private tableRowIndexCurrExpanded:number = -1;

  /**
   * for each table row, stores the state i.e. collapsed or expanded
   * @type {boolean[]}
   * @private
   */
  private _expanderTable:boolean[] = [];

  /**
   * an array of JSON objects to define the column labels, widths and bindings
   * @type {any[]}
   */
  @Input() columnDefinitions = [];

  /**
   * The number of columns for this expander. Used to determine columnSpan
   * @type {number}
   */
  private numberColSpan:number=1;

  constructor() {
  }

  ngOnInit() {
  }

  /**
   * Looks for and reacts to changes in the expander component
   * @param {SimpleChanges} changes
   */
  ngOnChanges(changes: SimpleChanges){

    if(changes['columnDefinitions']) {
      this.numberColSpan = (changes['columnDefinitions'].currentValue).length + 1;
    }
  }

  /**
   * Adds an additional row to the expander UI state tracking array
   */
  public addDataRow() {
    if (!this.itemsList) return;
    if (this.itemsList.length !== this._expanderTable.length) {
      this._expanderTable = new Array<boolean>(this.itemsList.length);
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
  public getExpandedRow() {
    return this.tableRowIndexCurrExpanded;
  }

  /**
   * Selects the table row to expand or collapse. If disable expand is enabled, will not collapse a row if it is in error
   * @param {number} index
   */
  public selectTableRow(index: number) {
    if (!this.isValid && this.disableCollapse) {
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
    } else {
      console.warn('The index is greater than the table length');
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
