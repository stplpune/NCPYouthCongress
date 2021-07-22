import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ViewMembersRoutingModule } from './view-members-routing.module';
import { ViewMembersComponent } from './view-members.component';
import { NgxSelectModule } from 'ngx-select-ex';

@NgModule({
  declarations: [
    ViewMembersComponent
  ],
  imports: [
    CommonModule,
    ViewMembersRoutingModule,
    NgxSelectModule
  ]
})
export class ViewMembersModule { }
