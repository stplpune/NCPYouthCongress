import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WorkThisWeekComponent } from './work-this-week.component';

const routes: Routes = [{ path: '', component: WorkThisWeekComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WorkThisWeekRoutingModule { }
