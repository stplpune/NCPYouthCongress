import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { CallAPIService } from 'src/app/services/call-api.service';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.css']
})
export class EventsComponent implements OnInit {
  paginationNo:number = 1;
  fromDate:any="";
  toDate:any ="";
  eventListArray:any;
  total:any;
  constructor(private spinner:NgxSpinnerService, private callAPIService:CallAPIService, private commonService:CommonService, 
    private datepipe:DatePipe, private toastrService:ToastrService, private router:Router, private route:ActivatedRoute
    ) { }

  ngOnInit(): void {
    this.getEventList();
  }

  getEventList() {
    this.spinner.show();
    this.callAPIService.setHttp('get', 'Web_GetEventList_1_0?UserId=0' + '&PageNo=' + this.paginationNo
      + '&FromDate=' + this.fromDate + '&ToDate=' + this.toDate, false, false, false, 'ncpServiceForWeb');
    this.callAPIService.getHttp().subscribe((res: any) => {
      if (res.data == 0) {
        this.spinner.hide();
        this.eventListArray = res.data1;
        this.total = res.data2[0].TotalCount;
      } else {
        this.spinner.hide();
        this.toastrService.error("Data is not available");
      }
    },
      (error: any) => {
        if (error.status == 500) {
          this.router.navigate(['../500'], { relativeTo: this.route });
        }
      })
  }

  redirectToEvent(eventId:any){
    localStorage.setItem('eventId',eventId);
    this.router.navigate(['../events/detail']);
  }
}