import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NewsRoutingModule } from './news-routing.module';
import { NewsComponent } from './news.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { OwlNativeDateTimeModule, OwlDateTimeModule } from 'ng-pick-datetime';
import { NgxPaginationModule } from 'ngx-pagination';
import { NgxSelectModule } from 'ngx-select-ex';
import { ForwardActivitiesRoutingModule } from '../forward-activities/forward-activities-routing.module';


@NgModule({
  declarations: [
    NewsComponent
  ],
  imports: [
    CommonModule,
    NewsRoutingModule,
       ForwardActivitiesRoutingModule,
        NgxSelectModule,
        FormsModule,
        ReactiveFormsModule,
        OwlNativeDateTimeModule,
        OwlDateTimeModule,
        NgxPaginationModule
  ]
})
export class NewsModule { }
