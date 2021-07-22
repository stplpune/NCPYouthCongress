import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MemberProfileComponent } from './member-profile.component';

const routes: Routes = [{ path: '', component: MemberProfileComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MemberProfileRoutingModule { }
