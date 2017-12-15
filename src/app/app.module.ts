import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {FormsModule,ReactiveFormsModule} from '@angular/forms';

import { AppComponent } from './app.component';
import {ExpanderComponent} from './expander.component';
import { TestComponentComponent } from './test-component/test-component.component';
import { ControlMessagesComponent } from './control-messages.component/control-messages.component';
import {AddressDetailsComponent} from './address/address.details.component';
import {ValidationService} from './validation.service';

@NgModule({
  declarations: [
    AppComponent,
    ExpanderComponent,
    TestComponentComponent,
    AddressDetailsComponent,
    ControlMessagesComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [ ValidationService ],
  bootstrap: [AppComponent]
})
export class AppModule { }
