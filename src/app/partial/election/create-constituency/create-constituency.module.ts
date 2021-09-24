import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CreateConstituencyRoutingModule } from './create-constituency-routing.module';
import { CreateConstituencyComponent } from './create-constituency.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { NgxSelectModule } from 'ngx-select-ex';


@NgModule({
  declarations: [
    CreateConstituencyComponent
  ],
  imports: [
    CommonModule,
    CreateConstituencyRoutingModule,
    NgxSelectModule,
    FormsModule,
    ReactiveFormsModule,
    NgxPaginationModule,
  ]
})
export class CreateConstituencyModule { }
