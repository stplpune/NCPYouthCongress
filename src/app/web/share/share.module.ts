import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule, Title } from '@angular/platform-browser';

import { ShareRoutingModule } from './share-routing.module';
import { ShareComponent } from './share.component';


@NgModule({
  declarations: [
    ShareComponent
  ],
  imports: [
    CommonModule,
    ShareRoutingModule
  ],
  providers: [
    Title
  ],
})
export class ShareModule { }
