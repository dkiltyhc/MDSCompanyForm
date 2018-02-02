import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ErrorSummaryComponent } from './error-summary/error-summary.component';
import {MainPipeModule} from '../main-pipe/main-pipe.module';
import {ControlMessagesComponent} from './control-messages.component/control-messages.component';

@NgModule({
  imports: [
    CommonModule,
    MainPipeModule
  ],
  declarations: [
    ErrorSummaryComponent,
    ControlMessagesComponent
  ],
  exports:[
    ErrorSummaryComponent,
    ControlMessagesComponent
  ]
})
export class ErrorModule { }
