import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AssignAgentsToBoothsRoutingModule } from './assign-agents-to-booths-routing.module';
import { AssignAgentsToBoothsComponent } from './assign-agents-to-booths.component';
import { NgxSelectModule } from 'ngx-select-ex';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { Ng2SearchPipeModule } from 'ng2-search-filter';

@NgModule({
  declarations: [
    AssignAgentsToBoothsComponent
  ],
  imports: [
    CommonModule,
    AssignAgentsToBoothsRoutingModule,
    NgxSelectModule,
    FormsModule,
    ReactiveFormsModule,
    NgxPaginationModule,
    MatCheckboxModule,
    Ng2SearchPipeModule,
  ]
})
export class AssignAgentsToBoothsModule { }
