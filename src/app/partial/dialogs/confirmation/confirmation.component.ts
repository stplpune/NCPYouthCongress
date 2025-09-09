import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ConfigService } from 'src/app/services/config.service';

@Component({
  selector: 'app-confirmation',
  templateUrl: './confirmation.component.html',
  styleUrls: ['./confirmation.component.css']
})
export class ConfirmationComponent implements OnInit {

language: any;

  constructor(
    public dialogRef: MatDialogRef<ConfirmationComponent>,
    private config: ConfigService,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    this.config.setLanguage.subscribe((language) => { this.language = language; });
  }

  ngOnInit(): void {
  }

  onNoClick(text: any): void {
    this.dialogRef.close(text);
  }
}
