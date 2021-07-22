import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ViewMembersComponent } from './view-members.component';

const routes: Routes = [{ path: '', component: ViewMembersComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ViewMembersRoutingModule { }
