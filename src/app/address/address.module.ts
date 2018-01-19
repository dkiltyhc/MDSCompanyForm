import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {AddressDetailsComponent} from './address.details.component';
import{CompanyAddressRecordComponent} from './company-address-record/company-address-record.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {BrowserModule} from '@angular/platform-browser';
import {ControlMessagesComponent} from '../control-messages.component/control-messages.component';

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    ReactiveFormsModule,
    FormsModule
  ],
  declarations: [
    CompanyAddressRecordComponent,
    AddressDetailsComponent,
    ControlMessagesComponent
  ],
  exports:[
    CompanyAddressRecordComponent,
    AddressDetailsComponent,
    ControlMessagesComponent
  ]
})
export class AddressModule { }
