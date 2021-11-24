import { NgModule,LOCALE_ID  } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TooltipModule } from '../../directive/tooltip.module';
import { SocialMediaImageRoutingModule } from './social-media-image-routing.module';
import { SocialMediaImageComponent } from './social-media-image.component';
import { NgxSelectModule } from 'ngx-select-ex';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
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
    OwlNativeDateTimeModule,
    NgxSelectModule,
    TooltipModule,
  ],
  providers: [
    { provide: LOCALE_ID, useValue: "en-IN" }, //replace "en-US" with your locale
    //otherProviders...
  ]
})
export class SocialMediaImageModule { }
