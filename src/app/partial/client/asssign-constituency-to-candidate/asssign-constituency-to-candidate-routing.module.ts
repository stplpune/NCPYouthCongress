import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AsssignConstituencyToCandidateComponent } from './asssign-constituency-to-candidate.component';

const routes: Routes = [{ path: '', component: AsssignConstituencyToCandidateComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AsssignConstituencyToCandidateRoutingModule { }
