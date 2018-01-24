import { Injectable } from '@angular/core';
import * as xml2js from 'xml2js';
import {ConvertResults} from './convert-results';
import {FileIoGlobalsService} from './file-io-globals.service';

@Injectable()
export class FileConversionService {

  constructor() { }


  /***
   * Converts an incoming json string to a json object
   * @param data -the json string to convert
   * @param convertResult -the json object to store the data in
   */
  convertToJSONObjects(data, convertResult:ConvertResults) {
    convertResult.messages=[];
    try {
      convertResult.result = JSON.parse(data);
      convertResult.messages.push(FileIoGlobalsService.importSuccess);
    } catch (e) {
      convertResult.result = null;
      convertResult.messages.push(FileIoGlobalsService.parseFail);
    }
  }

  /***
   *  Using xml2js to do the coversion from JSON to XML
   * @param data
   * @param convertResult
   */
  convertXMLToJSONObjects(data, convertResult:ConvertResults) {
    //see https://www.npmjs.com/package/xml2js for list of options
    let config = {
      attrkey: FileIoGlobalsService.attributeKey.toString(), //when there are attributes, this is the key, default $
      charkey: FileIoGlobalsService.innerTextKey.toString(), //when there are attributes, this what hte text value is of the tag
      trim: true,
      explicitArray: false, //Makes all the values an array
    };
    convertResult.messages=[];
    xml2js.parseString(data, config, function (err, result) {
      convertResult.result = result;
    });
    if (convertResult.result === null) {
      convertResult.messages.push(FileIoGlobalsService.parseFail);
    } else {
      convertResult.messages.push(FileIoGlobalsService.importSuccess);
    }
  }
  /***
   * Converts a json object to XML. Assumes root tag is root of JSON object
   * @param jsonObj
   * @returns {any}
   */
  convertJSONObjectsToXML(jsonObj, xslName: String = null) {
    if (!jsonObj) return null;
    let builder = new xml2js.Builder({
      headless:true,    //make headless for easier addition of xsl. Add header manualt
      attrkey: FileIoGlobalsService.attributeKey.toString(), //when there are attributes, this is the key, default $
      charkey: FileIoGlobalsService.innerTextKey.toString(), //when there are attributes, this what hte text value is of the tag
    });
    //making headless so easier to add the stylesheet info
    let xmlResult = builder.buildObject(jsonObj);

    if (!xslName) {
      xmlResult = '<?xml version="1.0" encoding="UTF-8"?>' + '<?xml-stylesheet  type="text/xsl" href='+FileIoGlobalsService.defaultXSLName+'?>' + xmlResult;
    } else {
      xmlResult = '<?xml version="1.0" encoding="UTF-8"?>' + '<?xml-stylesheet  type="text/xsl" href="' + xslName + '"?>' + xmlResult;
    }
    return xmlResult;
  }


}
