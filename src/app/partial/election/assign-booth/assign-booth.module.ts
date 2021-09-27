import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AssignBoothRoutingModule } from './assign-booth-routing.module';
import { AssignBoothComponent } from './assign-booth.component';
import { NgxSelectModule } from 'ngx-select-ex';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';

@NgModule({
  declarations: [
    AssignBoothComponent
  ],
  imports: [
    CommonModule,
    AssignBoothRoutingModule,
    NgxSelectModule,
    FormsModule,
    ReactiveFormsModule,
    NgxPaginationModule
  ]
})
export class AssignBoothModule { }
