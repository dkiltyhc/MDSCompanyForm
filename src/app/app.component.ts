import {Component, OnInit,ViewChild} from '@angular/core';
import {CompanyData} from './company.interfaces';
import {Validators, FormGroup, FormArray, FormBuilder} from '@angular/forms';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent  implements OnInit {
  title = 'App component';
  public myForm: FormGroup; // our form model

// we will use form builder to simplify our syntax
  constructor(private _fb: FormBuilder) { }

  ngOnInit() {
    this.myForm = this._fb.group({
      name: ['', [Validators.required, Validators.minLength(5)]],
      addresses: this._fb.array([

      ])

    });
  }

 initAddress() {
    // initialize our address
   // this.indexId++;
    return this._fb.group({
      id: [14],
      address: ['test1', Validators.required],
      city: ['test1']
    });
  }


/*
  removeAddress(i: number) {
    // remove address from the list
    const control = <FormArray>this.myForm.controls['addresses'];
    control.removeAt(i);
  }
*/


  save(model: CompanyData) {
    // call API to save customer
    //console.log(model);
  }


}
