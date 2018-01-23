import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FilereaderComponent} from './filereader/filereader.component';
import {CompanyAddressRecordComponent} from '../../address/company-address-record/company-address-record.component';
import {ControlMessagesComponent} from '../../control-messages.component/control-messages.component';
import {AddressDetailsComponent} from '../../address/address.details.component';
@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [FilereaderComponent],
  exports:[
    FilereaderComponent
  ]
})
export class FileIoModule { }
