import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PartyProgramDetailsComponent } from './party-program-details.component';

const routes: Routes = [{ path: '', component: PartyProgramDetailsComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PartyProgramDetailsRoutingModule { }
