import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ForwardActivityTrackerComponent } from './forward-activity-tracker.component';

const routes: Routes = [{ path: '', component: ForwardActivityTrackerComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ForwardActivityTrackerRoutingModule { }
