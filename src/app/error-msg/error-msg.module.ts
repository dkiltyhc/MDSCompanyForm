import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ErrorSummaryComponent } from './error-summary/error-summary.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    ErrorSummaryComponent
  ],
  exports:[
    ErrorSummaryComponent
  ]
})
export class ErrorSummaryModule { }
