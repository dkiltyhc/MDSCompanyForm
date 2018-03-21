import { Injectable } from '@angular/core';

@Injectable()
export class GlobalsService {
  public static errorSummClassName:string='ErrorSummaryComponent';
  public static CANADA:string='CAN';
  public static USA:string='USA';
  constructor() { }

}
