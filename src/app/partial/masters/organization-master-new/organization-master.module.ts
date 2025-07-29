import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TooltipModule } from '../../directive/tooltip.module';
import { OrganizationMasterRoutingModule } from './organization-master-routing.module';
import { OrganizationMasterComponent } from './organization-master.component';
import { NgxSelectModule } from 'ngx-select-ex';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import {DragDropModule} from '@angular/cdk/drag-drop';
import { MatIconModule } from '@angular/material/icon';


@NgModule({
  declarations: [
    OrganizationMasterComponent
  ],
  imports: [
    CommonModule,
    OrganizationMasterRoutingModule,
    NgxSelectModule,
    ReactiveFormsModule,
    FormsModule,
    NgxPaginationModule,
    TooltipModule,
    DragDropModule,
    MatIconModule
  ]
})
export class OrganizationMasterModule { }
