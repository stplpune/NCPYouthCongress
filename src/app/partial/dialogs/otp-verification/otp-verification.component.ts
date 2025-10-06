import { Component } from '@angular/core';
import { Inject } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { CallAPIService } from 'src/app/services/call-api.service';
import { CommonService } from 'src/app/services/common.service';
import { ConfigService } from 'src/app/services/config.service';
import { ValidatorService } from 'src/app/services/validator.service';

@Component({
  selector: 'app-otp-verification',
  templateUrl: './otp-verification.component.html',
  styleUrls: ['./otp-verification.component.css']
})
export class OtpVerificationComponent {

 otp:any = new FormControl('', [
  Validators.required,
  Validators.minLength(4),
  Validators.maxLength(4),
]);
  otpTimerFlag: boolean = false;
  otpTimerSub: any;
  otpTimer: number = 60;
  language!: string;

  constructor(
    private apiService: CallAPIService,
    public dialogRef: MatDialogRef<OtpVerificationComponent>,
    private ngxSpinnerService: NgxSpinnerService,
    private commonService: CommonService,
    private toastrService : ToastrService,
    private config: ConfigService,
    public translate: TranslateService,
    public validation: ValidatorService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    // ...existing code...
    this.config.setLanguage.subscribe((language: any) => {
      this.language = language;
    });
    this.otpTimerFlag = true;
    this.sendOtp();
  }

  sendOtp() {
    this.ngxSpinnerService.show();
    let obj = {
      mobileNo: this.data.mobileNo,
      name: this.data.name,
      otp: true,
      isMannkhatav_web: true
    };
    this.apiService.setHttp(
      'Post',
      'api/MissedCallService/AddOTP',
      false,
      obj,
      false,
      'shisankalpOrg'
    );
    this.apiService.getHttp().subscribe(
      (res: any) => {
        if (res.statusCode == '200') {
          this.ngxSpinnerService.hide();
          this.otpTimer = 60;
          this.setOtpTimer();
        } else {
          this.toastrService.error(res.statusMessage);
          this.ngxSpinnerService.hide();
        }
      },
      (error: any) => {
        // this.errorHandlerService.errorHandleMsg(error.status);
      }
    );
  }

  onNoClick(label: string): void {
     if (label === 'withOtp') {
      this.otp.markAsTouched(); // mark for UI errors
      if (this.otp.invalid) {
        return; // stop action and show validation errors
      }
  }
    let encOtp = this.commonService.encryption256(this.otp.value);
    let obj = {otp:(label == 'withOtp' ? encOtp:''), label:label}
    this.dialogRef.close(obj);
  }

  setOtpTimer() {
    this.otpTimerFlag = false;
    this.otpTimerSub = setInterval(() => {
      --this.otpTimer;

      if (this.otpTimer == 0) {
        this.otpTimerFlag = true;
        clearInterval(this.otpTimerSub);
        this.otpTimer = 60;
      }
    }, 2000);
  }
  
}
