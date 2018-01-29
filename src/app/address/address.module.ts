import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {AddressDetailsComponent} from './address.details/address.details.component';
import{CompanyAddressRecordComponent} from './company-address-record/company-address-record.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {BrowserModule} from '@angular/platform-browser';
import {ControlMessagesComponent} from '../control-messages.component/control-messages.component';
import {SelectModule} from 'ng2-select';
import {FileIoModule} from '../filereader/file-io/file-io.module';
import {ErrorSummaryModule} from '../error-msg/error-msg.module';

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    ReactiveFormsModule,
    FormsModule,
    SelectModule,
    FileIoModule,
    ErrorSummaryModule

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
