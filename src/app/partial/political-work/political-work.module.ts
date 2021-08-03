import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxPaginationModule } from 'ngx-pagination';
import { PoliticalWorkRoutingModule } from './political-work-routing.module';
import { PoliticalWorkComponent } from './political-work.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    PoliticalWorkComponent
  ],
  imports: [
    CommonModule,
    PoliticalWorkRoutingModule,
    NgxPaginationModule,
    ReactiveFormsModule,
    FormsModule
  ]
})
export class PoliticalWorkModule { }
