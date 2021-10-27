import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListWiseComponent } from './list-wise/list-wise.component';
import { MapWiseComponent } from './map-wise/map-wise.component';



@NgModule({
  declarations: [ 
    ListWiseComponent,
    MapWiseComponent],
  imports: [
    CommonModule,
  ],
  exports:[ListWiseComponent,
    MapWiseComponent]
})
export class ShareModule { }
