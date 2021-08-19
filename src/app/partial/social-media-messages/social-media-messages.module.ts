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
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyBCSDtf8g7XZ9B-P20ZqzOIr1TUQAg4Fj0',
      language: 'en',
      libraries: ['geometry','places']
    }),
  ]
})
export class SocialMediaMessagesModule { }
