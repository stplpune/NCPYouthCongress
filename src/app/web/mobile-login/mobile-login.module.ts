import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MobileLoginRoutingModule } from './mobile-login-routing.module';
import { MobileLoginComponent } from './mobile-login.component';


@NgModule({
  declarations: [
    MobileLoginComponent
  ],
  imports: [
    CommonModule,
    MobileLoginRoutingModule
  ]
})
export class MobileLoginModule { }
