import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AssignAgentsToBoothsRoutingModule } from './assign-agents-to-booths-routing.module';
import { AssignAgentsToBoothsComponent } from './assign-agents-to-booths.component';
import {MatTreeModule} from '@angular/material/tree';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
  declarations: [
    AssignAgentsToBoothsComponent
  ],
  imports: [
    CommonModule,
    AssignAgentsToBoothsRoutingModule,
    MatTreeModule,
    // BrowserModule,
    //BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    MatCheckboxModule,  
    MatIconModule,
  ]
})
export class AssignAgentsToBoothsModule { }
