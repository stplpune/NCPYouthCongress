import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddClientRoutingModule } from './add-client-routing.module';
import { AddClientComponent } from './add-client.component';
import { NgxSelectModule } from 'ngx-select-ex';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { Ng2SearchPipeModule } from 'ng2-search-filter';


@NgModule({
  declarations: [
    AddClientComponent
  ],
  imports: [
    CommonModule,
    AddClientRoutingModule,
    NgxSelectModule,
    FormsModule,
    ReactiveFormsModule,
    NgxPaginationModule,
    MatCheckboxModule,
    Ng2SearchPipeModule
  ]
})
export class AddClientModule { }
