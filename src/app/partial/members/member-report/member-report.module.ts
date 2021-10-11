import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MemberReportRoutingModule } from './member-report-routing.module';
import { MemberReportComponent } from './member-report.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { NgxSelectModule } from 'ngx-select-ex';
import { TooltipModule } from '../../directive/tooltip.module';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import { LightboxModule } from '@ngx-gallery/lightbox';
import { GalleryModule } from '@ngx-gallery/core';


@NgModule({
  declarations: [
    MemberReportComponent
  ],
  imports: [
    CommonModule,
    MemberReportRoutingModule,
    NgxSelectModule,
    ReactiveFormsModule,
    FormsModule,
    NgxPaginationModule,
    TooltipModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    LightboxModule,
    GalleryModule,
  ]
})
export class MemberReportModule { }
