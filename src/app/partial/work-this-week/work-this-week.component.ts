import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { CallAPIService } from 'src/app/services/call-api.service';
import { CommonService } from 'src/app/services/common.service';
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import am4themes_kelly from "@amcharts/amcharts4/themes/kelly";
import { FormBuilder, FormGroup } from '@angular/forms';
@Component({
  selector: 'app-work-this-week',
  templateUrl: './work-this-week.component.html',
  styleUrls: ['./work-this-week.component.css', '../partial.component.css']
})
export class WorkThisWeekComponent implements OnInit, OnDestroy {
  WorkDoneByYuvakTP: any;
  WorkDoneByYuvakBP: any;
  selweekRange: any
  WorkDoneByYuvakBarchart: any;
  resBestPerKaryMember: any;
  globalTalukId: number = 0;
  globalVillageid: number = 0;
  resBestPerMember: any;
  chart: any;
  allDistrict: any;
  globalDistrictId: number = 0;
  getTalkaByDistrict: any;
  resultVillageOrCity: any;
  filterBestPer!: FormGroup;

  constructor(private callAPIService: CallAPIService, private spinner: NgxSpinnerService,
    private toastrService: ToastrService, private commonService: CommonService, private router: Router, private fb: FormBuilder) {

    if (localStorage.getItem('weekRange')) {
      this.selweekRange = localStorage.getItem('weekRange');
      this.geWeekReport(JSON.parse(this.selweekRange))
      this.getBestPerKaryMember(JSON.parse(this.selweekRange));
      this.getBestPerMember(JSON.parse(this.selweekRange));
    } else {
      this.router.navigate(['../dashboard']);
      this.toastrService.error('please select week range')
    }

  }

  ngOnInit(): void {
    this.getDistrict();
    this.defaultFilterBestPer();
  }

  getDistrict() {
    this.spinner.show();
    this.callAPIService.setHttp('get', 'Web_GetDistrict_1_0?StateId=' + 1, false, false, false, 'ncpServiceForWeb');
    this.callAPIService.getHttp().subscribe((res: any) => {
      if (res.data == 0) {
        this.spinner.hide();
        this.allDistrict = res.data1;
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

  getTaluka(districtId: any) {
    this.spinner.show();
    this.globalDistrictId = districtId;
    // this.getBestPerMember(JSON.parse(this.selweekRange))
    this.callAPIService.setHttp('get', 'Web_GetTaluka_1_0?DistrictId=' + districtId, false, false, false, 'ncpServiceForWeb');
    this.callAPIService.getHttp().subscribe((res: any) => {
      if (res.data == 0) {
        this.spinner.hide();
        this.getTalkaByDistrict = res.data1;
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

  getVillageOrCity(talukaID: any) {
    alert(talukaID)
    this.spinner.show();
    this.callAPIService.setHttp('get', 'Web_GetVillage_1_0?talukaid=' + talukaID, false, false, false, 'ncpServiceForWeb');
    this.callAPIService.getHttp().subscribe((res: any) => {
      if (res.data == 0) {
        this.spinner.hide();
        this.resultVillageOrCity = res.data1;
        console.log(this.resultVillageOrCity);
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

  defaultFilterBestPer() {
    this.filterBestPer = this.fb.group({
      DistrictId: [''],
      TalukaId: [''],
      VillageId: ['']
    })
  }

  getBestPerKaryMember(selweekRange: any) {
    this.spinner.show();
    this.callAPIService.setHttp('get', 'DashboardData_BestPerformance_web_1_0?UserId=' + this.commonService.loggedInUserId() + '&FromDate=' + selweekRange.fromDate + '&ToDate=' + selweekRange.toDate + '&DistrictId=' + this.commonService.districtId() + '&TalukaId=' + this.globalTalukId + '&Villageid=' + this.globalVillageid, false, false, false, 'ncpServiceForWeb');
    this.callAPIService.getHttp().subscribe((res: any) => {
      if (res.data == 0) {
        this.spinner.hide();
        this.resBestPerKaryMember = res.data2;
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

  getBestPerMember(selweekRange: any) { //filter API
    this.spinner.show();
    this.callAPIService.setHttp('get', 'DashboardData_BestPerformance_web_1_0?UserId=' + this.commonService.loggedInUserId() + '&FromDate=' + selweekRange.fromDate + '&ToDate=' + selweekRange.toDate + '&DistrictId=' + this.globalDistrictId + '&TalukaId=' + this.globalTalukId + '&Villageid=' + this.globalVillageid, false, false, false, 'ncpServiceForWeb');
    this.callAPIService.getHttp().subscribe((res: any) => {
      if (res.data == 0) {
        this.spinner.hide();
        this.resBestPerMember = res.data1;
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

  // this.selweekRange.fromDate this.selweekRange.toDate
  geWeekReport(selweekRange: any) {
    this.spinner.show();
    this.callAPIService.setHttp('get', 'DashboardData_Week_web_1_0?UserId=' + this.commonService.loggedInUserId() + '&FromDate=' + selweekRange.fromDate + '&ToDate=' + selweekRange.toDate + '&DistrictId=' + this.commonService.districtId(), false, false, false, 'ncpServiceForWeb');
    this.callAPIService.getHttp().subscribe((res: any) => {
      if (res.data == 0) {
        this.WorkDoneByYuvakTP = res.data1;
        this.WorkDoneByYuvakBP = res.data2;
        this.WorkDoneByYuvakBarchart = res.data3;
        console.log(this.WorkDoneByYuvakBarchart);
        this.chartWorkDoneByYuvak();
        this.spinner.hide();
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


  chartWorkDoneByYuvak() {
    // Themes begin
    am4core.useTheme(am4themes_kelly);
    am4core.useTheme(am4themes_animated);
    // Themes end

    let chart = am4core.create("WorkDoneByYuvak", am4charts.XYChart);

    chart.data = this.WorkDoneByYuvakBarchart;
    // [{
    //   "country": "Mon",
    //   "visits": 2025
    // }, {
    //   "country": "Tue",
    //   "visits": 1882
    // }, {
    //   "country": "Wed",
    //   "visits": 1809
    // }, {
    //   "country": "Thu",
    //   "visits": 1322
    // }, {
    //   "country": "Fri",
    //   "visits": 1122
    // }, {
    //   "country": "Sat",
    //   "visits": 1114
    // }, {
    //   "country": "Sun",
    //   "visits": 984
    // }];

    chart.padding(40, 40, 40, 40);

    let categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.renderer.grid.template.location = 0;
    categoryAxis.dataFields.category = "DistrictName";
    categoryAxis.renderer.minGridDistance = 60;
    categoryAxis.renderer.inversed = true;
    categoryAxis.renderer.grid.template.disabled = true;

    let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.min = 0;
    valueAxis.extraMax = 0.1;
    //valueAxis.rangeChangeEasing = am4core.ease.linear;
    //valueAxis.rangeChangeDuration = 1500;

    let series = chart.series.push(new am4charts.ColumnSeries());
    series.dataFields.categoryX = "DistrictName";
    series.dataFields.valueY = "MemberWork";
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
    series.columns.template.adapter.add("fill", function (fill, target: any) {
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

  ngOnDestroy() {
    localStorage.removeItem('weekRange');
  }
}

