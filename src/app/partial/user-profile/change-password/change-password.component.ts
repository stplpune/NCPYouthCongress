import { Component, OnInit } from '@angular/core';
import { CallAPIService } from 'src/app/services/call-api.service';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from '../../../services/common.service';
import { FormBuilder, Validators } from '@angular/forms';
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css', '../../partial.component.css']
})
export class ChangePasswordComponent implements OnInit {


  changePasswordForm: any;
  submitted = false;
  show_button: Boolean = false;
  show_eye: Boolean = false;
  show_button1: Boolean = false;
  show_eye1: Boolean = false;
  show_button2: Boolean = false;
  show_eye2: Boolean = false;

  constructor(
    private callAPIService: CallAPIService,
    private spinner: NgxSpinnerService,
    private toastrService: ToastrService,
    private commonService: CommonService,
    private fb: FormBuilder,
  ) { }

  ngOnInit(): void {
    this.customForm();
  }

  customForm() {
    this.changePasswordForm = this.fb.group({
      userName: [this.commonService.loggedInUserName(), [Validators.required,]],
      oldPassword: ['', [Validators.required,]],
      newPassword: ['', [Validators.required, this.passwordValid]],
      ConfirmPassword: ['',[Validators.required, this.passwordValid]],
    })
  }

  get f() { return this.changePasswordForm.controls };

  onSubmit() {
    this.spinner.show();
    this.submitted = true;
    if (this.changePasswordForm.invalid) {
      this.spinner.hide();
      return;
    }
    else {
      if (this.changePasswordForm.value.newPassword == this.changePasswordForm.value.ConfirmPassword) {
        if(this.changePasswordForm.value.oldPassword == this.changePasswordForm.value.newPassword){
          this.toastrService.error('Old password and new password should not  be same')
          this.spinner.hide();
          return
        }
        let obj= 'UserId=' + this.commonService.loggedInUserId() + '&OldPassword=' + this.changePasswordForm.value.oldPassword + '&NewPassword=' + this.changePasswordForm.value.newPassword
        this.callAPIService.setHttp('get','Web_Update_Password?' + obj, false, false, false, 'ncpServiceForWeb');
        this.callAPIService.getHttp().subscribe((res: any) => {
          console.log(res)
          if (res.data1[0].Id!== 0) {
           this.toastrService.success(res.data1[0].Msg)
            this.spinner.hide();
            this.clearForm();
          }
          else {
            this.spinner.hide();
           this.toastrService.error(res.data1[0].Msg)
          }
        })
        this.spinner.hide();
      }
      else {
        this.spinner.hide();
        this.toastrService.error("New password and Confirm password should be same")
      }

    }

  
  }

  showPassword(data: any) {
    if (data == 'old') {
      this.show_button = !this.show_button;
      this.show_eye = !this.show_eye;
    } else if (data == 'new') {
      this.show_button1 = !this.show_button1;
      this.show_eye1 = !this.show_eye1;
    } else {
      this.show_button2 = !this.show_button2;
      this.show_eye2 = !this.show_eye2;
    }

  }

  clearForm() {
    this.submitted = false;
    this.changePasswordForm.reset({
      userName: this.commonService.loggedInUserName(),
      oldPassword: '',
      newPassword: '',
      ConfirmPassword: ''
    });
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
