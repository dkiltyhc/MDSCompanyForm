import {Component} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';

//TODO this needs to not be in the nase component. base should have almost nothing in it, generic
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent{

  public translateInstance:TranslateService;

// we will use form builder to simplify our syntax
  constructor(private translate: TranslateService) {
    translate.setDefaultLang('fr');
    this.translateInstance=translate;
    // the lang to use, if the lang isn't available, it will use the current loader to get them
    translate.use('en');
    translate.get('hello parameter', {value: 'world'}).subscribe((res: string) => {
      console.log(res);

    });
    this.translate.get('error.msg.required').subscribe(res => { console.log(res); });
  }

}
