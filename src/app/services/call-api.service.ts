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
      //live server base url 
      case 'ncpServiceForWeb': return 'http://ncpwebservice.ncpyouths.com/Service.asmx/'; break;
      //development server base url 
      // case 'ncpServiceForWeb': return 'http://ncpserviceweb.eanifarm.com/Service.asmx/'; break;
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
    //this.logOutAfterOneHour();
    isHeader = false;
    // check user is login or not 
    try {
      this.userObj = JSON.parse(sessionStorage.loggedInDetails);
      // this.UserLoginDetails = JSON.parse(sessionStorage.loggedInDetails);
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

  logOutAfterOneHour() { // session time out after 1 hours
    let currentDate: any = new Date();
    let currentTime = currentDate.getTime();

    let loginDateTime: any = sessionStorage.getItem('loginDateTime');
    let loginTime = new Date(loginDateTime);
    let checkloginTime = loginTime.getTime();

    let diff = currentTime - checkloginTime

    var hh: any = Math.floor(diff / 1000 / 60 / 60);
    hh = ('0' + hh).slice(-2)

    // var timeDiff:any -= hh * 1000 * 60 * 60;
    var mm: any = Math.floor(diff / 1000 / 60);
    mm = ('0' + mm).slice(-2)

    // var timeDiff:any -= mm * 1000 * 60;
    var ss: any = Math.floor(diff / 1000);
    ss = ('0' + ss).slice(-2)

    if (mm > 60) {
      sessionStorage.clear();
      this.router.navigate(['../home']);
    }

  }

}
