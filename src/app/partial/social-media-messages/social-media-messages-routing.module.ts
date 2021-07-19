import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SocialMediaMessagesComponent } from './social-media-messages.component';

const routes: Routes = [{ path: '', component: SocialMediaMessagesComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SocialMediaMessagesRoutingModule { }
