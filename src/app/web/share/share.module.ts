import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule, Title } from '@angular/platform-browser';

import { ShareRoutingModule } from './share-routing.module';
import { ShareComponent } from './share.component';
import { GalleryModule } from '@ngx-gallery/core';
import { LightboxModule } from '@ngx-gallery/lightbox';


@NgModule({
  declarations: [
    ShareComponent
  ],
  imports: [
    CommonModule,
    ShareRoutingModule,
    LightboxModule,
    GalleryModule,
  ],
  providers: [
    Title
  ],
})
export class ShareModule { }
