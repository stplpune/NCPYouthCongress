import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MemberReportRoutingModule } from './member-report-routing.module';
import { MemberReportComponent } from './member-report.component';


@NgModule({
  declarations: [
    MemberReportComponent
  ],
  imports: [
    CommonModule,
    MemberReportRoutingModule
  ]
})
export class MemberReportModule { }
