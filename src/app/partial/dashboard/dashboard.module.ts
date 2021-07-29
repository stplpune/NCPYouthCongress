import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxSelectModule } from 'ngx-select-ex';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxDateRangeModule } from 'ngx-daterange';

@NgModule({
  declarations: [
    DashboardComponent
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    NgxSelectModule,
    FormsModule,
    NgxDateRangeModule,
    ReactiveFormsModule,
  
  ]
})
export class DashboardModule { }
