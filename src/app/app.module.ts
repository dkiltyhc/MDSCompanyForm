import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {FormsModule,ReactiveFormsModule} from '@angular/forms';

import { AppComponent } from './app.component';
import {ValidationService} from './validation.service';
import {ErrorModule} from './error-msg/error-ui.module';
import { CompanyBaseComponent } from './company-base/company-base.component';
import {MainPipeModule} from './main-pipe/main-pipe.module';
import {GlobalsService} from './globals/globals.service';
import {AddressModule} from './address/address.module';
import {FileIoModule} from './filereader/file-io/file-io.module';

import {TranslateModule, TranslateLoader} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import {CommonFeatureModule} from './common/common-feature.module';
import {TherapeuticModule} from './therapeutic/therapeutic.module';


@NgModule({
  declarations: [
    AppComponent,
    CompanyBaseComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    ErrorModule,
    MainPipeModule,
    AddressModule,
    FileIoModule,
    HttpClientModule,
    CommonFeatureModule,
    TherapeuticModule,
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
