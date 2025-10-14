import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { JoinUsMembersListComponent } from './join-us-members-list.component';

const routes: Routes = [{ path: '', component: JoinUsMembersListComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class JoinUsMembersListRoutingModule { }
