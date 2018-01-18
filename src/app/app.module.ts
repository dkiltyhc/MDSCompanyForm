import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {FormsModule,ReactiveFormsModule} from '@angular/forms';

import { AppComponent } from './app.component';
import {ExpanderComponent} from './expander.component';
import { TestComponentComponent } from './test-component/test-component.component';
import { ControlMessagesComponent } from './control-messages.component/control-messages.component';
import {AddressDetailsComponent} from './address/address.details.component';
import {ValidationService} from './validation.service';
import { AddressListComponent } from './address.list/address.list.component';
import {ErrorSummaryModule} from './error-msg/error-msg.module';
import { CompanyBaseComponent } from './company-base/company-base.component';
import {MainPipeModule} from './main-pipe/main-pipe.module';
import {GlobalsService} from './globals/globals.service';
//import {FocusModule} from 'angular2-focus';



@NgModule({
  declarations: [
    AppComponent,
    ExpanderComponent,
    TestComponentComponent,
    AddressDetailsComponent,
    ControlMessagesComponent,
    AddressListComponent,
    CompanyBaseComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    ErrorSummaryModule,
    MainPipeModule
   // FocusModule.forRoot()
  ],
  providers: [
    ValidationService,
    GlobalsService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
