import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrganizationDetailsRoutingModule } from './organization-details-routing.module';
import { OrganizationDetailsComponent } from './organization-details.component';
import { NgxSelectModule } from 'ngx-select-ex';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { AgmCoreModule } from '@agm/core';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import { LightboxModule } from '@ngx-gallery/lightbox';
import { GalleryModule } from '@ngx-gallery/core';
import { ShareModule } from 'src/app/web/share/share.module';
import { TooltipModule } from '../../..//directive/tooltip.module';


@NgModule({
  declarations: [
    OrganizationDetailsComponent
  ],
  imports: [
    CommonModule,
    OrganizationDetailsRoutingModule,
    NgxSelectModule,
    ReactiveFormsModule,
    FormsModule,
    NgxPaginationModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    LightboxModule,
    GalleryModule,
    TooltipModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyAkNBALkBX7trFQFCrcHO2I85Re2MmzTo8',
      language: 'en',
      libraries: ['geometry','places']
    }),
  ],
})
export class OrganizationDetailsModule { }
