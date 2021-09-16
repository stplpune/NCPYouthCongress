import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ElectionProfileComponent } from './election-profile.component';

const routes: Routes = [{ path: '', component: ElectionProfileComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ElectionProfileRoutingModule { }
