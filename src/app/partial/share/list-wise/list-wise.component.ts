import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { CallAPIService } from 'src/app/services/call-api.service';
import { CommonService } from 'src/app/services/common.service';
import { RecentPostDetailsComponent } from '../../dialogs/recent-post-details/recent-post-details.component';

@Component({
  selector: 'app-list-wise',
  templateUrl: './list-wise.component.html',
  styleUrls: ['./list-wise.component.css']
})
export class ListWiseComponent implements OnInit {
  resDashboardActivities: any;
  paginationNo = 1;
  constructor(public dialog: MatDialog,
    private callAPIService: CallAPIService,
    private toastrService: ToastrService,
    private spinner: NgxSpinnerService,
    private router: Router,
    private route: ActivatedRoute,
    private commonService: CommonService) { }

  ngOnInit(): void {
    this.dashboardActivities();
  }

  dashboardActivities() {
    this.spinner.show();
    this.callAPIService.setHttp('get', 'Dashboard_Activities_Web?UserId=' + this.commonService.loggedInUserId() + '&PageNo=' + this.paginationNo, false, false, false, 'ncpServiceForWeb');
    this.callAPIService.getHttp().subscribe((res: any) => {
      if (res.data == 0) {
        this.resDashboardActivities = res.data1;
        this.spinner.hide();
      } else {
        this.spinner.hide();
      }
    }, (error: any) => {
      this.spinner.hide();
      if (error.status == 500) {
        this.router.navigate(['../500'], { relativeTo: this.route });
      }
    })
  }

  openRecentPostDetails(activitieDetails: any) {
    let obj = { pageNo: this.paginationNo, data: activitieDetails }
    const dialogRef = this.dialog.open(RecentPostDetailsComponent, {
      data: obj,
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result == 'Yes' || result == 'No') {
        this.dashboardActivities();
      }
    });
  }
}
