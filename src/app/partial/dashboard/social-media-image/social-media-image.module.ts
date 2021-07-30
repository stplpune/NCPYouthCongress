import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SocialMediaImageRoutingModule } from './social-media-image-routing.module';
import { SocialMediaImageComponent } from './social-media-image.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';


@NgModule({
  declarations: [
    SocialMediaImageComponent
  ],
  imports: [
    CommonModule,
    SocialMediaImageRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    OwlDateTimeModule,
OwlNativeDateTimeModule  

  ]
})
export class SocialMediaImageModule { }
