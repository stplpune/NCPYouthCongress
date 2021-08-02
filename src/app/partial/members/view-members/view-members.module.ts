import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ViewMembersRoutingModule } from './view-members-routing.module';
import { ViewMembersComponent } from './view-members.component';
import { NgxSelectModule } from 'ngx-select-ex';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';

@NgModule({
  declarations: [
    ViewMembersComponent
  ],
  imports: [
    CommonModule,
    ViewMembersRoutingModule,
    NgxSelectModule,
    NgxSelectModule,
    ReactiveFormsModule,
    FormsModule,
    NgxPaginationModule,
  ]
})
export class ViewMembersModule { }
