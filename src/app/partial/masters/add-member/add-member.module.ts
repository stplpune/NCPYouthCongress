import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AddMemberRoutingModule } from './add-member-routing.module';
import { AddMemberComponent } from './add-member.component';


@NgModule({
  declarations: [
    AddMemberComponent
  ],
  imports: [
    CommonModule,
    AddMemberRoutingModule
  ]
})
export class AddMemberModule { }
