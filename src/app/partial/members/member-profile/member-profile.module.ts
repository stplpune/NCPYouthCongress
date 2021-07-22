import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MemberProfileRoutingModule } from './member-profile-routing.module';
import { MemberProfileComponent } from './member-profile.component';


@NgModule({
  declarations: [
    MemberProfileComponent
  ],
  imports: [
    CommonModule,
    MemberProfileRoutingModule
  ]
})
export class MemberProfileModule { }
