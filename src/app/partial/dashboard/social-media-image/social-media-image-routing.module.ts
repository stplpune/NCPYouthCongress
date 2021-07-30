import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SocialMediaImageComponent } from './social-media-image.component';

const routes: Routes = [{ path: '', component: SocialMediaImageComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SocialMediaImageRoutingModule { }
