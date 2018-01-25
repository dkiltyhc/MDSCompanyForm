import { Injectable } from '@angular/core';

@Injectable()
export class FileIoGlobalsService {
  public static attributeKey:string='_attr';
  public static innerTextKey:string='_text' ;
  public static defaultXSLName:string='REP_Combined.xsl' ;
  public static importSuccess:string='fileio.msg.success'; //json key
  public static parseFail:string='fileio.msg.parseFail';  //json key
  public static fileTypeError:string='fileio.msg.fileTypeError';
  public static dataTypeError:string='fileio.msg.dataTypeError';
  public static draftFileType:string='hcsc';
  public static finalFileType:string='xml';
  constructor() { }

}
