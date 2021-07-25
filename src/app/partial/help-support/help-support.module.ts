import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HelpSupportRoutingModule } from './help-support-routing.module';
import { HelpSupportComponent } from './help-support.component';
import { NgxSelectModule } from 'ngx-select-ex';

@NgModule({
  declarations: [
    HelpSupportComponent
  ],
  imports: [
    CommonModule,
    HelpSupportRoutingModule,
    NgxSelectModule
  ]
})
export class HelpSupportModule { }
