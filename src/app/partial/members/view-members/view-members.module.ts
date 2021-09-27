import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ViewMembersRoutingModule } from './view-members-routing.module';
import { ViewMembersComponent } from './view-members.component';
import { NgxSelectModule } from 'ngx-select-ex';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { TooltipModule } from '../../directive/tooltip.module';
@NgModule({
  declarations: [
    ViewMembersComponent
  ],
  imports: [
    CommonModule,
    ViewMembersRoutingModule,
    NgxSelectModule,
    ReactiveFormsModule,
    FormsModule,
    NgxPaginationModule,
    TooltipModule,
  ]
})
export class ViewMembersModule { }
