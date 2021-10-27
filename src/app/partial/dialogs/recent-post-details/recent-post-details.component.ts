import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-recent-post-details',
  templateUrl: './recent-post-details.component.html',
  styleUrls: ['./recent-post-details.component.css']
})
export class RecentPostDetailsComponent implements OnInit {
  Liked:boolean =true;
  comments:boolean =false;
  Shared:boolean =false;
  ListView:boolean =true;
  MapView:boolean =false;
  constructor(  public dialogRef: MatDialogRef<RecentPostDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {}

  ngOnInit(): void {
  }


  socialMediaCheck(flag:any){
    debugger;
    flag == 'Liked' ? (this.Liked = true,  this.comments = false, this.Shared = false) : '';
    flag == 'Comments' ? (this.comments = true,  this.Liked = false, this.Shared = false) : '';
    flag == 'Shared' ? (this.Shared = true,  this.comments = false, this.Liked = false) : '';
  }

  onNoClick(text:any): void {
    this.dialogRef.close(text);
  }
}
