import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MobileLoginRoutingModule } from './mobile-login-routing.module';
import { MobileLoginComponent } from './mobile-login.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ToastrModule } from 'ngx-toastr';


@NgModule({
  declarations: [
    MobileLoginComponent
  ],
  imports: [
    CommonModule,
    MobileLoginRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    ToastrModule
  ]
})
export class MobileLoginModule { }
