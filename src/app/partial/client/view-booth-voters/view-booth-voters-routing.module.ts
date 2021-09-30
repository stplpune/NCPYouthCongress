import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ViewBoothVotersComponent } from './view-booth-voters.component';

const routes: Routes = [{ path: '', component: ViewBoothVotersComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ViewBoothVotersRoutingModule { }
