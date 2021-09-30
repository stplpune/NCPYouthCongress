import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AssignAgentsToBoothsComponent } from './assign-agents-to-booths.component';

const routes: Routes = [{ path: '', component: AssignAgentsToBoothsComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AssignAgentsToBoothsRoutingModule { }
