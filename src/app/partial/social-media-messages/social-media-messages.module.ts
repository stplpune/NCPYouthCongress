import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SocialMediaMessagesRoutingModule } from './social-media-messages-routing.module';
import { SocialMediaMessagesComponent } from './social-media-messages.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxSelectModule } from 'ngx-select-ex';
import { NgxPaginationModule } from 'ngx-pagination';
import { AgmCoreModule } from '@agm/core';
import { LightboxModule } from '@ngx-gallery/lightbox';
import { GalleryModule } from '@ngx-gallery/core';
import { OwlNativeDateTimeModule, OwlDateTimeModule } from 'ng-pick-datetime';

@NgModule({
  declarations: [
    SocialMediaMessagesComponent
  ],
  imports: [
    CommonModule,
    SocialMediaMessagesRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgxSelectModule,
    NgxPaginationModule,
    LightboxModule,
    GalleryModule,
    OwlNativeDateTimeModule,
    OwlDateTimeModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyAkNBALkBX7trFQFCrcHO2I85Re2MmzTo8',
      language: 'en',
      libraries: ['geometry','places']
    }),
  ]
})
export class SocialMediaMessagesModule { }
