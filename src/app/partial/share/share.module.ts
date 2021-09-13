import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivityDetailsComponent } from './dialogs/activity-details/activity-details.component';
import {MatDialogModule} from '@angular/material/dialog';



@NgModule({
  declarations: [
    ActivityDetailsComponent
  ],
  imports: [
    CommonModule,
    MatDialogModule
  ]
})
export class ShareModule { }
