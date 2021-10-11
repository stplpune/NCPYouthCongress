import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HelpNonMemberComponent } from './help-non-member.component';

const routes: Routes = [{ path: '', component: HelpNonMemberComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HelpNonMemberRoutingModule { }
