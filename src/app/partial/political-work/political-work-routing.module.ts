import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PoliticalWorkComponent } from './political-work.component';

const routes: Routes = [{ path: '', component: PoliticalWorkComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PoliticalWorkRoutingModule { }
