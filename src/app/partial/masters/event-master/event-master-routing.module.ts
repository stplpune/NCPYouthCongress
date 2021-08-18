import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EventMasterComponent } from './event-master.component';

const routes: Routes = [{ path: '', component: EventMasterComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EventMasterRoutingModule { }
