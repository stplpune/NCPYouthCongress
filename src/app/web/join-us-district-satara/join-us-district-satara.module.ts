import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { JoinUsDistrictSataraRoutingModule } from './join-us-district-satara-routing.module';
import { JoinUsDistrictSataraComponent } from './join-us-district-satara.component';
import { NgxSelectModule } from 'ngx-select-ex';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { MatDialogModule } from '@angular/material/dialog';
import { CapitalizeWordsDirective } from 'src/app/partial/directive/capitalize-words.directive';


@NgModule({
  declarations: [
    JoinUsDistrictSataraComponent,
    CapitalizeWordsDirective
  ],
  imports: [
    CommonModule,
    JoinUsDistrictSataraRoutingModule,
    NgxSelectModule,
    ReactiveFormsModule,
    TranslateModule,
    MatDialogModule
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ]
})
export class JoinUsDistrictSataraModule { }
