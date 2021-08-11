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
  recentActivityGraph: any;
  allMemberprofile: any;
  organizationRoles: any;
  memberId: any;
  globalFromDate: any = "";
  globalToDate: any = "";
  membersOverview: any;
  membersActivity: any;
  feedbacks: any;
  resWorkList: any;
  barChartCategory: any;
  periodicChart: any;
  fromDateWorkdetails: any = "";
  toDateWorkdetails: any = "";
  paginationNo: number = 1;
  total: any;
  pageSize: number = 10;
  resultBodyMemActDetails: any;
  lat: any = 19.75117687556874;
  lng: any = 75.71630325927731;
  zoom: any = 12;

  constructor(
    private callAPIService: CallAPIService, private spinner: NgxSpinnerService,
    private toastrService: ToastrService, private commonService: CommonService, private router: Router, private fb: FormBuilder,
    public datepipe: DatePipe, public location: Location, private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.memberId = localStorage.getItem('memberId')
    this.getMemberprofile();
    this.getMemberprofileDetails();
    this.memberProfileWorkdetails();
  }


  getMemberprofile() {
    this.spinner.show();
    this.callAPIService.setHttp('get', 'Web_GetMemberprofile_1_0?MemberId=' + this.memberId, false, false, false, 'ncpServiceForWeb');
    this.callAPIService.getHttp().subscribe((res: any) => {
      if (res.data == 0) {
        this.spinner.hide();
        this.allMemberprofile = res.data1[0];
      } else {
        // this.toastrService.error("Data is not available");
      }
    }, (error: any) => {
      if (error.status == 500) {
        this.router.navigate(['../../500'], { relativeTo: this.route });
      }
    })
  }

  getMemberprofileDetails() {
    this.spinner.show();
    this.callAPIService.setHttp('get', 'Web_GetMemberprofile_details_1_0?MemberId=' + this.memberId + '&FromDate=' + this.globalFromDate + '&ToDate=' + this.globalToDate, false, false, false, 'ncpServiceForWeb');
    this.callAPIService.getHttp().subscribe((res: any) => {
      if (res.data == 0) {
        this.spinner.hide();
        this.membersOverview = res.data1[0];
        this.organizationRoles = res.data2;
        this.feedbacks = res.data3;
      } else {
        // this.toastrService.error("Data is not available");
      }
    }, (error: any) => {
      if (error.status == 500) {
        this.router.navigate(['../../500'], { relativeTo: this.route });
      }
    })
  }

  memberProfileWorkdetails() {
    this.spinner.show();
    this.callAPIService.setHttp('get', 'Web_GetMemberprofile_Workdetails_1_0?MemberId=' + this.memberId + '&FromDate=' + this.fromDateWorkdetails + '&ToDate=' + this.toDateWorkdetails + '&PageNo=' + this.paginationNo, false, false, false, 'ncpServiceForWeb');
    this.callAPIService.getHttp().subscribe((res: any) => {
      if (res.data == 0) {
        this.spinner.hide();
        this.resWorkList = res.data1;
        console.log(this.resWorkList);
        this.total = res.data2[0].TotalCount;
        this.barChartCategory = res.data3;
        this.periodicChart = res.data4;
        this.WorkDoneByYuvak();
        this. workCountAgainstWorkType();
      } else {
        // this.toastrService.error("Data is not available");
      }
    }, (error: any) => {
      if (error.status == 500) {
        this.router.navigate(['../../500'], { relativeTo: this.route });
      }
    })
  }

  workCountAgainstWorkType() {
    am4core.useTheme(am4themes_animated);
    // Themes end

    let chart = am4core.create("workCountAgainstWork", am4charts.XYChart);

    chart.data = this.barChartCategory;

    chart.padding(40, 40, 40, 40);

    let categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.renderer.grid.template.location = 0;
    categoryAxis.dataFields.category = "Category";
    categoryAxis.renderer.minGridDistance = 60;
    categoryAxis.renderer.inversed = true;
    categoryAxis.renderer.grid.template.disabled = true;

    let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.min = 0;
    valueAxis.extraMax = 0.1;
    //valueAxis.rangeChangeEasing = am4core.ease.linear;
    //valueAxis.rangeChangeDuration = 1500;

    let series = chart.series.push(new am4charts.ColumnSeries());
    series.dataFields.categoryX = "Category";
    series.dataFields.valueY = "Totalwork";
    series.tooltipText = "{valueY.value}"
    series.columns.template.strokeOpacity = 0;
    series.columns.template.column.cornerRadiusTopRight = 10;
    series.columns.template.column.cornerRadiusTopLeft = 10;
    //series.interpolationDuration = 1500;
    //series.interpolationEasing = am4core.ease.linear;
    let labelBullet = series.bullets.push(new am4charts.LabelBullet());
    labelBullet.label.verticalCenter = "bottom";
    labelBullet.label.dy = -10;
    labelBullet.label.text = "{values.valueY.workingValue.formatNumber('#.')}";

    chart.zoomOutButton.disabled = true;

    // as by default columns of the same series are of the same color, we add adapter which takes colors from chart.colors color set
    series.columns.template.adapter.add("fill", function (fill: any, target: any) {
      return chart.colors.getIndex(target.dataItem.index);
    });

    setInterval(function () {
      am4core.array.each(chart.data, function (item) {
        item.visits += Math.round(Math.random() * 200 - 100);
        item.visits = Math.abs(item.visits);
      })
      chart.invalidateRawData();
    }, 2000)

    categoryAxis.sortBySeries = series;

  }

  WorkDoneByYuvak() {
    am4core.useTheme(am4themes_animated);
    // Themes end
    
    let chart = am4core.create("recentActivityGraph", am4charts.XYChart);
    chart.paddingRight = 20;
    
    let data:any = [];
    let visits = 11;
    let previousValue:any;
    let thisYear = new Date().getFullYear();
    console.log(this.periodicChart);
    for (var i = 0; i < this.periodicChart.length ; i++) {
        visits += Math.round((Math.random() < 0.5 ? 1 : -1) * Math.random() * 10);
    
        if(i > 0){
            // add color to previous data item depending on whether current value is less or more than previous value
            if(previousValue <= visits){
                data[i - 1].color = chart.colors.getIndex(0);
            }
            else{
                data[i - 1].color = chart.colors.getIndex(5);
            }
        }    
        
        data.push({ date: new Date(thisYear, 0,  i + 1), value: this.periodicChart['Totalwork'] });
        previousValue = visits;
    }
    console.log(data);
    chart.data = data;
    
    let dateAxis = chart.xAxes.push(new am4charts.DateAxis());
    dateAxis.renderer.grid.template.location = 0;
    dateAxis.renderer.axisFills.template.disabled = true;
    dateAxis.renderer.ticks.template.disabled = true;
    
    let valueAxis:any = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.tooltip.disabled = true;
    valueAxis.renderer.minWidth = 35;
    valueAxis.renderer.axisFills.template.disabled = true;
    valueAxis.renderer.ticks.template.disabled = true;
    
    let series = chart.series.push(new am4charts.LineSeries());
    series.dataFields.dateX = "date";
    series.dataFields.valueY = "value";
    series.strokeWidth = 2;
    series.tooltipText = "value: {valueY}, day change: {valueY.previousChange}";
    
    // set stroke property field
    series.propertyFields.stroke = "color";
    
    chart.cursor = new am4charts.XYCursor();
    
    // let scrollbarX = new am4core.Scrollbar();
    // chart.scrollbarX = scrollbarX;
    
    // dateAxis.start = 0.7;
    // dateAxis.keepSelection = true;
    
  }

  ngOnDestroy() {
    localStorage.removeItem('memberId');
  }

  redirectOrgDetails(bodyId: any, officeBearers: any, BodyOrgCellName: any) {
    if (officeBearers == "" || officeBearers == null) {
      this.toastrService.error("Data not found..");
    } else {
      let obj = { bodyId: bodyId, BodyOrgCellName: BodyOrgCellName }
      localStorage.setItem('bodyId', JSON.stringify(obj))
      this.router.navigate(['../../masters/organization-master/organization-details'], { relativeTo: this.route })
    }
  }

  onClickPagintion(pageNo: number) {
    this.paginationNo = pageNo;
    this.memberProfileWorkdetails();
  }

  getBodyMemeberActivitiesDetails(id: any) {
    this.spinner.show();
    this.callAPIService.setHttp('get', 'Web_BodyMemeber_ActivitiesDetails?WorkId=' + id, false, false, false, 'ncpServiceForWeb');
    this.callAPIService.getHttp().subscribe((res: any) => {
      if (res.data == 0) {
        this.spinner.hide();
        this.resultBodyMemActDetails = res.data1[0];
        console.log(this.resultBodyMemActDetails)
        let latLong = this.resultBodyMemActDetails.ActivityLocation.split(",");
        this.lat = Number(latLong[0]);
        this.lng = Number(latLong[1]);
      } else {
        this.spinner.hide();
        if (res.data == 1) {
          this.toastrService.error("Member is not available");
        } else {
          this.toastrService.error("Please try again something went wrong");
        }
      }
    }, (error: any) => {
      if (error.status == 500) {
        this.router.navigate(['../../../500'], { relativeTo: this.route });
      }
    })
  }


}
