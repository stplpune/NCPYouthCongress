import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MobileLoginComponent } from './mobile-login.component';

const routes: Routes = [{ path: '', component: MobileLoginComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MobileLoginRoutingModule { }
