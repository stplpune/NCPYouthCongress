import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import { EventsRoutingModule } from './events-routing.module';
import { EventsComponent } from './events.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
@NgModule({
  declarations: [
    EventsComponent
  ],
  imports: [
    CommonModule,
    EventsRoutingModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    FormsModule,
    ReactiveFormsModule,
    NgxPaginationModule,
  ]
})
export class EventsModule { }
