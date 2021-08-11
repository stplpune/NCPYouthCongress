import { Component, OnDestroy, OnInit } from '@angular/core';
import { DatePipe, Location } from '@angular/common';
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import am4themes_material from "@amcharts/amcharts4/themes/material";
import { FormBuilder } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { CallAPIService } from 'src/app/services/call-api.service';
import { CommonService } from 'src/app/services/common.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-member-profile',
  templateUrl: './member-profile.component.html',
  styleUrls: ['./member-profile.component.css', '../../partial.component.css']
})
export class MemberProfileComponent implements OnInit, OnDestroy {
  recentActivityGraph:any;
  allMemberprofile:any;
  memberId:any;
  globalFromDate:any = "";
  globalToDate:any = "";
  membersOverview:any;
  membersActivity:any;

  constructor(
    private callAPIService: CallAPIService, private spinner: NgxSpinnerService,
    private toastrService: ToastrService, private commonService: CommonService, private router: Router, private fb: FormBuilder, 
    public datepipe: DatePipe, public location:Location ,private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.memberId = localStorage.getItem('memberId')
    this.getMemberprofile();
    this.WorkDoneByYuvak();
    this.getMemberprofileDetails();
  }


  getMemberprofile() {
    this.spinner.show();
    this.callAPIService.setHttp('get', 'Web_GetMemberprofile_1_0?MemberId=' + this.memberId, false, false, false, 'ncpServiceForWeb');
    this.callAPIService.getHttp().subscribe((res: any) => {
      if (res.data == 0) {
        this.spinner.hide();
        this.allMemberprofile = res.data1[0];
      } else {
        this.spinner.hide();
        if (res.data == 1) {
          // this.toastrService.error("Data is not available");
        } else {
          this.toastrService.error("Please try again something went wrong");
        }
      }
    } ,(error:any) => {
      if (error.status == 500) {
        this.router.navigate(['../../500'], { relativeTo: this.route });
      }
    })
  }

  getMemberprofileDetails() {
    this.spinner.show();
    this.callAPIService.setHttp('get', 'Web_GetMemberprofile_details_1_0?MemberId=' + this.memberId+'&FromDate='+this.globalFromDate+'&ToDate='+this.globalToDate, false, false, false, 'ncpServiceForWeb');
    this.callAPIService.getHttp().subscribe((res: any) => {
      if (res.data == 0) {
        this.spinner.hide();
        this.membersOverview = res.data1[0];
        this.membersActivity = res.data2;
      } else {
        this.spinner.hide();
        if (res.data == 1) {
          // this.toastrService.error("Data is not available");
        } else {
          this.toastrService.error("Please try again something went wrong");
        }
      }
    })
  }

  // 


  WorkDoneByYuvak() {
    am4core.ready(() => {
      am4core.useTheme(am4themes_animated);
      // Themes end
      
      // Create chart instance
      let chart = am4core.create("recentActivityGraph", am4charts.XYChart);
      
      // Enable chart cursor
      chart.cursor = new am4charts.XYCursor();
      chart.cursor.lineX.disabled = true;
      chart.cursor.lineY.disabled = true;
      
      // Enable scrollbar
      // chart.scrollbarX = new am4core.Scrollbar();
      
      // Add data
      chart.data = [{
            "date": "2012-01-01",
            "value": 0
        }, {
            "date": "2012-01-02",
            "value": 1
        }, {
            "date": "2012-01-03",
            "value": 2
        }, {
            "date": "2012-01-04",
            "value": 3
        }, {
            "date": "2012-01-05",
            "value": 4
        }, {
            "date": "2012-01-06",
            "value": 6
        }, {
            "date": "2012-01-07",
            "value": 7
        }, {
            "date": "2012-01-08",
            "value": 5
        },  {
            "date": "2012-01-21",
            "value": 8
        }, {
            "date": "2012-01-22",
            "value": 9
        }, {
            "date": "2012-01-23",
            "value": 10
        }, {
          "date": "2012-01-21",
          "value": 11
      }, {
          "date": "2012-01-22",
          "value": 12
      }, ];
      
      // Create axes
      let dateAxis = chart.xAxes.push(new am4charts.DateAxis());
      dateAxis.renderer.grid.template.location = 0.5;
      dateAxis.dateFormatter.inputDateFormat = "yyyy-MM-dd";
      dateAxis.renderer.minGridDistance = 40;
      dateAxis.tooltipDateFormat = "MMM dd, yyyy";
      dateAxis.dateFormats.setKey("day", "dd");
      
      let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
      
      // Create series
      let series:any = chart.series.push(new am4charts.LineSeries());
      series.tooltipText = "{date}\n[bold font-size: 17px]value: {valueY}[/]";
      series.dataFields.valueY = "value";
      series.dataFields.dateX = "date";
      series.strokeDasharray = 3;
      series.strokeWidth = 2
      series.strokeOpacity = 0.3;
      series.strokeDasharray = "3,3"
      
      let bullet = series.bullets.push(new am4charts.CircleBullet());
      bullet.strokeWidth = 2;
      bullet.stroke = am4core.color("#fff");
      bullet.setStateOnChildren = true;
      bullet.propertyFields.fillOpacity = "opacity";
      bullet.propertyFields.strokeOpacity = "opacity";
      
      let hoverState = bullet.states.create("hover");
      hoverState.properties.scale = 1.7;
      
      function createTrendLine(data:any) {
        let trend = chart.series.push(new am4charts.LineSeries());
        trend.dataFields.valueY = "value";
        trend.dataFields.dateX = "date";
        trend.strokeWidth = 2
        trend.stroke = trend.fill = am4core.color("#c00");
        trend.data = data;
      
        let bullet = trend.bullets.push(new am4charts.CircleBullet());
        bullet.tooltipText = "{date}\n[bold font-size: 17px]value: {valueY}[/]";
        bullet.strokeWidth = 2;
        bullet.stroke = am4core.color("#fff")
        bullet.circle.fill = trend.stroke;
      
        let hoverState = bullet.states.create("hover");
        hoverState.properties.scale = 1.7;
      
        return trend;
      };
      
      // createTrendLine([
      //   { "date": "2012-01-02", "value": 10 },
      //   { "date": "2012-01-11", "value": 19 }
      // ]);
      
      // let lastTrend = createTrendLine([
      //   { "date": "2012-01-17", "value": 16 },
      //   { "date": "2012-01-22", "value": 10 }
      // ]);
      
      // Initial zoom once chart is ready
      // lastTrend.events.once("datavalidated", function(){
      //   series.xAxis.zoomToDates(new Date(2012, 0, 2), new Date(2012, 0, 13));
      // });
      
    });
  }

  ngOnDestroy() {
    localStorage.removeItem('memberId');
  }
}
