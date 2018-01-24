import {Component, OnInit, EventEmitter, ElementRef, Output, Input} from '@angular/core';

import * as xml2js from 'xml2js';
import {ConvertResults} from '../convert-results';
import {FileConversionService} from '../file-conversion.service';
import {FileIoGlobalsService} from '../file-io-globals.service';


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

    this.readSelectedFile($event.target);

  }

  readSelectedFile(inputValue: any): void {
    let file: File = inputValue.files[0];
    let myReader: FileReader = new FileReader();
    let self = this;
    myReader.onloadend = function (e) {
      // you can perform an action with data here callback for asynch load
      let convertResult = new ConvertResults();
      FilereaderComponent._readFile(file.name, myReader.result, self, convertResult);
      self.complete.emit(convertResult);
    };
    if (file && file.name) {
      myReader.readAsText(file);
    }
  }

  private static _readFile(name, result, self, convertResult) {
    let splitFile = name.split('.');
    let fileType = splitFile[splitFile.length - 1];
    let conversion:FileConversionService =new FileConversionService();

    if ((fileType.toLowerCase()) == 'hcsc') {
      conversion.convertToJSONObjects(result, convertResult);
      //checkRootTagMatch(reader, scope);
    } else if ((fileType.toLowerCase() === 'xml')) {
      conversion.convertXMLToJSONObjects(result, convertResult);
      //checkRootTagMatch(reader, scope);
    } else {
      convertResult.parseResult = null;
      convertResult.messages = FileIoGlobalsService.fileTypeError;
    }
  }
}
