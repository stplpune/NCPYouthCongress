import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateConstituencyComponent } from './create-constituency.component';

const routes: Routes = [{ path: '', component: CreateConstituencyComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CreateConstituencyRoutingModule { }
