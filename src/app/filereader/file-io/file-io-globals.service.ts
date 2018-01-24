import { Injectable } from '@angular/core';

@Injectable()
export class FileIoGlobalsService {
  public static attributeKey:String='_attr';
  public static innerTextKey:String='_text' ;
  public static defaultXSLName:String='REP_Combined.xsl' ;
  public static importSuccess:String='fileio.msg.success'; //json key
  public static parseFail:String='fileio.msg.parseFail';  //json key
  public static fileTypeError:String='fileio.msg.fileTypeError';
  constructor() { }

}
