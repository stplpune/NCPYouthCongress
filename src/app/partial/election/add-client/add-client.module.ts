import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AddClientRoutingModule } from './add-client-routing.module';
import { AddClientComponent } from './add-client.component';


@NgModule({
  declarations: [
    AddClientComponent
  ],
  imports: [
    CommonModule,
    AddClientRoutingModule
  ]
})
export class AddClientModule { }
