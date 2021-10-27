import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { RecentPostDetailsComponent } from '../../dialogs/recent-post-details/recent-post-details.component';

@Component({
  selector: 'app-list-wise',
  templateUrl: './list-wise.component.html',
  styleUrls: ['./list-wise.component.css']
})
export class ListWiseComponent implements OnInit {

  constructor(public dialog: MatDialog) { }

  ngOnInit(): void {
  }

  openRecentPostDetails(){
    const dialogRef = this.dialog.open(RecentPostDetailsComponent, {
      // width: '1024px',
      // data: this.resultBodyMemActDetails
    });
  }
}
