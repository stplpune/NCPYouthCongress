import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { CallAPIService } from 'src/app/services/call-api.service';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  submitted = false;
  show_button: Boolean = false;
  show_eye: Boolean = false;
  date: any = new Date();
  
  constructor(private callAPIService: CallAPIService, private fb: FormBuilder,
    private spinner:NgxSpinnerService,
    private toastrService: ToastrService, private router: Router,
     private route: ActivatedRoute, private commonService: CommonService) { }

  ngOnInit(): void {
    this.reCaptcha();
    this.defaultLoginForm();
  }

  defaultLoginForm() {
    this.loginForm = this.fb.group({
      UserName: ['', Validators.required],
      Password: ['',  [this.passwordValid]],
      recaptchaReactive: ['', Validators.required],
    })
  }
  get f() { return this.loginForm.controls };

  onSubmit() {
    this.spinner.show();
    this.submitted = true;
    if (this.loginForm.invalid) {
      this.spinner.hide();
      return;
    }
    else if (this.loginForm.value.recaptchaReactive != this.commonService.checkvalidateCaptcha()) {
      this.spinner.hide();
      this.toastrService.error("Invalid Captcha. Please try Again");
    }

    else {
      // this.callAPIService.setHttp('get', 'Web_GetLogin_1_0?UserName=' + this.loginForm.value.UserName + '&Password=' + this.loginForm.value.Password, false, false, false, 'ncpServiceForWeb');
      this.callAPIService.setHttp('get', 'Web_GetLogin_2_0?UserName=' + this.loginForm.value.UserName + '&Password=' + this.loginForm.value.Password, false, false, false, 'ncpServiceForWeb');
      this.callAPIService.getHttp().subscribe((res: any) => {
        if (res.data == '0') {
          sessionStorage.setItem('loggedInDetails', JSON.stringify(res));
          sessionStorage.setItem('loginDateTime', this.date)
          this.spinner.hide();
          let logInUserType =  this.commonService.loggedInUserType();
          this.toastrService.success('login successfully');
          this.router.navigate(['../dashboard'], { relativeTo: this.route })
          // if(logInUserType == 1){
          //   this.router.navigate(['../dashboard'],{ relativeTo: this.route });
          // }else {
          //   this.router.navigate(['../e-dashboard'],{ relativeTo: this.route });
          // }
        } else {
          if (res.data == 1) {
            this.toastrService.error("Invalid Credentials");
          } else {
            this.toastrService.error("Please try again something went wrong");
          }
          this.spinner.hide();
        }
      })
    }
    this.reCaptcha();
  }

  reCaptcha(){
    // this.loginForm.controls['recaptchaReactive'].reset();
    this.commonService.createCaptchaCarrerPage();
  }

  showPassword() {
    this.show_button = !this.show_button;
    this.show_eye = !this.show_eye;
  }

  
  passwordValid(controls:any) {
    const regExp = new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d.*)(?=.*\W.*)[a-zA-Z0-9\S]{8,}$/);
    if (regExp.test(controls.value)) {
      return null;
    } else {
      return { passwordValid: true }
    }
  }

}
