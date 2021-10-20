import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { CallAPIService } from 'src/app/services/call-api.service';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-mobile-login',
  templateUrl: './mobile-login.component.html',
  styleUrls: ['./mobile-login.component.css']
})
export class MobileLoginComponent implements OnInit {
  loginForm!: FormGroup;
  submitted = false;
  show_button: Boolean = false;
  show_eye: Boolean = false;

  constructor(private callAPIService: CallAPIService, private fb: FormBuilder,
    private spinner: NgxSpinnerService,
    private toastrService: ToastrService, private router: Router,
    private route: ActivatedRoute, private commonService: CommonService) { }

  ngOnInit(): void {
    let getDataUrl = this.route.snapshot.params;
    this.defaultLoginForm(getDataUrl.un, getDataUrl.ps); 
    this.checkLoginDetails();
  }

  defaultLoginForm(uname:any, password:any) {
    this.loginForm = this.fb.group({
      UserName: [uname, Validators.required],
      Password: [password,  [Validators.required, this.passwordValid]],
    })
  }

  get f() { return this.loginForm.controls };


  checkLoginDetails() {
    let data = this.loginForm.value
    this.callAPIService.setHttp('get', 'Web_GetLogin_3_0?UserName=' + data.UserName + '&Password=' + data.Password + '&LoginType=2', false, false, false, 'ncpServiceForWeb');
    this.callAPIService.getHttp().subscribe((res: any) => {
      if (res.data == '0') {
        sessionStorage.setItem('loggedInDetails', JSON.stringify(res));
        this.spinner.hide();
        this.toastrService.success('login successfully');

        this.router.navigate(['../../../' + this.commonService.redirectToDashborad()], { relativeTo: this.route })
      } else {
        if (res.data == 1) {
          this.toastrService.error("Login Failed.Please check UserName and Password");
        } else {
          this.toastrService.error("Please try again something went wrong");
        }
        this.spinner.hide();
      }
    })
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
