import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { JoinUsMembersListRoutingModule } from './join-us-members-list-routing.module';
import { JoinUsMembersListComponent } from './join-us-members-list.component';
import { ReactiveFormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { NgxSelectModule } from 'ngx-select-ex';
import { TooltipModule } from '../../directive/tooltip.module';


@NgModule({
  declarations: [
    JoinUsMembersListComponent
  ],
  imports: [
    CommonModule,
    JoinUsMembersListRoutingModule,
    NgxSelectModule,
    ReactiveFormsModule, NgxPaginationModule,TooltipModule
  ]
})
export class JoinUsMembersListModule { }
