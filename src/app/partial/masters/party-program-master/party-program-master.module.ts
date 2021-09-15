import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PartyProgramMasterRoutingModule } from './party-program-master-routing.module';
import { PartyProgramMasterComponent } from './party-program-master.component';
import { NgxSelectModule } from 'ngx-select-ex';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import { NgxPaginationModule } from 'ngx-pagination';
import { TooltipModule } from '../../directive/tooltip.module';

@NgModule({
  declarations: [
    PartyProgramMasterComponent
  ],
  imports: [
    CommonModule,
    PartyProgramMasterRoutingModule,
    NgxSelectModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    FormsModule,
    ReactiveFormsModule,
    NgxPaginationModule,
    TooltipModule
  ]
})
export class PartyProgramMasterModule { }
