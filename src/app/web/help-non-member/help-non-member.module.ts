import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HelpNonMemberRoutingModule } from './help-non-member-routing.module';
import { HelpNonMemberComponent } from './help-non-member.component';


@NgModule({
  declarations: [
    HelpNonMemberComponent
  ],
  imports: [
    CommonModule,
    HelpNonMemberRoutingModule
  ]
})
export class HelpNonMemberModule { }
