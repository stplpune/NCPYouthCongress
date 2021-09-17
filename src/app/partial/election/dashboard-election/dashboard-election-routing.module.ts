import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardElectionComponent } from './dashboard-election.component';

const routes: Routes = [{ path: '', component: DashboardElectionComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardElectionRoutingModule { }
