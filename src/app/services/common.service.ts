import { Injectable } from '@angular/core';


@Injectable({
  providedIn: 'root'
})
export class CommonService {
  constructor() { }

  getLocalStorageData() {
    let loginObj = JSON.parse(localStorage.loggedInDetails).data1[0];
    return loginObj;
  }

  loggedInUserId() {
    let userId = this.getLocalStorageData();
    return userId.Id;
  }

  districtId() {
    let DistrictId = this.getLocalStorageData();
    return DistrictId.DistrictId;
  }

  loggedInUserName() {
    let Username = this.getLocalStorageData();
    return Username.Username;
  }
  
  codecareerPage:any;
  createCaptchaCarrerPage() {
    //clear the contents of captcha div first
    let id :any = document.getElementById('captcha');
    id.innerHTML = "";

    var charsArray =
    // "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ@!#$%^&*";
    "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    var lengthOtp = 6;
    var captcha = [];
    for (var i = 0; i < lengthOtp; i++) {
    //below code will not allow Repetition of Characters
    var index = Math.floor(Math.random() * charsArray.length + 1); //get the next character from the array
    if (captcha.indexOf(charsArray[index]) == -1)
    captcha.push(charsArray[index]);
    else i--;
    }
    var canv = document.createElement("canvas");
    canv.id = "captcha1";
    canv.width = 120;
    canv.height = 28;
    //var ctx:any = canv.getContext("2d");
    var ctx:any = canv.getContext("2d");
    ctx.font = "16px Arial";
    ctx.fillText(captcha.join(""), 0, 23);
    // ctx.strokeText(captcha.join(""), 0, 30);
    //storing captcha so that can validate you can save it somewhere else according to your specific requirements
    this.codecareerPage = captcha.join("");
    let appendChild :any = document.getElementById("captcha");
    appendChild.appendChild(canv); // adds the canvas to the body element
    }
    
    checkvalidateCaptcha() {
      return this.codecareerPage;
    }
}
