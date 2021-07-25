import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OrganizationDetailsRoutingModule } from './organization-details-routing.module';
import { OrganizationDetailsComponent } from './organization-details.component';
import { NgxSelectModule } from 'ngx-select-ex';

@NgModule({
  declarations: [
    OrganizationDetailsComponent
  ],
  imports: [
    CommonModule,
    OrganizationDetailsRoutingModule,
    NgxSelectModule
  ]
})
export class OrganizationDetailsModule { }
