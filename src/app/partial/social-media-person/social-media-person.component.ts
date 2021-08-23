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
  mostFavouerd:any;
  MostOpposite:any;

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
    this.getPersonData()
  }

  getRage(value: any) {
    this.paginationNo = 1;
    this.defaultCloseBtn = true;
    this.fromDateWorkdetails = this.datepipe.transform(value.value[0], 'dd/MM/YYYY');
    this.globalFromDate = this.datepipe.transform(value.value[0], 'dd/MM/YYYY');
    this.toDateWorkdetails = this.datepipe.transform(value.value[1], 'dd/MM/YYYY');
    this.globalToDate = this.datepipe.transform(value.value[1], 'dd/MM/YYYY');
    this.getSocialMediaMessagesPerson();
    // this.getMemberprofileDetails();
  }

  // clearValue() {
  //   this.defaultCloseBtn = false;
  //   this.fromDateWorkdetails = "";
  //   this.toDateWorkdetails = "";
  //   this.getSocialMediaMessagesPerson();
  //   // this.getMemberprofileDetails();
  //   this.dateTime.setValue(null);
  // }

  clearFilter(){
    this.defaultCloseBtn = false;
    this.globalFromDate = "";
    this.globalToDate = "";
    this.dateTime.setValue(null);
    this.paginationNo = 1;
    this.getSocialMediaMessagesPerson();
  }

  getSocialMediaMessagesPerson() {
    this.spinner.show();
    let obj = 'MobileNo=' + this.MemberMobileNo + '&nopage=' + this.paginationNo + '&FromDate=' + this.globalFromDate + '&ToDate=' + this.globalToDate
    this.callAPIService.setHttp('get', 'Web_GetSocialMediaMessages_Person_Profile?' + obj, false, false, false, 'ncpServiceForWeb');
    this.callAPIService.getHttp().subscribe((res: any) => {
      if (res.data == 0) {
        this.spinner.hide();
        this.socialMediaMessagesPersonArray = res.data1;
        this.total = res.data2[0].TotalCount;
        this.workCountAgainstWorkType();
      } else {
        this.spinner.hide();
        this.socialMediaMessagesPersonArray = [];
        // this.toastrService.error("Data is not available");
      }
    }, (error: any) => {
      this.spinner.hide();
      if (error.status == 500) {
        this.router.navigate(['../500'], { relativeTo: this.route });
      }
    })
  }


  getPersonData() {
    this.spinner.show();
    this.callAPIService.setHttp('get', 'Web_GetSocialMediaMessages_Person_ProfileGraph?MobileNo='+this.MemberMobileNo, false, false, false, 'ncpServiceForWeb');
    this.callAPIService.getHttp().subscribe((res: any) => {
      if (res.data == 0) {
        this.spinner.hide();
        this.MostOpposite  = res.data3;
        this.mostFavouerd = res.data2;
        this.chartArray = res.data1;
       
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
    chart.hiddenState.properties.opacity = 0; // this creates initial fade-in

    chart.data = this.chartArray;
    chart.colors.list = [
      am4core.color("#80DEEA"),
      am4core.color("#FF8A65"),
      am4core.color("#E57373"),
      am4core.color("#7986CB"),
      am4core.color("#4DB6AC"),
    ];

    let categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.renderer.grid.template.location = 0;
    categoryAxis.dataFields.category = "PartyShortCode";
    categoryAxis.renderer.minGridDistance = 40;
    categoryAxis.fontSize = 11;
    categoryAxis.renderer.labels.template.dy = 5;
    categoryAxis.title.text = "Party Name";


    let image = new am4core.Image();
    image.horizontalCenter = "middle";
    image.width = 30;
    image.height = 30;
    image.verticalCenter = "middle";
    image.adapter.add("href", (href, target: any) => {
      let category = target.dataItem.category;
      category
      if (category) {
        return "assets/images/logos/" + category.split(" ").join("-").toLowerCase() + ".png";
      }
      return href;
    })
    categoryAxis.dataItems.template.bullet = image;



    let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.min = 0;
    valueAxis.renderer.minGridDistance = 30;
    valueAxis.renderer.baseGrid.disabled = true;
    valueAxis.title.text = "Impressions on social media";

    let series = chart.series.push(new am4charts.ColumnSeries());
    series.dataFields.categoryX = "PartyShortCode";
    series.dataFields.valueY = "ActivityCount";
    series.columns.template.tooltipText = "{valueY.value}";
    series.columns.template.tooltipY = 0;
    series.columns.template.strokeOpacity = 0;

    // as by default columns of the same series are of the same color, we add adapter which takes colors from chart.colors color set
    series.columns.template.adapter.add("fill", function (fill, target: any) {
      return chart.colors.getIndex(target.dataItem.index);
    });

  }

  getSocialMediaPersonDataById(index:any) {
    this.getDatabyPersonId=this.socialMediaMessagesPersonArray[index];
  }

  onClickPagintion(pageNo: number) {
    this.paginationNo = pageNo;
    this.getSocialMediaMessagesPerson()
  }

  ngOnDestroy() {
    // localStorage.removeItem('SocialMediaDataPM');
  }

}
