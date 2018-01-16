import { Component, Input } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { ValidationService } from '../validation.service';

@Component({
  selector: 'control-messages',
  templateUrl: './control-messages.component.html',
  styleUrls: ['./control-messages.component.css']
})

export class ControlMessagesComponent {
  @Input() control: FormControl;
  @Input() label:String;
  @Input() controlId:String;
  @Input() parentId:String;
  @Input() parentLabel:String;
  @Input() index:Number;
  public currentError:String="";
  constructor() { }

  get errorMessage() {
    for (let propertyName in this.control.errors) {
      console.log(propertyName);
      if (this.control.errors.hasOwnProperty(propertyName) && this.control.touched) {
        this.currentError=propertyName;
        return ValidationService.getValidatorErrorMessage(propertyName, this.control.errors[propertyName]);
      }
    }
    this.currentError="";
    return null;
  }
}



