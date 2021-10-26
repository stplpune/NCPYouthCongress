import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-user-block-unblock',
  templateUrl: './user-block-unblock.component.html',
  styleUrls: ['./user-block-unblock.component.css']
})
export class UserBlockUnblockComponent implements OnInit {
  blockText!:string;
  constructor(
    public dialogRef: MatDialogRef<UserBlockUnblockComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {}

  ngOnInit(): void {
      this.data == 0 ? this.blockText = 'Block' : this.blockText = 'Unblock';
  }

  onNoClick(text:any): void {
    this.dialogRef.close(text);
  }

}
