import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SocialMediaPersonRoutingModule } from './social-media-person-routing.module';
import { SocialMediaPersonComponent } from './social-media-person.component';


@NgModule({
  declarations: [
    SocialMediaPersonComponent
  ],
  imports: [
    CommonModule,
    SocialMediaPersonRoutingModule
  ]
})
export class SocialMediaPersonModule { }
