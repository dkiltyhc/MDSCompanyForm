import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ErrorSummaryComponent } from './error-summary/error-summary.component';
import {MainPipeModule} from '../main-pipe/main-pipe.module';

@NgModule({
  imports: [
    CommonModule,
    MainPipeModule
  ],
  declarations: [
    ErrorSummaryComponent
  ],
  exports:[
    ErrorSummaryComponent
  ]
})
export class ErrorSummaryModule { }
