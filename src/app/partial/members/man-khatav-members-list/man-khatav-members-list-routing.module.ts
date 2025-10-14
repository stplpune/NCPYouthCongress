import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ManKhatavMembersListComponent } from './man-khatav-members-list.component';

const routes: Routes = [{ path: '', component: ManKhatavMembersListComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManKhatavMembersListRoutingModule { }
