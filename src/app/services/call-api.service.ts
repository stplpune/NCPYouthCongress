import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})

export class CallAPIService {

  UserLoginDetails: any;
  userObj: any;
  tokanExpiredFlag: boolean = false;
  getBaseurl(url: string) {
    switch (url) {
      //Test server base url 
      // case 'ncpservice': return 'http://ncpservice.erpguru.in/service.asmx/'; break;
      case 'ncpServiceForWeb': return 'http://ncpservice.erpguru.in/service.asmx/'; break;
      default: return ''; break;
    }
  }
  private httpObj: any = {
    type: '',
    url: '',
    options: Object
  };
  clearHttp() {
    this.httpObj.type = '';
    this.httpObj.url = '';
    this.httpObj.options = {};
  }
  constructor(private http: HttpClient, private datepipe: DatePipe, private router: Router) {

  }


  getHttp(): any {
    let temp: any = undefined;
    !this.httpObj.options.body && (delete this.httpObj.options.body)
    !this.httpObj.options.params && (delete this.httpObj.options.params)
    return this.http.request(this.httpObj.type, this.httpObj.url, this.httpObj.options);
  }

  setHttp(type: string, url: string, isHeader: Boolean, obj: any, params: any, baseUrl: any) {
    isHeader = false;
    // check user is login or not 
    try {
      this.userObj = JSON.parse(localStorage.loggedInDetails);
      // this.UserLoginDetails = JSON.parse(localStorage.loggedInDetails);
    } catch (e) { }
    this.clearHttp();
    this.httpObj.type = type;
    this.httpObj.url = this.getBaseurl(baseUrl) + url;
    if (isHeader) {
      let tempObj: any = {
        "Authorization": "Bearer " + this.userObj.responseData3.accessToken // token set
      };
      // if (this.UserLoginDetails && type !== 'get') {
      //   tempObj.UserId = this.UserLoginDetails.responseData[0].id;
      //   tempObj.UserType = this.UserLoginDetails.responseData[0].userType;
      // }
      this.httpObj.options.headers = new HttpHeaders(tempObj);
    }

    if (obj !== false) {
      this.httpObj.options.body = obj;
    }
    else {
      this.httpObj.options.body = false;
    }
    if (params !== false) {
      this.httpObj.options.params = params;
    }
    else {
      this.httpObj.options.params = false;
    }
  }
}
