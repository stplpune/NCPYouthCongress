import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SocialMediaImageRoutingModule } from './social-media-image-routing.module';
import { SocialMediaImageComponent } from './social-media-image.component';


@NgModule({
  declarations: [
    SocialMediaImageComponent
  ],
  imports: [
    CommonModule,
    SocialMediaImageRoutingModule
  ]
})
export class SocialMediaImageModule { }
