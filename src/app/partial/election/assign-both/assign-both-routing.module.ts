import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AssignBothComponent } from './assign-both.component';

const routes: Routes = [{ path: '', component: AssignBothComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AssignBothRoutingModule { }
