import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SocialMediaPersonComponent } from './social-media-person.component';

const routes: Routes = [{ path: '', component: SocialMediaPersonComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SocialMediaPersonRoutingModule { }
