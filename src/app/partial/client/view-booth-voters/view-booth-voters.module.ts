import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ViewBoothVotersRoutingModule } from './view-booth-voters-routing.module';
import { ViewBoothVotersComponent } from './view-booth-voters.component';
import { NgxSelectModule } from 'ngx-select-ex';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { Ng2SearchPipeModule } from 'ng2-search-filter';

@NgModule({
  declarations: [
    ViewBoothVotersComponent
  ],
  imports: [
    CommonModule,
    ViewBoothVotersRoutingModule,
    NgxSelectModule,
    FormsModule,
    ReactiveFormsModule,
    NgxPaginationModule,
    Ng2SearchPipeModule,
  ]
})
export class ViewBoothVotersModule { }
