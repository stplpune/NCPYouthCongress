import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CreateConstituencyRoutingModule } from './create-constituency-routing.module';
import { CreateConstituencyComponent } from './create-constituency.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { NgxSelectModule } from 'ngx-select-ex';
import { AgmCoreModule } from '@agm/core';
import { AgmDrawingModule } from '@agm/drawing';

@NgModule({
  declarations: [
    CreateConstituencyComponent
  ],
  imports: [
    CommonModule,
    CreateConstituencyRoutingModule,
    NgxSelectModule,
    FormsModule,
    ReactiveFormsModule,
    NgxPaginationModule,

    AgmCoreModule.forRoot({ 
      apiKey: 'AIzaSyBCSDtf8g7XZ9B-P20ZqzOIr1TUQAg4Fj0',
      libraries: ['drawing','places', 'geometry'] }),
      AgmDrawingModule,
  ],

})
export class CreateConstituencyModule { }
