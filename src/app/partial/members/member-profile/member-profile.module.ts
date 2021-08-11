import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MemberProfileRoutingModule } from './member-profile-routing.module';
import { MemberProfileComponent } from './member-profile.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { NgxSelectModule } from 'ngx-select-ex';
import { AgmCoreModule } from '@agm/core';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';


@NgModule({
  declarations: [
    MemberProfileComponent
  ],
  imports: [
    CommonModule,
    MemberProfileRoutingModule,
    NgxSelectModule,
    ReactiveFormsModule,
    FormsModule,
    OwlDateTimeModule,
    NgxPaginationModule,
    OwlNativeDateTimeModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyA2AB0fKeqVHUUmRB1pvcaFRiDFTj8dSfM',
      language: 'en',
      libraries: ['places']
    }),
  ]
})
export class MemberProfileModule { }
