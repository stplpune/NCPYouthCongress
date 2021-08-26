import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EventDetailRoutingModule } from './event-detail-routing.module';
import { EventDetailComponent } from './event-detail.component';
import { OwlNativeDateTimeModule, OwlDateTimeModule } from 'ng-pick-datetime';
import { NgxPaginationModule } from 'ngx-pagination';


@NgModule({
  declarations: [
    EventDetailComponent
  ],
  imports: [
    CommonModule,
    EventDetailRoutingModule,
    OwlNativeDateTimeModule,
    OwlDateTimeModule,
    NgxPaginationModule
  ]
})
export class EventDetailModule { }
