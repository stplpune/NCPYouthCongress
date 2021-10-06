import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CandidateRegistrationRoutingModule } from './candidate-registration-routing.module';
import { CandidateRegistrationComponent } from './candidate-registration.component';
import { NgxSelectModule } from 'ngx-select-ex';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import {MatCheckboxModule} from '@angular/material/checkbox';

@NgModule({
  declarations: [
    CandidateRegistrationComponent
  ],
  imports: [
    CommonModule,
    CandidateRegistrationRoutingModule,
    NgxSelectModule,
    FormsModule,
    ReactiveFormsModule,
    NgxPaginationModule,
    MatCheckboxModule,
  ]
})
export class CandidateRegistrationModule { }
