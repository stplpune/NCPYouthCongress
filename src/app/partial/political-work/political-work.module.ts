import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PoliticalWorkRoutingModule } from './political-work-routing.module';
import { PoliticalWorkComponent } from './political-work.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxSelectModule } from 'ngx-select-ex';
import { NgxPaginationModule } from 'ngx-pagination';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';

@NgModule({
  declarations: [
    PoliticalWorkComponent
  ],
  imports: [
    CommonModule,
    PoliticalWorkRoutingModule,
    NgxPaginationModule,
    ReactiveFormsModule,
    FormsModule,
    NgxSelectModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
  ]
})
export class PoliticalWorkModule { }
