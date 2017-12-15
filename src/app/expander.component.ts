import {Component, Input, ViewChild, AfterViewInit} from '@angular/core';
import {NgForm} from '@angular/forms';


@Component({
    selector: 'expander-component',
    // template: `<h1>Sample Expander component</h1>`
    templateUrl: 'expander.component.html'
})

/**
 * Sample component is used for nothing
 */
export class ExpanderComponent implements AfterViewInit {
    @ViewChild('rowForm') public detailsFrm: NgForm;
    @Input() disableExpand = true;


    name: string;
    rowIndex: number;
    rowValid: boolean;
    foo: '';
    tableRowIndexCurrExpanded = -1;
    private _expanderTable = [false, false];
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
        {
            'givenName': 'Dan',
            'lastName': 'Kilty'
        },
        {
            'givenName': 'Jane',
            'lastName': 'Smith'
        }
    ];

    constructor() {

    }

    ngAfterViewInit() {

        this.detailsFrm.valueChanges.subscribe(data => {
            // console.log('Form changes', data)
            this.rowValid = this.rowIsValid();
        });
    }

    /**
     *  A function that returns a test string
     * @param name -not used for anything
     * @returns {string}
     */
    test(name ?: String) {
        return 'This is a test';
    }

    getExpandedState(index: number) {
        return (this._expanderTable)[index];
    }

    isExpanded(index: number) {

        return this.getExpandedState(index);
    };

    isCollapsed(index: number) {

        return !this.getExpandedState(index);
    }

    selectTableRow(index: number) {
        if ((this.detailsFrm && !this.detailsFrm.valid) && this.disableExpand) {
            return;
        }

        if (this._expanderTable.length > index) {
            let temp = this._expanderTable[index];
            this.collapseTableRows();
            this._expanderTable[index] = !temp;
            this.tableRowIndexCurrExpanded = index;
        }

    }

    collapseTableRows() {

        for (let row of this._expanderTable) {
            row = false;
        }
        for (let i = 0; i < this._expanderTable.length; i++) {
            this._expanderTable[i] = false;
        }
        this.tableRowIndexCurrExpanded=-1;
    }

    rowInError() {
        if (this.detailsFrm) {
            return (!this.detailsFrm.valid);
        } else {
            return false;
        }
    }

    rowIsValid() {
        console.log(this.detailsFrm);
        if (this.detailsFrm) {
            return (this.detailsFrm.valid);
        } else {
            return true;
        }
    }
}
