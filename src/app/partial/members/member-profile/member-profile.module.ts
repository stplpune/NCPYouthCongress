import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LightboxModule } from '@ngx-gallery/lightbox';
import { GalleryModule } from '@ngx-gallery/core';
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
    LightboxModule ,
    GalleryModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyBCSDtf8g7XZ9B-P20ZqzOIr1TUQAg4Fj0',
      language: 'en',
      libraries: ['geometry','places']
    }),
  ]
})
export class MemberProfileModule { }
