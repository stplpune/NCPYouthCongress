import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SocialMediaMessagesRoutingModule } from './social-media-messages-routing.module';
import { SocialMediaMessagesComponent } from './social-media-messages.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxSelectModule } from 'ngx-select-ex';
import { NgxPaginationModule } from 'ngx-pagination';
import { AgmCoreModule } from '@agm/core';
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
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyA2AB0fKeqVHUUmRB1pvcaFRiDFTj8dSfM',
      language: 'en',
      libraries: ['places']
    }),
  ]
})
export class SocialMediaMessagesModule { }
