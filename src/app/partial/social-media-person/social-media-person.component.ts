import { Component, OnInit } from '@angular/core';
import { CallAPIService } from 'src/app/services/call-api.service';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from '../../services/common.service';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { NgxSpinnerService } from "ngx-spinner";
import { DateTimeAdapter } from 'ng-pick-datetime';
import { DatePipe, Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
@Component({
  selector: 'app-social-media-person',
  templateUrl: './social-media-person.component.html',
  styleUrls: ['./social-media-person.component.css', '../partial.component.css']
})
export class SocialMediaPersonComponent implements OnInit {

  dateTime = new FormControl();
  fromDateWorkdetails: any = "";
  toDateWorkdetails: any = "";
  defaultCloseBtn: boolean = false;
  globalFromDate: any = "";
  globalToDate: any = "";
  socialMediaMessagesPersonArray: any;
  PersonName: any;
  MemberMobileNo: any;
  paginationNo: number = 1;
  total: any;
  pageSize: number = 10;
  getDatabyPersonId: any;
  chartArray:any;

  constructor(
    private callAPIService: CallAPIService,
    private spinner: NgxSpinnerService,
    private toastrService: ToastrService,
    private commonService: CommonService,
    public datepipe: DatePipe,
    public location: Location,
    private route: ActivatedRoute,
    private router: Router,
    public dateTimeAdapter: DateTimeAdapter<any>,
  ) { { dateTimeAdapter.setLocale('en-IN'); }

  let getLocalStorageData: any = localStorage.getItem('SocialMediaDataPM');
  let localStorageData = JSON.parse(getLocalStorageData);
  this.PersonName = localStorageData.PersonName;
  this.MemberMobileNo = localStorageData.MemberMobileNo;
}

  ngOnInit(): void {
    this.getSocialMediaMessagesPerson();
  }

  getRage(value: any) {
    this.defaultCloseBtn = true;
    this.fromDateWorkdetails = this.datepipe.transform(value.value[0], 'dd/MM/YYYY');
    this.globalFromDate = this.datepipe.transform(value.value[0], 'dd/MM/YYYY');
    this.toDateWorkdetails = this.datepipe.transform(value.value[1], 'dd/MM/YYYY');
    this.globalToDate = this.datepipe.transform(value.value[1], 'dd/MM/YYYY');
    this.getSocialMediaMessagesPerson();
    // this.getMemberprofileDetails();
  }

  clearValue() {
    this.defaultCloseBtn = false;
    this.fromDateWorkdetails = "";
    this.toDateWorkdetails = "";
    this.getSocialMediaMessagesPerson();
    // this.getMemberprofileDetails();
    this.dateTime.setValue(null);
  }


  getSocialMediaMessagesPerson() {
    this.spinner.show();
    let mob='';
    let obj = 'MobileNo=' + mob + '&nopage=' + this.paginationNo + '&FromDate=' + this.globalFromDate + '&ToDate=' + this.globalToDate
    this.callAPIService.setHttp('get', 'Web_GetSocialMediaMessages_Person_Profile?' + obj, false, false, false, 'ncpServiceForWeb');
    this.callAPIService.getHttp().subscribe((res: any) => {
      if (res.data == 0) {
        this.spinner.hide();
        this.socialMediaMessagesPersonArray = res.data1;
        this.chartArray = res.data4;
        this.total = res.data2[0].TotalCount;
        this.workCountAgainstWorkType();
      } else {
        this.toastrService.error("Data is not available");
      }
    }, (error: any) => {
      if (error.status == 500) {
        this.router.navigate(['../500'], { relativeTo: this.route });
      }
    })
  }

  workCountAgainstWorkType() {
    am4core.useTheme(am4themes_animated);
    // Themes end

    let chart = am4core.create("workCountAgainstWork", am4charts.XYChart);

     chart.data = this.chartArray;
    console.log(this.chartArray);
    chart.padding(10, 0, 0, 0);

    let categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.renderer.grid.template.location = 0;
    categoryAxis.dataFields.category = "SocialMediaName";
    categoryAxis.renderer.minGridDistance = 60;
    categoryAxis.renderer.inversed = true;
    categoryAxis.renderer.grid.template.disabled = true;

    let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.min = 0;
    valueAxis.extraMax = 0.1;
    //valueAxis.rangeChangeEasing = am4core.ease.linear;
    //valueAxis.rangeChangeDuration = 1500;

    let series = chart.series.push(new am4charts.ColumnSeries());
    series.dataFields.categoryX = "SocialMediaName";
    series.dataFields.valueY = "TotalCount";
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

  getSocialMediaPersonDataById(index:any) {
    this.getDatabyPersonId=this.socialMediaMessagesPersonArray[index];
  }

  onClickPagintion(pageNo: number) {
    this.paginationNo = pageNo;
    this.getSocialMediaMessagesPerson()
  }

  ngOnDestroy() {
    localStorage.removeItem('SocialMediaDataPM');
  }

}
