import {Component, OnInit, EventEmitter, ElementRef, Output, Input} from '@angular/core';

import * as xml2js from 'xml2js';
@Component({
  selector: 'filereader',
  templateUrl: './filereader.component.html',
  styleUrls: ['./filereader.component.css']
})

export class FilereaderComponent implements OnInit {
  @Output() complete = new EventEmitter();
  @ Input() rootTag: String = '';
  @Input() saveType: String = 'JSON';

  constructor(public elementRef: ElementRef) {
  }

  ngOnInit() {
  }

  changeListener($event: any) {

    this.readThis($event.target);

  }

  readThis(inputValue: any): void {
    let file: File = inputValue.files[0];
    let myReader: FileReader = new FileReader();
    let self = this;
    myReader.onloadend = function (e) {
      // you can perform an action with data here callback for asynch load
      console.log("Inside the end");
      console.log(myReader.result);
      let convertResult = {jsonResult: null, messsages: null};
        self._readFile(file.name, myReader.result, self,convertResult);
      self.complete.emit(convertResult);
    };
    if (file && file.name) {
      myReader.readAsText(file);
    }
  }

  private  _readFile(name, result, self,convertResult) {
    let splitFile = name.split('.');
    let fileType = splitFile[splitFile.length - 1];
    if ((fileType.toLowerCase()) == 'hcsc') {
      //convertToJSONObjects(reader);
      //checkRootTagMatch(reader, scope);
    } else if ((fileType.toLowerCase() === "xml")) {
      self.convertXMLToJSONObjects(result,convertResult);
      //checkRootTagMatch(reader, scope);
    } else {
      convertResult.parseResult = null;
      convertResult.messages = 'File type error';
    }
  }

   convertXMLToJSONObjects(data, convertResult) {
   /* const xmlConfig = {
      escapeMode: true,
      emptyNodeForm: "text",
      useDoubleQuotes: true
    };*/
    xml2js.parseString(data, function (err, result) {
      console.log(result); // Prints JSON object!
      convertResult.jsonResult=result;
    });
    if (convertResult.jsonResult === null) {
      convertResult.messages = "Parse Fail";
    } else {
      convertResult.messages = "success";
    }
  }

}
