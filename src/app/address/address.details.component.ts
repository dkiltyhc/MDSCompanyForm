import {Component, Input, ViewChild, OnInit, AfterViewInit} from '@angular/core';
import {NgForm, FormArray, FormGroup, Validators, FormBuilder} from '@angular/forms';
import {AddressData} from '../company.interfaces'; // TODO do we need this as an approach

import {ValidationService} from '../validation.service';


@Component({
  selector: 'address-details',
  templateUrl: 'address.details.component.html'
})

/**
 * Sample component is used for nothing
 */
export class AddressDetailsComponent implements OnInit, AfterViewInit {
  @Input('addressDetailsForm')
  public addressDetailsForm: FormArray;

  // @Input('addressData')
  // public addressData: AddressData;
  userForm: {};


  constructor(private fb: FormBuilder) {
    this.userForm = this.fb.group({
      'address': ['', Validators.required],
      'city': ['', [Validators.required, ValidationService.emailValidator]],
    });

  }

  ngOnInit() {

  }

  ngAfterViewInit() {
  }

  /*private toFormGroup(data: AddressData) {
      const formGroup = this.fb.group({
          id: [data.id],
          childField1: [data.address || '', Validators.required],
          childField2: [data.city || '', Validators.required]
      });

      return formGroup;
  }*/


  /**
   *  A function that returns a test string
   * @param name -not used for anything
   * @returns {string}
   */
  test(name ?: String) {
    return 'This is a test';
  }
}
