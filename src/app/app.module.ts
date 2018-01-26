import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {FormsModule,ReactiveFormsModule} from '@angular/forms';

import { AppComponent } from './app.component';
import {ExpanderComponent} from './expander.component';
import { TestComponentComponent } from './test-component/test-component.component';

import {ValidationService} from './validation.service';
import { AddressListComponent } from './address.list/address.list.component';
import {ErrorSummaryModule} from './error-msg/error-msg.module';
import { CompanyBaseComponent } from './company-base/company-base.component';
import {MainPipeModule} from './main-pipe/main-pipe.module';
import {GlobalsService} from './globals/globals.service';
import {AddressModule} from './address/address.module';
import {FileIoModule} from './filereader/file-io/file-io.module';

import {TranslateModule, TranslateLoader} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import {HttpClient, HttpClientModule} from '@angular/common/http';


//import {FocusModule} from 'angular2-focus';



@NgModule({
  declarations: [
    AppComponent,
    ExpanderComponent,
    TestComponentComponent,
    AddressListComponent,
    CompanyBaseComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    ErrorSummaryModule,
    MainPipeModule,
    AddressModule,
    FileIoModule,
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    })
  ],
  providers: [
    ValidationService,
    GlobalsService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }


export function HttpLoaderFactory(http: HttpClient) {
  //return new TranslateHttpLoader(http);
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}
