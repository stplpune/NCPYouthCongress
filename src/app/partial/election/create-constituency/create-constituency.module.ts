import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CreateConstituencyRoutingModule } from './create-constituency-routing.module';
import { CreateConstituencyComponent } from './create-constituency.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { NgxSelectModule } from 'ngx-select-ex';
import { AgmCoreModule } from '@agm/core';


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
    AgmCoreModule,
  ]
})
export class CreateConstituencyModule { }
