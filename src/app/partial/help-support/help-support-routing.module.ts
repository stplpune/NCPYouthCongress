import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HelpSupportComponent } from './help-support.component';

const routes: Routes = [{ path: '', component: HelpSupportComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HelpSupportRoutingModule { }
