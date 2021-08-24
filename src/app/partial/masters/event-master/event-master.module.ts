import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { EventMasterRoutingModule } from './event-master-routing.module';
import { EventMasterComponent } from './event-master.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';


@NgModule({
  declarations: [
    EventMasterComponent
  ],
  imports: [
    CommonModule,
    EventMasterRoutingModule,
    AngularEditorModule,
    FormsModule,
    ReactiveFormsModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
  ]
})
export class EventMasterModule { }
