import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ElectionDetailsComponent } from './election-details.component';

const routes: Routes = [{ path: '', component: ElectionDetailsComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ElectionDetailsRoutingModule { }
