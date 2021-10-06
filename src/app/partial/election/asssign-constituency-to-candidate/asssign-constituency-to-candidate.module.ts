import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AsssignConstituencyToCandidateRoutingModule } from './asssign-constituency-to-candidate-routing.module';
import { AsssignConstituencyToCandidateComponent } from './asssign-constituency-to-candidate.component';


@NgModule({
  declarations: [
    AsssignConstituencyToCandidateComponent
  ],
  imports: [
    CommonModule,
    AsssignConstituencyToCandidateRoutingModule
  ]
})
export class AsssignConstituencyToCandidateModule { }
