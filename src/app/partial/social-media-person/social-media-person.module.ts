import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import { SocialMediaPersonRoutingModule } from './social-media-person-routing.module';
import { SocialMediaPersonComponent } from './social-media-person.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { LightboxModule } from '@ngx-gallery/lightbox';
import { GalleryModule } from '@ngx-gallery/core';
@NgModule({
  declarations: [
    SocialMediaPersonComponent
  ],
  imports: [
    CommonModule,
    SocialMediaPersonRoutingModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    ReactiveFormsModule,
    FormsModule,
    NgxPaginationModule,
    LightboxModule,
    GalleryModule,
  ]
})
export class SocialMediaPersonModule { }
