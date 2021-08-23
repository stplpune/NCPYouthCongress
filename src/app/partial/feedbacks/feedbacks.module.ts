import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FeedbacksRoutingModule } from './feedbacks-routing.module';
import { FeedbacksComponent } from './feedbacks.component';
import { NgxSelectModule } from 'ngx-select-ex';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import { NgxPaginationModule } from 'ngx-pagination';
import { TooltipModule } from '../directive/tooltip.module';

@NgModule({
  declarations: [
    FeedbacksComponent
  ],
  imports: [
    CommonModule,
    FeedbacksRoutingModule,
    NgxSelectModule,
    ReactiveFormsModule,
    FormsModule,
    NgxPaginationModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    TooltipModule,
  ]
})
export class FeedbacksModule { }
