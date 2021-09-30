import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AssignElectionsComponent } from './assign-elections.component';

const routes: Routes = [{ path: '', component: AssignElectionsComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AssignElectionsRoutingModule { }
