import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AssignVotersComponent } from './assign-voters.component';

const routes: Routes = [{ path: '', component: AssignVotersComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AssignVotersRoutingModule { }
