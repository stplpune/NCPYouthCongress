import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { JoinUsDistrictSataraComponent } from './join-us-district-satara.component';

const routes: Routes = [{ path: '', component: JoinUsDistrictSataraComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class JoinUsDistrictSataraRoutingModule { }
