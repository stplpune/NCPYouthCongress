import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ExecutiveMembersComponent } from './executive-members.component';

const routes: Routes = [{ path: '', component: ExecutiveMembersComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ExecutiveMembersRoutingModule { }
