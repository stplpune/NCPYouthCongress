import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AddMemberRoutingModule } from './add-member-routing.module';
import { AddMemberComponent } from './add-member.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxSelectModule } from 'ngx-select-ex';
import { MyProfileRoutingModule } from '../../user-profile/my-profile/my-profile-routing.module';
import { NgxPaginationModule } from 'ngx-pagination';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';


@NgModule({
  declarations: [
    AddMemberComponent
  ],
  imports: [
    CommonModule,
    AddMemberRoutingModule,
    MyProfileRoutingModule,
    NgxSelectModule,
    FormsModule,
    ReactiveFormsModule,
    NgxPaginationModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
  ]
})
export class AddMemberModule { }
