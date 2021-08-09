import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ActivityAnalysisComponent } from './activity-analysis.component';

const routes: Routes = [{ path: '', component: ActivityAnalysisComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ActivityAnalysisRoutingModule { }
