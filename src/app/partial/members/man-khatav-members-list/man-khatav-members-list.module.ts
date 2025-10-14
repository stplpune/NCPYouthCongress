import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ManKhatavMembersListRoutingModule } from './man-khatav-members-list-routing.module';
import { ManKhatavMembersListComponent } from './man-khatav-members-list.component';
import { ReactiveFormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { NgxSelectModule } from 'ngx-select-ex';
import { TooltipModule } from '../../directive/tooltip.module';


@NgModule({
  declarations: [
    ManKhatavMembersListComponent
  ],
  imports: [
    CommonModule,
    ManKhatavMembersListRoutingModule,
    NgxSelectModule,
        ReactiveFormsModule, NgxPaginationModule,TooltipModule
  ]
})
export class ManKhatavMembersListModule { }
