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
  resBestPerMember: any;
  chart: any;
  allDistrict: any;
  filterObj = { 'globalDistrictId': 0, 'globalVillageid': 0, 'globalTalukId': 0 }
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
    this.filterObj.globalDistrictId = districtId;
    this.getBestPerMember(JSON.parse(this.selweekRange))
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

  districtClear() {
    this.filterObj = { 'globalDistrictId': 0, 'globalVillageid': 0, 'globalTalukId': 0 }
    this.filterBestPer.reset();
    this.getBestPerMember(JSON.parse(this.selweekRange))
  }

  getVillageOrCity(talukaID: any) {
    this.filterObj.globalTalukId = talukaID;
    this.getBestPerMember(JSON.parse(this.selweekRange))
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

  getVillByTaluka(villageId: any) {
    this.filterObj.globalVillageid = villageId;
    this.getBestPerMember(JSON.parse(this.selweekRange))
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
    this.callAPIService.setHttp('get', 'DashboardData_BestPerformance_web_1_0?UserId=' + this.commonService.loggedInUserId() + '&FromDate=' + selweekRange.fromDate + '&ToDate=' + selweekRange.toDate + '&DistrictId=' + this.commonService.districtId() + '&TalukaId=0&Villageid=0', false, false, false, 'ncpServiceForWeb');
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
    this.callAPIService.setHttp('get', 'DashboardData_BestPerformance_web_1_0?UserId=' + this.commonService.loggedInUserId() + '&FromDate=' + selweekRange.fromDate + '&ToDate=' + selweekRange.toDate + '&DistrictId=' + this.filterObj.globalDistrictId + '&TalukaId=' + this.filterObj.globalTalukId + '&Villageid=' + this.filterObj.globalVillageid, false, false, false, 'ncpServiceForWeb');
    this.callAPIService.getHttp().subscribe((res: any) => {
      if (res.data == 0) {
        this.spinner.hide();
        this.resBestPerMember = res.data1;
      } else {
        this.spinner.hide();
        if (res.data == 1) {
          this.resBestPerMember = [];
          this.toastrService.error("Data is not available");

        } else {
          this.resBestPerMember = [];
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
        this.WorkDoneByYuvak();
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

  // chart DIv 
  WorkDoneByYuvak(){
    am4core.ready(() =>{
      am4core.useTheme(am4themes_animated);
      
      var chart = am4core.create('WorkDoneByYuvak', am4charts.XYChart)
      chart.colors.step = 2;
      
      chart.legend = new am4charts.Legend()
      chart.legend.position = 'top'
      chart.legend.paddingBottom = 10
      chart.legend.labels.template.maxWidth = 20
      
      var xAxis = chart.xAxes.push(new am4charts.CategoryAxis())
      xAxis.dataFields.category = 'DistrictName'
      xAxis.renderer.cellStartLocation = 0.1
      xAxis.renderer.cellEndLocation = 0.9
      xAxis.renderer.grid.template.location = 0;
      
      var yAxis = chart.yAxes.push(new am4charts.ValueAxis());
      yAxis.min = 0;
      
      function createSeries(value: string | undefined, name: string) {
          var series = chart.series.push(new am4charts.ColumnSeries())
          series.dataFields.valueY = value
          series.dataFields.categoryX = 'DistrictName'
          series.name = name
      
          series.events.on("hidden", arrangeColumns);
          series.events.on("shown", arrangeColumns);
      
          var bullet = series.bullets.push(new am4charts.LabelBullet())
          bullet.interactionsEnabled = false
          bullet.dy = 30;
          bullet.label.text = '{valueY}'
          bullet.label.fill = am4core.color('#ffffff')
      
          return series;
      }
      
      chart.data =  this.WorkDoneByYuvakBarchart;
      
      chart.padding(10, 5, 5, 5);
      createSeries('MemberWork', 'Work Done by Committes');
      createSeries('TotalWork', 'Total Work Done');
      
      function arrangeColumns() {
      
          var series:any = chart.series.getIndex(0);
      
          var w = 1 - xAxis.renderer.cellStartLocation - (1 - xAxis.renderer.cellEndLocation);
          if (series.dataItems.length > 1) {
              var x0 = xAxis.getX(series.dataItems.getIndex(0), "categoryX");
              var x1 = xAxis.getX(series.dataItems.getIndex(1), "categoryX");
              var delta = ((x1 - x0) / chart.series.length) * w;
              if (am4core.isNumber(delta)) {
                  var middle = chart.series.length / 2;
      
                  var newIndex = 0;
                  chart.series.each(function(series) {
                      if (!series.isHidden && !series.isHiding) {
                          series.dummyData = newIndex;
                          newIndex++;
                      }
                      else {
                          series.dummyData = chart.series.indexOf(series);
                      }
                  })
                  var visibleCount = newIndex;
                  var newMiddle = visibleCount / 2;
      
                  chart.series.each(function(series) {
                      var trueIndex = chart.series.indexOf(series);
                      var newIndex = series.dummyData;
      
                      var dx = (newIndex - trueIndex + middle - newMiddle) * delta
      
                      series.animate({ property: "dx", to: dx }, series.interpolationDuration, series.interpolationEasing);
                      series.bulletsContainer.animate({ property: "dx", to: dx }, series.interpolationDuration, series.interpolationEasing);
                  })
              }
          }
      }
      
      });
  }

  ngOnDestroy() {
    localStorage.removeItem('weekRange');
  }
}

