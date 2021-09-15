import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreateElectionRoutingModule } from './create-election-routing.module';
import { CreateElectionComponent } from './create-election.component';
import { NgxSelectModule } from 'ngx-select-ex';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';

@NgModule({
  declarations: [
    CreateElectionComponent
  ],
  imports: [
    CommonModule,
    CreateElectionRoutingModule,
    NgxSelectModule,
    FormsModule,
    ReactiveFormsModule,
    NgxPaginationModule,
  ]
})
export class CreateElectionModule { }
