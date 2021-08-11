import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from "ngx-spinner";
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import { CallAPIService } from 'src/app/services/call-api.service';
import { ToastrService } from 'ngx-toastr';

import { DatePipe } from '@angular/common';
import { DateTimeAdapter } from 'ng-pick-datetime';
import { CommonService } from 'src/app/services/common.service';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-social-media-image',
  templateUrl: './social-media-image.component.html',
  styleUrls: ['./social-media-image.component.css', '../../partial.component.css'],

})
export class SocialMediaImageComponent implements OnInit {

  maxDate: any = new Date();
  toDate = this.datepipe.transform(new Date(), 'dd/MM/yyyy');
  fromDate = this.datepipe.transform(new Date(Date.now() + -7 * 24 * 60 * 60 * 1000), 'dd/MM/yyyy');
  mostLikedPersonArray: any;
  mostHatedPersonArray: any;
  perceptionOnSocialMediaArray: any;
  trendOnSocialMediaArray: any;
  dateRange = [new Date(Date.now() + -7 * 24 * 60 * 60 * 1000), new Date()];
  allDistrict: any;
  getTalkaByDistrict: any;
  filterForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private callAPIService: CallAPIService,
    private spinner: NgxSpinnerService,
    private toastrService: ToastrService,
    private commonService: CommonService,
    public dateTimeAdapter: DateTimeAdapter<any>,
    public datepipe: DatePipe,
  ) { { dateTimeAdapter.setLocale('en-IN'); } }

  ngOnInit(): void {
    this.getMostLikeHatedPerson();
    this.getLowHighSocialMTypesOfWorks();
    this.getDistrict();
    this.defaultFilterForm();
  }

  
  defaultFilterForm() {
    this.filterForm = this.fb.group({
      DistrictId: [''],
      TalukaId: [''],
      fromTo:['']
    })
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
          this.toastrService.error("Data is not available 2");
        } else {
          this.toastrService.error("Please try again something went wrong");
        }
      }
    })
  }

  getTaluka(districtId: any) {

    this.spinner.show();
    this.callAPIService.setHttp('get', 'Web_GetTaluka_1_0?DistrictId=' + districtId, false, false, false, 'ncpServiceForWeb');
    this.callAPIService.getHttp().subscribe((res: any) => {
      if (res.data == 0) {
        this.spinner.hide();
        this.getTalkaByDistrict = res.data1;
        console.log(this.getTalkaByDistrict)
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


  getweekRage(dates: any) {
    var Time = dates.value[1].getTime() - dates.value[0].getTime();
    var Days = Time / (1000 * 3600 * 24);

    if (Days <= 7) {
      this.fromDate = this.datepipe.transform(dates.value[0], 'dd/MM/yyyy');
      this.toDate = this.datepipe.transform(dates.value[1], 'dd/MM/yyyy');
      this.getMostLikeHatedPerson();
      this.getLowHighSocialMTypesOfWorks();
    } else {
      this.toastrService.error("Please Select Date Only Week Range");
    }
  }

  getMostLikeHatedPerson() {
    this.spinner.show();
    this.callAPIService.setHttp('get', 'Dashboard_MostLikeHatedPerson_web_1_0?UserId=' + this.commonService.loggedInUserId() + '&FromDate=' + this.fromDate + '&ToDate=' + this.toDate, false, false, false, 'ncpServiceForWeb');
    this.callAPIService.getHttp().subscribe((res: any) => {
      if (res.data == 0) {
        this.spinner.hide();
        this.mostLikedPersonArray = res.data1;
        this.mostHatedPersonArray = res.data2;
        //console.log('getDistrictWiseMemberCount',this.districtWiseMemberCountArray);
      } else {
        if (res.data == 1) {
          this.spinner.hide();
          this.toastrService.error("Data is not available");
        } else {
          this.spinner.hide();
          this.toastrService.error("Please try again something went wrong");
        }
      }
    })
  }

  getLowHighSocialMTypesOfWorks() {//count3 api
    this.spinner.show();
    this.callAPIService.setHttp('get', 'Dashboard_PerceptionTrend_web_1_0?UserId=' + this.commonService.loggedInUserId() + '&FromDate=' + this.fromDate + '&ToDate=' + this.toDate, false, false, false, 'ncpServiceForWeb');
    this.callAPIService.getHttp().subscribe((res: any) => {
      if (res.data == 0) {
        this.spinner.hide();
        this.trendOnSocialMediaArray = res.data1;
        let perOnSocialMedArray = res.data2;
        let addLogoParty = perOnSocialMedArray.map((ele: any) => {
          if (ele.PartyShortCode == 'NCP') {
            ele['href'] = "assets/images/logos/ncp-logo.png";
          } else if (ele.PartyShortCode == 'SS') {
            ele['href'] = "assets/images/logos/shivsena-logo.png";
          } else if (ele.PartyShortCode == 'BJP') {
            ele['href'] = "assets/images/logos/bjp-logo.png";
          } else if (ele.PartyShortCode == 'INC') {
            ele['href'] = "assets/images/logos/inc-logo.png";
          } else if (ele.PartyShortCode == 'OTR') {
            ele['href'] = "assets/images/logos/speech.png";
          }
          return ele
        })
        this.perceptionOnSocialMediaArray = addLogoParty
        this.trendSocialMediaLineChart();
        this.socialMediaChart();
      } else {
        if (res.data == 1) {
          this.spinner.hide();
          this.toastrService.error("Data is not available");
        } else {
          this.spinner.hide();
          this.toastrService.error("Please try again something went wrong");
        }
      }
    })
  }

  socialMediaChart() {
    am4core.useTheme(am4themes_animated);
    // Themes end

    let chart = am4core.create("socialMediaChartdiv", am4charts.XYChart);
    chart.hiddenState.properties.opacity = 0; // this creates initial fade-in

    chart.data = this.perceptionOnSocialMediaArray;

    let categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.renderer.grid.template.location = 0;
    categoryAxis.dataFields.category = "PartyShortCode";
    categoryAxis.renderer.minGridDistance = 40;
    categoryAxis.fontSize = 11;
    categoryAxis.renderer.labels.template.dy = 5;



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
      console.log(target);
      return href;
    })
    categoryAxis.dataItems.template.bullet = image;



    let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.min = 0;
    valueAxis.renderer.minGridDistance = 30;
    valueAxis.renderer.baseGrid.disabled = true;

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

  trendSocialMediaLineChart() {
    // Themes begin
    am4core.useTheme(am4themes_animated);
    // Themes end

    // Create chart instance
    let chart = am4core.create("trendSocialMediaChart", am4charts.XYChart);

    // Add data
    chart.data = this.trendOnSocialMediaArray;

    // Create category axis
    let categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = "SrNo";
    categoryAxis.renderer.opposite = false;
    categoryAxis.title.text = "X-Axis";

    // Create value axis
    let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.renderer.inversed = false;
    valueAxis.title.text = "% of followers in total recorded";
    valueAxis.renderer.minLabelPosition = 0.01;

    // Create series
    let series1 = chart.series.push(new am4charts.LineSeries());
    series1.dataFields.valueY = "NCP";
    series1.dataFields.categoryX = "SrNo";
    series1.name = "NCP";
    series1.bullets.push(new am4charts.CircleBullet());
    series1.tooltipText = "{name} in {categoryX}: {valueY}";
    series1.legendSettings.valueText = "{valueY}";
    series1.visible = false;

    let series2 = chart.series.push(new am4charts.LineSeries());
    series2.dataFields.valueY = "SHIVSENA";
    series2.dataFields.categoryX = "SrNo";
    series2.name = 'SS';
    series2.bullets.push(new am4charts.CircleBullet());
    series2.tooltipText = "{name} in {categoryX}: {valueY}";
    series2.legendSettings.valueText = "{valueY}";

    let series3 = chart.series.push(new am4charts.LineSeries());
    series3.dataFields.valueY = "BJP";
    series3.dataFields.categoryX = "SrNo";
    series3.name = 'BJP';
    series3.bullets.push(new am4charts.CircleBullet());
    series3.tooltipText = "{name} in {categoryX}: {valueY}";
    series3.legendSettings.valueText = "{valueY}";

    let series4 = chart.series.push(new am4charts.LineSeries());
    series4.dataFields.valueY = "INC";
    series4.dataFields.categoryX = "SrNo";
    series4.name = 'INC';
    series4.bullets.push(new am4charts.CircleBullet());
    series4.tooltipText = "{name} in {categoryX}: {valueY}";
    series4.legendSettings.valueText = "{valueY}";

    let series5 = chart.series.push(new am4charts.LineSeries());
    series5.dataFields.valueY = "Other";
    series5.dataFields.categoryX = "SrNo";
    series5.name = 'OTR';
    series5.bullets.push(new am4charts.CircleBullet());
    series5.tooltipText = "{name} in {categoryX}: {valueY}";
    series5.legendSettings.valueText = "{valueY}";

    // Add chart cursor
    chart.cursor = new am4charts.XYCursor();
    chart.cursor.behavior = "zoomY";

    let hs1 = series1.segments.template.states.create("hover")
    hs1.properties.strokeWidth = 5;
    series1.segments.template.strokeWidth = 1;

    let hs2 = series2.segments.template.states.create("hover")
    hs2.properties.strokeWidth = 5;
    series2.segments.template.strokeWidth = 1;

    let hs3 = series3.segments.template.states.create("hover")
    hs3.properties.strokeWidth = 5;
    series3.segments.template.strokeWidth = 1;

    let hs4 = series4.segments.template.states.create("hover")
    hs4.properties.strokeWidth = 5;
    series4.segments.template.strokeWidth = 1;

    let hs5 = series5.segments.template.states.create("hover")
    hs5.properties.strokeWidth = 5;
    series5.segments.template.strokeWidth = 1;

    // Add legend
    chart.legend = new am4charts.Legend();
    // chart.legend.paddingLeft = 80;
    chart.legend.itemContainers.template.events.on("over", function (event: any) {
      let segments = event.target.dataItem.dataContext.segments;
      segments.each(function (segment: any) {
        segment.isHover = true;
      })
    })

    chart.legend.itemContainers.template.events.on("out", function (event: any) {
      let segments = event.target.dataItem.dataContext.segments;
      segments.each(function (segment: any) {
        segment.isHover = false;
      })
    })

  }

}