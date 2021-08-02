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


@Component({
  selector: 'app-social-media-image',
  templateUrl: './social-media-image.component.html',
  styleUrls: ['./social-media-image.component.css', '../../partial.component.css']
})
export class SocialMediaImageComponent implements OnInit {

  maxDate: any = new Date();
  toDate = this.datepipe.transform(new Date(), 'dd/MM/yyyy');
  fromDate = this.datepipe.transform(new Date(Date.now() + -6 * 24 * 60 * 60 * 1000), 'dd/MM/yyyy');
  mostLikedPersonArray: any;
  mostHatedPersonArray: any;
  perceptionOnSocialMediaArray: any;
  trendOnSocialMediaArray: any;

  constructor(
    private callAPIService: CallAPIService,
    private spinner: NgxSpinnerService,
    private toastrService: ToastrService,
    private commonService: CommonService,
    public dateTimeAdapter: DateTimeAdapter<any>,
    public datepipe: DatePipe,
  ) { { dateTimeAdapter.setLocale('en-IN') } }

  ngOnInit(): void {
    this.getMostLikeHatedPerson();
    this.getLowHighSocialMTypesOfWorks();
  }

  getweekRage(dates: any) {
       this.fromDate= this.datepipe.transform(dates.value[0], 'dd/MM/yyyy');
       this.toDate= this.datepipe.transform(dates.value[1], 'dd/MM/yyyy');
       this.getMostLikeHatedPerson();
       this.getLowHighSocialMTypesOfWorks();
   }

   getMostLikeHatedPerson() {
    this.spinner.show();
    this.callAPIService.setHttp('get','Dashboard_MostLikeHatedPerson_web_1_0?UserId=' + this.commonService.loggedInUserId() + '&FromDate='+this.fromDate + '&ToDate='+this.toDate, false, false, false, 'ncpServiceForWeb');
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
    this.callAPIService.setHttp('get','Dashboard_PerceptionTrend_web_1_0?UserId=' + this.commonService.loggedInUserId()+ '&FromDate='+this.fromDate + '&ToDate='+this.toDate, false, false, false, 'ncpServiceForWeb');
    this.callAPIService.getHttp().subscribe((res: any) => {
      if (res.data == 0) {
        this.spinner.hide();
        this.trendOnSocialMediaArray = res.data1;
        let perOnSocialMedArray = res.data2;
        let addLogoParty =  perOnSocialMedArray.map((ele:any)=>{
          if (ele.PartyShortCode == 'NCP') {
            ele['href'] = "assets/images/logos/ncp-logo.png";
          } else if (ele.PartyShortCode == 'SS') {
            ele['href'] = "assets/images/logos/shivsena-logo.png";
          } else if (ele.PartyShortCode == 'BJP') {
            ele['href'] = "assets/images/logos/bjp-logo.png";
          } else if (ele.PartyShortCode == 'INC') {
            ele['href'] = "assets/images/logos/inc-logo.png";
          }else if (ele.PartyShortCode == 'OTR') {
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
    // Themes begin
    am4core.useTheme(am4themes_animated);
    // Themes end

    let chart = am4core.create("socialMediaChartdiv", am4charts.XYChart);
    chart.hiddenState.properties.opacity = 0; // this creates initial fade-in

    chart.paddingBottom = 30;

    chart.data = this.perceptionOnSocialMediaArray;
  
    let categoryAxis: any = chart.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = "PartyShortCode";
    categoryAxis.renderer.grid.template.strokeOpacity = 0;
    categoryAxis.renderer.minGridDistance = 10;
    categoryAxis.renderer.labels.template.dy = 35;
    categoryAxis.renderer.tooltip.dy = 35;

    let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.renderer.inside = true;
    valueAxis.renderer.labels.template.fillOpacity = 0.3;
    valueAxis.renderer.grid.template.strokeOpacity = 0;
    valueAxis.min = 0;
    valueAxis.cursorTooltipEnabled = false;
    valueAxis.renderer.baseGrid.strokeOpacity = 0;

    let series: any = chart.series.push(new am4charts.ColumnSeries);
    series.dataFields.valueY = "ActivityCount";
    series.dataFields.categoryX = "PartyShortCode";
    series.tooltipText = "{valueY.value}";
    series.tooltip.pointerOrientation = "vertical";
    series.tooltip.dy = - 6;
    series.columnsContainer.zIndex = 100;

    let columnTemplate = series.columns.template;
    columnTemplate.width = am4core.percent(50);
    columnTemplate.maxWidth = 66;
    columnTemplate.column.cornerRadius(60, 60, 10, 10);
    columnTemplate.strokeOpacity = 0;

    series.heatRules.push({ target: columnTemplate, property: "fill", dataField: "valueY", min: am4core.color("#e5dc36"), max: am4core.color("#5faa46") });
    series.mainContainer.mask = undefined;

    let cursor = new am4charts.XYCursor();
    chart.cursor = cursor;
    cursor.lineX.disabled = true;
    cursor.lineY.disabled = true;
    cursor.behavior = "none";

    let bullet: any = columnTemplate.createChild(am4charts.CircleBullet);
    bullet.circle.radius = 30;
    bullet.valign = "bottom";
    bullet.align = "center";
    bullet.isMeasured = true;
    bullet.mouseEnabled = false;
    bullet.verticalCenter = "bottom";
    bullet.interactionsEnabled = false;

    let hoverState = bullet.states.create("hover");
    let outlineCircle = bullet.createChild(am4core.Circle);
    outlineCircle.adapter.add("radius", function (radius: any, target: any) {
      let circleBullet = target.parent;
      return circleBullet.circle.pixelRadius + 10;
    })

    let image = bullet.createChild(am4core.Image);
    image.width = 60;
    image.height = 60;
    image.horizontalCenter = "middle";
    image.verticalCenter = "middle";
    image.propertyFields.href = "href";

    image.adapter.add("mask", function (mask: any, target: any) {
      let circleBullet = target.parent;
      return circleBullet.circle;
    })

    let previousBullet: any;
    chart.cursor.events.on("cursorpositionchanged", function (event) {
      let dataItem = series.tooltipDataItem;

      if (dataItem.column) {
        let bullet = dataItem.column.children.getIndex(1);

        if (previousBullet && previousBullet != bullet) {
          previousBullet.isHover = false;
        }

        if (previousBullet != bullet) {

          let hs = bullet.states.getKey("hover");
          hs.properties.dy = -bullet.parent.pixelHeight + 30;
          bullet.isHover = true;

          previousBullet = bullet;
        }
      }
    })
  }

  trendSocialMediaLineChart(){
    // Themes begin
am4core.useTheme(am4themes_animated);
// Themes end

// Create chart instance
let chart = am4core.create("trendSocialMediaChart", am4charts.XYChart);

// Add data
chart.data =this.trendOnSocialMediaArray;
// chart.data = [{
//   "Range": "1",
//   "italy": 1,
//   "germany": 5,
//   "uk": 3,
//   "kanda": 5,
//   "us": 3
// }, {
//   "Range": "2",
//   "italy": 1,
//   "germany": 2,
//   "uk": 6,
//   "kanda": 5,
//   "us": 3
// }, {
//   "Range": "3",
//   "italy": 2,
//   "germany": 3,
//   "uk": 1,
//   "kanda": 5,
//   "us": 3
// }, {
//   "Range": "4",
//   "italy": 3,
//   "germany": 4,
//   "uk": 1,
//   "kanda": 5,
//   "us": 3
// }, {
//   "Range": "5",
//   "italy": 5,
//   "germany": 1,
//   "uk": 2,
//   "kanda": 5,
//   "us": 3
// }, {
//   "Range": "6",
//   "italy": 3,
//   "germany": 2,
//   "uk": 1,
//   "kanda": 5,
//   "us": 3
// }, {
//   "Range": "7",
//   "italy": 1,
//   "germany": 2,
//   "uk": 3,
//   "kanda": 5,
//   "us": 3
// }, {
//   "Range": "8",
//   "italy": 2,
//   "germany": 1,
//   "uk": 5,
//   "kanda": 5,
//   "us": 3
// }, {
//   "Range": "9",
//   "italy": 3,
//   "germany": 5,
//   "uk": 2,
//   "kanda": 5,
//   "us": 3
// }, {
//   "Range": "10",
//   "italy": 4,
//   "germany": 3,
//   "uk": 6,
//   "kanda": 5,
//   "us": 3
// }, {
//   "Range": "11",
//   "italy": 1,
//   "germany": 2,
//   "uk": 4,
//   "kanda": 5,
//   "us": 3
// }];

// Create category axis
let categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
categoryAxis.dataFields.category = "SrNo";
categoryAxis.renderer.opposite = false;

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
series1.tooltipText = "Place taken by {name} in {categoryX}: {valueY}";
series1.legendSettings.valueText = "{valueY}";
series1.visible  = false;

let series2 = chart.series.push(new am4charts.LineSeries());
series2.dataFields.valueY = "SHIVSENA";
series2.dataFields.categoryX = "SrNo";
series2.name = 'SS';
series2.bullets.push(new am4charts.CircleBullet());
series2.tooltipText = "Place taken by {name} in {categoryX}: {valueY}";
series2.legendSettings.valueText = "{valueY}";

let series3 = chart.series.push(new am4charts.LineSeries());
series3.dataFields.valueY = "BJP";
series3.dataFields.categoryX = "SrNo";
series3.name = 'BJP';
series3.bullets.push(new am4charts.CircleBullet());
series3.tooltipText = "Place taken by {name} in {categoryX}: {valueY}";
series3.legendSettings.valueText = "{valueY}";

let series4 = chart.series.push(new am4charts.LineSeries());
series4.dataFields.valueY = "INC";
series4.dataFields.categoryX = "SrNo";
series4.name = 'INC';
series4.bullets.push(new am4charts.CircleBullet());
series4.tooltipText = "Place taken by {name} in {categoryX}: {valueY}";
series4.legendSettings.valueText = "{valueY}";

let series5 = chart.series.push(new am4charts.LineSeries());
series5.dataFields.valueY = "Other";
series5.dataFields.categoryX = "SrNo";
series5.name = 'OTR';
series5.bullets.push(new am4charts.CircleBullet());
series5.tooltipText = "Place taken by {name} in {categoryX}: {valueY}";
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
hs2.properties.strokeWidth = 5;
series2.segments.template.strokeWidth = 1;

let hs5 = series5.segments.template.states.create("hover")
hs3.properties.strokeWidth = 5;
series3.segments.template.strokeWidth = 1;

// Add legend
chart.legend = new am4charts.Legend();
chart.legend.itemContainers.template.events.on("over", function(event:any){
  let segments = event.target.dataItem.dataContext.segments;
  segments.each(function(segment:any){
    segment.isHover = true;
  })
})

chart.legend.itemContainers.template.events.on("out", function(event:any){
  let segments = event.target.dataItem.dataContext.segments;
  segments.each(function(segment:any){
    segment.isHover = false;
  })
})


// series2.tooltip.getFillFromObject = false;
// series2.tooltip.background.fill = am4core.color("#FFF");


// series3.tooltip.getFillFromObject = false;
// series3.tooltip.background.fill = am4core.color("#FFF");

}

}