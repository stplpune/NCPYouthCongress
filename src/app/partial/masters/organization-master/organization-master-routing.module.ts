import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OrganizationMasterComponent } from './organization-master.component';

const routes: Routes = [{ path: '', component: OrganizationMasterComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OrganizationMasterRoutingModule { }
