import { NgModule, LOCALE_ID } from '@angular/core';
import { CommonModule} from '@angular/common';
import { NgxSelectModule } from 'ngx-select-ex';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
@NgModule({
  declarations: [
    DashboardComponent
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    NgxSelectModule,
    FormsModule,
    ReactiveFormsModule,
    OwlNativeDateTimeModule,
    OwlDateTimeModule
  ],
  providers: [
    { provide: LOCALE_ID, useValue: "en-IN" }, //replace "en-US" with your locale
    //otherProviders...
  ]
})
export class DashboardModule { }
