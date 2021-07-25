import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ExecutiveMembersRoutingModule } from './executive-members-routing.module';
import { ExecutiveMembersComponent } from './executive-members.component';


@NgModule({
  declarations: [
    ExecutiveMembersComponent
  ],
  imports: [
    CommonModule,
    ExecutiveMembersRoutingModule
  ]
})
export class ExecutiveMembersModule { }
