import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateElectionComponent } from './create-election.component';

const routes: Routes = [{ path: '', component: CreateElectionComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CreateElectionRoutingModule { }
