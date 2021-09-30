import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ViewBoothVotersRoutingModule } from './view-booth-voters-routing.module';
import { ViewBoothVotersComponent } from './view-booth-voters.component';


@NgModule({
  declarations: [
    ViewBoothVotersComponent
  ],
  imports: [
    CommonModule,
    ViewBoothVotersRoutingModule
  ]
})
export class ViewBoothVotersModule { }
