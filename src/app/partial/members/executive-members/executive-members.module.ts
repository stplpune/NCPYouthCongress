import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ExecutiveMembersRoutingModule } from './executive-members-routing.module';
import { ExecutiveMembersComponent } from './executive-members.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { NgxSelectModule } from 'ngx-select-ex';


@NgModule({
  declarations: [
    ExecutiveMembersComponent
  ],
  imports: [
    CommonModule,
    ExecutiveMembersRoutingModule,
    NgxSelectModule,
    ReactiveFormsModule,
    FormsModule,
    NgxPaginationModule,
  ]
})
export class ExecutiveMembersModule { }
