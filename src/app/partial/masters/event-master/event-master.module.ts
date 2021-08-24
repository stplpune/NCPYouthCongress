import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { EventMasterRoutingModule } from './event-master-routing.module';
import { EventMasterComponent } from './event-master.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    EventMasterComponent
  ],
  imports: [
    CommonModule,
    EventMasterRoutingModule,
    AngularEditorModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class EventMasterModule { }
