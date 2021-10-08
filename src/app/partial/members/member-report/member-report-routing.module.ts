import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MemberReportComponent } from './member-report.component';

const routes: Routes = [{ path: '', component: MemberReportComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MemberReportRoutingModule { }
