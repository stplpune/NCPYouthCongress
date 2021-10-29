import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListWiseComponent } from './list-wise/list-wise.component';
import { MapWiseComponent } from './map-wise/map-wise.component';
import { AgmCoreModule} from '@agm/core';
import { NgxSelectModule } from 'ngx-select-ex';
import { ReactiveFormsModule } from '@angular/forms';
import { OwlNativeDateTimeModule, OwlDateTimeModule } from 'ng-pick-datetime';
import { NgxPaginationModule } from 'ngx-pagination';

@NgModule({
  declarations: [ 
    ListWiseComponent,
    MapWiseComponent],
  imports: [
    CommonModule,
    NgxSelectModule,
    ReactiveFormsModule,
    OwlNativeDateTimeModule,
    OwlDateTimeModule,
    NgxPaginationModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyAkNBALkBX7trFQFCrcHO2I85Re2MmzTo8',
      language: 'en',
      libraries: ['places', 'geometry'],
    }),
  ],
  exports:[ListWiseComponent,
    MapWiseComponent]
})
export class ShareModule { }
