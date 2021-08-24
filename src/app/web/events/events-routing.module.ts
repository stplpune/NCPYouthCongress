import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EventsComponent } from './events.component';

const routes: Routes = [{ path: '', component: EventsComponent },
{ path: 'detail', loadChildren: () => import('./event-detail/event-detail.module').then(m => m.EventDetailModule) },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EventsRoutingModule { }
