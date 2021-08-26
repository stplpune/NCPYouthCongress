import { any } from '@amcharts/amcharts4/.internal/core/utils/Array';
import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { CallAPIService } from 'src/app/services/call-api.service';
import { CommonService } from 'src/app/services/common.service';
import { DateTimeAdapter } from 'ng-pick-datetime';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-event-detail',
  templateUrl: './event-detail.component.html',
  styleUrls: ['./event-detail.component.css'],
  providers: [DatePipe]
})
export class EventDetailComponent implements OnInit {
  paginationNo:number = 1;
  fromDate:any="";
  toDate:any ="";
  eventListArray:any;
  total:any;
  getEventId:any;
  eventDetalis:any;
  selEventId:any;
  pageSize: number = 10;
  selRange = new FormControl();
  defaultCloseBtn: boolean = false;

  constructor(private spinner:NgxSpinnerService, private callAPIService:CallAPIService, private commonService:CommonService, 
    private datepipe:DatePipe, private toastrService:ToastrService, private router:Router, private route:ActivatedRoute,
    public dateTimeAdapter: DateTimeAdapter<any>,
    ) { { dateTimeAdapter.setLocale('en-IN'); } }
 

  ngOnInit(): void {
    this.getEventId =  localStorage.getItem('eventId');
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

        this.eventListArray.forEach((element: any) => { // event Detail
          if (element.EventId == this.getEventId) {
            this.eventDetalis = element;
          }
        });

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

  eventDetails(details:any){
    this.eventDetalis = details;
    this.selEventId= details.EventId;
    this.getEventList();
  }

  onClickPagintion(pageNo: number) {
    this.paginationNo = pageNo;
    this.getEventList();
  }

  getweekRage(dates: any) {
    this.defaultCloseBtn = true;
    this.fromDate= this.datepipe.transform(dates[0], 'dd/MM/YYYY');
    this.toDate= this.datepipe.transform(dates[1], 'dd/MM/YYYY');
    this. getEventList();
  }

  clearValue(){
    this.defaultCloseBtn = false;
    this.fromDate = "";
    this.toDate  = "";
    this.getEventList();
    this.selRange.setValue(null);
  }

}
