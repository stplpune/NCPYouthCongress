import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AssignElectionsRoutingModule } from './assign-elections-routing.module';
import { AssignElectionsComponent } from './assign-elections.component';


@NgModule({
  declarations: [
    AssignElectionsComponent
  ],
  imports: [
    CommonModule,
    AssignElectionsRoutingModule
  ]
})
export class AssignElectionsModule { }
