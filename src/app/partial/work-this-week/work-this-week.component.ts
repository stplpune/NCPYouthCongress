import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { CallAPIService } from 'src/app/services/call-api.service';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-work-this-week',
  templateUrl: './work-this-week.component.html',
  styleUrls: ['./work-this-week.component.css', '../partial.component.css']
})
export class WorkThisWeekComponent implements OnInit {
  resBestPerformance:any;
  constructor(private callAPIService:CallAPIService, private spinner:NgxSpinnerService, 
    private toastrService:ToastrService, private commonService:CommonService) { }

  ngOnInit(): void {
    this.getBestPerformance();
  }


  getBestPerformance() {
    this.spinner.show();
    this.callAPIService.setHttp('get', 'DashboardData_BestPerformance_web_1_0?UserId='+this.commonService.loggedInUserId()+'&FromDate=&ToDate=&DistrictId='+this.commonService.districtId(), false, false, false, 'ncpServiceForWeb');
    this.callAPIService.getHttp().subscribe((res: any) => {
      if (res.data == 0) {
        this.spinner.hide();
        this.resBestPerformance = res.data1;
      } else {
        this.spinner.hide();
        if (res.data == 1) {
          this.toastrService.error("Data is not available");
        } else {
          this.toastrService.error("Please try again something went wrong");
        }
      }
    })
  } 

}
