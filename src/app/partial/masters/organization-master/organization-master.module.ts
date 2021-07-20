import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OrganizationMasterRoutingModule } from './organization-master-routing.module';
import { OrganizationMasterComponent } from './organization-master.component';


@NgModule({
  declarations: [
    OrganizationMasterComponent
  ],
  imports: [
    CommonModule,
    OrganizationMasterRoutingModule
  ]
})
export class OrganizationMasterModule { }
