import {Component, Input, SimpleChanges} from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { ValidationService } from '../validation.service';

@Component({
  selector: 'control-messages',
  templateUrl: './control-messages.component.html',
  styleUrls: ['./control-messages.component.css']
})

export class ControlMessagesComponent {
  @Input() control: FormControl;
  @Input() showError:boolean=false;
  @Input() label:string;
  @Input() controlId:string;
  @Input() parentId:string;
  @Input() parentLabel:string;
  @Input() index:Number;
  public currentError:string="";
  private _errorVisible=false;
  constructor() { }

  ngOnChanges(changes: SimpleChanges) {

    if (changes['showError']) {
      this._errorVisible=changes['showError'].currentValue;
      this.makeErrorVisible();
    }
  }


  get errorMessage() {
    for (let propertyName in this.control.errors) {
      //if (this.control.errors.hasOwnProperty(propertyName)) {
        this.currentError=propertyName;
        return ValidationService.getValidatorErrorMessage(propertyName, this.control.errors[propertyName]);
     // }
    }
    this.currentError="";
    return null;
  }
  makeErrorVisible(){
    return ((this.control.invalid && this.control.touched)|| (this.control.invalid &&this._errorVisible));
  }

}



