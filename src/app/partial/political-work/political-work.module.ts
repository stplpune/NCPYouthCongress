import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PoliticalWorkRoutingModule } from './political-work-routing.module';
import { PoliticalWorkComponent } from './political-work.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxSelectModule } from 'ngx-select-ex';
import { NgxPaginationModule } from 'ngx-pagination';

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
  ]
})
export class PoliticalWorkModule { }
