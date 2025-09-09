import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class ConfigService {

  setLanguage = new BehaviorSubject('');
  checkHeaderFooterVisibility: string[] = ['/login','/join-us'];
  userToken: string = "9090909080808080";
  countryId = 106; //  india
  stateId = 27;
  districtId = 494; // satara

  //=========================================================== Dialog configuration========================================================

  dialogWidths: string[] = ['320px', '800px', '700px', '1024px'];
  disableCloseBtnFlag: boolean = true;
  pageSize: number = 10;
  formFieldAppearance: string = "fill"; // fill | outline


}

