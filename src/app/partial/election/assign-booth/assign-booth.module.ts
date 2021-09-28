import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AssignBoothRoutingModule } from './assign-booth-routing.module';
import { AssignBoothComponent } from './assign-booth.component';
import { NgxSelectModule } from 'ngx-select-ex';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import {MatCheckboxModule} from '@angular/material/checkbox';

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
    NgxPaginationModule,
    MatCheckboxModule
  ]
})
export class AssignBoothModule { }
