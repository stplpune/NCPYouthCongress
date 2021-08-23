import { Component, OnDestroy, OnInit } from '@angular/core';
import { DatePipe, Location } from '@angular/common';
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import am4themes_material from "@amcharts/amcharts4/themes/material";
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { CallAPIService } from 'src/app/services/call-api.service';
import { CommonService } from 'src/app/services/common.service';
import { ActivatedRoute, Router } from '@angular/router';
import { DateTimeAdapter } from 'ng-pick-datetime';
import { Gallery, GalleryItem, ImageItem, ThumbnailsPosition, ImageSize } from '@ngx-gallery/core';
import { Lightbox } from '@ngx-gallery/lightbox';
@Component({
  selector: 'app-member-profile',
  templateUrl: './member-profile.component.html',
  styleUrls: ['./member-profile.component.css', '../../partial.component.css']
})

export class MemberProfileComponent implements OnInit, OnDestroy {
  recentActivityGraph: any;
  allMemberprofile: any;
  organizationRoles: any;
  defaultCloseBtn: boolean = false;
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
  zoom: any = 5;
  resultFeedBack: any;
  checkUserBlock!: string;
  dateTime = new FormControl();
  FullName: any;
  comUserdetImg:any;
  programGalleryImg!: GalleryItem[]; 
  selUserpostbodyId:any;

  constructor(
    private callAPIService: CallAPIService, private spinner: NgxSpinnerService,
    private toastrService: ToastrService, private commonService: CommonService, private router: Router, private fb: FormBuilder,
    public datepipe: DatePipe, public location: Location, private route: ActivatedRoute, public dateTimeAdapter: DateTimeAdapter<any>,
    public gallery: Gallery,
 private _lightbox: Lightbox,
  ) { { dateTimeAdapter.setLocale('en-IN'); }

  let getLocalStorageData: any = localStorage.getItem('memberId');
  let localStorageData = JSON.parse(getLocalStorageData);
  this.memberId = localStorageData.memberId;
  this.FullName = localStorageData.FullName;
}

  ngOnInit(): void {
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
        this.allMemberprofile.IsUserBlock == 1 ? this.checkUserBlock = "Unblock" : this.checkUserBlock = "Block";
      } else {
        // this.toastrService.error("Data is not available");
      }
    }, (error: any) => {
      if (error.status == 500) {
        this.router.navigate(['../../500'], { relativeTo: this.route });
      }
    })
  }

  blockUnblockUser(blockStatus: any) {
    let checkBlockStatus!:number;
    blockStatus == 1 ? checkBlockStatus = 0 : checkBlockStatus = 1;
    this.spinner.show();
    this.callAPIService.setHttp('get', 'Web_BlockUser?MemberId=' + this.memberId + '&BlockStatus=' + checkBlockStatus + '&Createdby=' + this.commonService.loggedInUserId(), false, false, false, 'ncpServiceForWeb');
    this.callAPIService.getHttp().subscribe((res: any) => {
      if (res.data == 0) {
        this.spinner.hide();
        this.toastrService.success(res.data1[0].Msg);
        this.getMemberprofile();
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
        this.membersOverview = null;
        this.organizationRoles = [];
        this.feedbacks = [];
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
        this.resWorkList = res.data1;
        this.total = res.data2[0].TotalCount;
        this.barChartCategory = res.data3;
        this.periodicChart = res.data4;
        this.WorkDoneByYuvak();
        this.workCountAgainstWorkType();
        this.spinner.hide();
      } else {
        this.resWorkList = [];
        this.total = null;
        this.barChartCategory = [];
        this.periodicChart = [];
        this.WorkDoneByYuvak();
        this.workCountAgainstWorkType();
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

    chart.padding(10, 0, 0, 0);

    let categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.renderer.grid.template.location = 0;
    categoryAxis.dataFields.category = "Category";
    categoryAxis.renderer.minGridDistance = 60;
    categoryAxis.renderer.inversed = true;
    categoryAxis.title.text = "Political Work";
    categoryAxis.renderer.grid.template.disabled = true;

    let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.title.text = "Political Work Count";
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
    this.periodicChart.map((ele: any) => {
      ele.StartDate = new Date(this.commonService.dateFormatChange(ele.StartDate))
    })
    let chart = am4core.create("recentActivityGraph", am4charts.XYChart);
    chart.colors.list = [
      am4core.color("#80DEEA"),
    ];

    // Add data
    chart.data = this.periodicChart;

    // Create axes
    let dateAxis: any = chart.xAxes.push(new am4charts.DateAxis());
    dateAxis.renderer.minGridDistance = 50;
    dateAxis.title.text = "Monthly Work";

    // Create value axis
    let valueAxis: any = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.title.text = "Political Work Monhtly Count";

    // Create series
    let lineSeries = chart.series.push(new am4charts.LineSeries());
    lineSeries.dataFields.valueY = "Totalwork";
    lineSeries.dataFields.dateX = "StartDate";
    lineSeries.name = "Sales";
    lineSeries.strokeWidth = 3;
    // lineSeries.strokeDasharray = "5,4";
    lineSeries.tooltipText = "Totalwork: {valueY}, day change: {valueY.previousChange}";

    // Add simple bullet
    let bullet = lineSeries.bullets.push(new am4charts.CircleBullet());
    bullet.disabled = true;
    bullet.propertyFields.disabled = "disabled";

    let secondCircle = bullet.createChild(am4core.Circle);
    secondCircle.radius = 6;
    secondCircle.fill = chart.colors.getIndex(8);

    bullet.events.on("inited", function (event) {
      animateBullet(event.target.circle);
    })


    function animateBullet(bullet: any) {
      let animation = bullet.animate([{ property: "scale", from: 1, to: 5 }, { property: "opacity", from: 1, to: 0 }], 1000, am4core.ease.circleOut);
      animation.events.on("animationended", function (event: any) {
        animateBullet(event.target.object);
      })
    }
  }

  ngOnDestroy() {
    // localStorage.removeItem('memberId');
  }

  redirectOrgDetails(bodyId: any, officeBearers: any, BodyOrgCellName: any) {
    if (officeBearers == "" || officeBearers == null) {
      this.toastrService.error("Data not found..");
    } else {
      let obj = { bodyId: bodyId, BodyOrgCellName: BodyOrgCellName }
      localStorage.setItem('bodyId', JSON.stringify(obj))
      this.router.navigate(['../../master/committee/details'], { relativeTo: this.route })
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
        this.comUserdetImg = this.resultBodyMemActDetails.Images.split(',');
        this.comUserdetImg = this.commonService.imgesDataTransform(this.comUserdetImg,'array');
        this.gallery.ref().load(this.comUserdetImg);

        let latLong = this.resultBodyMemActDetails.ActivityLocation.split(",");
        this.lat = Number(latLong[0]);
        this.lng = Number(latLong[1]);
      } else {
        this.resultBodyMemActDetails = [];
        // this.toastrService.error("Member is not available");
      }
    }, (error: any) => {
      if (error.status == 500) {
        this.router.navigate(['../../../500'], { relativeTo: this.route });
      }
    })
  }

  viewFeedBackModalFN(feddback: any) {
    this.resultFeedBack = feddback;
  }

  getRage(value:any){
    // if(value == )
    this.defaultCloseBtn = true;
    this.fromDateWorkdetails =  this.datepipe.transform(value.value[0], 'dd/MM/YYYY');
    this.globalFromDate =  this.datepipe.transform(value.value[0], 'dd/MM/YYYY');
    this.toDateWorkdetails = this.datepipe.transform(value.value[1], 'dd/MM/YYYY');
    this.globalToDate = this.datepipe.transform(value.value[1], 'dd/MM/YYYY');
    this.memberProfileWorkdetails();
    this.getMemberprofileDetails();
  }

  clearValue(){
    this.defaultCloseBtn = false;
    this.fromDateWorkdetails = "";
    this.toDateWorkdetails  = "";
    this.memberProfileWorkdetails();
    this.getMemberprofileDetails();
    this.dateTime.setValue(null);
  }

  getUserPostBodyId(id: any) {
    this.selUserpostbodyId = id;
  }

  deleteMember() {
    this.spinner.show();
    this.callAPIService.setHttp('get', 'Web_Delete_AssignMember_1_0?userpostbodyId=' + this.selUserpostbodyId + '&CreatedBy=' + this.commonService.loggedInUserId(), false, false, false, 'ncpServiceForWeb');
    this.callAPIService.getHttp().subscribe((res: any) => {
      if (res.data == 0) {
        this.spinner.hide();
        this.toastrService.success(res.data1[0].Msg);
        this.getMemberprofileDetails();

      } else {
        this.spinner.hide();
        this.toastrService.error("Member is not available");
      }
    }, (error: any) => {
      this.spinner.hide();
      if (error.status == 500) {
        this.router.navigate(['../../../500'], { relativeTo: this.route });
      }
    })
  }
}
