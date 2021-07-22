import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OrganizationMasterRoutingModule } from './organization-master-routing.module';
import { OrganizationMasterComponent } from './organization-master.component';
import { NgxSelectModule } from 'ngx-select-ex';

@NgModule({
  declarations: [
    OrganizationMasterComponent
  ],
  imports: [
    CommonModule,
    OrganizationMasterRoutingModule,
    NgxSelectModule
  ]
})
export class OrganizationMasterModule { }
