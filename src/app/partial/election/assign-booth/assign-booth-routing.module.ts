import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AssignBoothComponent } from './assign-booth.component';

const routes: Routes = [{ path: '', component: AssignBoothComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AssignBoothRoutingModule { }
