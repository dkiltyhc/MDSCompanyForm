import {AfterViewInit, Component, OnInit, QueryList, ViewChild, ViewChildren} from '@angular/core';
import {CompanyData} from './company.interfaces';
import {Validators, FormGroup, FormArray, FormBuilder} from '@angular/forms';
import {ControlMessagesComponent} from "./control-messages.component/control-messages.component";
import {AddressListComponent} from "./address.list/address.list.component";
import {AddressDetailsComponent} from "./address/address.details.component";


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})


export class AppComponent  implements OnInit, AfterViewInit {
  title = 'App component';
  public myForm: FormGroup; // our form model



// we will use form builder to simplify our syntax
  constructor(private _fb: FormBuilder) { }
  @ViewChildren(AddressListComponent)
  allWriters: QueryList<AddressListComponent>;

  ngOnInit() {
    //create the blank form
    this.myForm = this._fb.group({
      name: ['', [Validators.required, Validators.minLength(5)]],
      addresses: this._fb.array([])
    });



  }
  ngAfterViewInit() {
/*
    this.allWriters.changes.subscribe(list => {
      console.log("@@@@@@@@@@@@@@@@@This is  @@@@@@@@@@@@@@")
      list.forEach(writer => console.log("This is hth errror"+writer));
    });
*/
    //this.innerComponents.changes
    //  .subscribe(e => this.lastVal = (e.last || {}).val);\\

    this.allWriters.changes.subscribe(() => {
      console.log("subscribe");
      this.allWriters.toArray().forEach(el => {
        console.log("found stuff")
        console.log(el);
      });
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

  getErrorComponents(){

    if(this.allWriters)
    console.log(this.allWriters.length);
    console.log(this.allWriters);
  }




  save(model: CompanyData) {
    // call API to save customer
    //console.log(model);
  }




}
