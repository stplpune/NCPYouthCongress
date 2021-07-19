import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SocialMediaMessagesRoutingModule } from './social-media-messages-routing.module';
import { SocialMediaMessagesComponent } from './social-media-messages.component';


@NgModule({
  declarations: [
    SocialMediaMessagesComponent
  ],
  imports: [
    CommonModule,
    SocialMediaMessagesRoutingModule
  ]
})
export class SocialMediaMessagesModule { }
