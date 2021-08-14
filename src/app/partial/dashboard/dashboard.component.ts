import { Component, OnInit } from '@angular/core';
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_kelly from "@amcharts/amcharts4/themes/kelly";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import { CallAPIService } from 'src/app/services/call-api.service';
import { NgxSpinnerService } from "ngx-spinner";
import { ToastrService } from 'ngx-toastr';
import { CommonService } from '../../services/common.service';
import { DatePipe } from '@angular/common';
import { DateTimeAdapter } from 'ng-pick-datetime';
import { ActivatedRoute, Router } from '@angular/router';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css', '../partial.component.css'],
  providers: [DatePipe]
})

export class DashboardComponent implements OnInit {
  allDistrictArray: any;
  dashboardCount1Array: any;
  lowestActivityDistrictsArray: any;
  workInThisWeekArray: any;
  highestActivityDistrictsArray: any;
  typesOfWorksArray: any;
  perceptionOnSocialMediaArray: any;
  workInThisWeekForm: any;
  newMemberInThisWeekArray: any;
  districtWiseMemberCountArray: any;
  defaultToDate = new Date();
  defaultFromDate = new Date(Date.now() + -6 * 24 * 60 * 60 * 1000);
  maxDate: any = new Date();
  fromDate: any;
  toDate: any;
  selWeekDate: any;
  weekRangeObj: any;
  districtId: number = 0;
  dateRange = [this.defaultFromDate, this.defaultToDate];

  constructor(
    private callAPIService: CallAPIService,
    private spinner: NgxSpinnerService,
    private toastrService: ToastrService,
    private commonService: CommonService,
    public dateTimeAdapter: DateTimeAdapter<any>,
    public datepipe: DatePipe,
    private router: Router,
    private route: ActivatedRoute,
  ) { { dateTimeAdapter.setLocale('en-IN'); } }

  ngOnInit(): void {
    this.workLineChart();
    this.getDistrict();
    this.getDashboardCount1();
    this.getLowHighSocialMTypesOfWorks();
    this.getNewMemberAndWorkInThisWeek();
    this.getDistrictWiseMemberCount(false);
    this.getweekRage(this.dateRange)
  }

  getweekRage(dates: any) {
    var Time = dates[1].getTime() - dates[0].getTime();
    var Days = Time / (1000 * 3600 * 24);

    if (Days <= 7) {
      // let fromDate: any = this.datepipe.transform(dates[0], 'dd/MM/yyyy');
      // let toDate: any = this.datepipe.transform(dates[1], 'dd/MM/yyyy');
      this.weekRangeObj = { 'fromDate': dates[0], 'toDate': dates[1] };
      localStorage.setItem('weekRange', JSON.stringify(this.weekRangeObj));
    } else {
      this.toastrService.error("Please Select Date Only Week Range");
    }
  }

  getDistrict() {
    this.spinner.show();
    this.callAPIService.setHttp('get', 'Web_GetDistrict_1_0?StateId=' + 1, false, false, false, 'ncpServiceForWeb');
    this.callAPIService.getHttp().subscribe((res: any) => {
      if (res.data == 0) {
        this.spinner.hide();
        this.allDistrictArray = res.data1;
      } else {
          this.toastrService.error("Data is not available");
      }
    } ,(error:any) => {
      if (error.status == 500) {
        this.router.navigate(['../500'], { relativeTo: this.route });
      }
    })
  }


  getDashboardCount1() {//count1 api
    this.spinner.show();
    this.callAPIService.setHttp('get', 'Dashboard_Count1_Data_1_0?UserId=' + this.commonService.loggedInUserId(), false, false, false, 'ncpServiceForWeb');
    this.callAPIService.getHttp().subscribe((res: any) => {
      if (res.data == 0) {
        this.spinner.hide();
        this.dashboardCount1Array = res.data1[0];
      } else {
          this.toastrService.error("Data is not available");
      }
    }  ,(error:any) => {
      if (error.status == 500) {
        this.router.navigate(['../500'], { relativeTo: this.route });
      }
    })
  }

  getLowHighSocialMTypesOfWorks() {//count3 api
    this.spinner.show();
    this.callAPIService.setHttp('get', 'Dashboard_Count3_Data_1_0?UserId=' + this.commonService.loggedInUserId(), false, false, false, 'ncpServiceForWeb');
    this.callAPIService.getHttp().subscribe((res: any) => {
      if (res.data == 0) {
        this.spinner.hide();
        this.highestActivityDistrictsArray = res.data1;
        this.lowestActivityDistrictsArray = res.data2;
        this.typesOfWorksArray = res.data3;
        let perOnSocialMedArray = res.data4;
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
        this.pieChart();
        this.socialMediaChart();
      } else {
          this.toastrService.error("Data is not available");
      }
    }  ,(error:any) => {
      if (error.status == 500) {
        this.router.navigate(['../500'], { relativeTo: this.route });
      }
    })
  }

  getNewMemberAndWorkInThisWeek() {
    this.spinner.show();
    let fromDate = this.datepipe.transform(this.defaultFromDate, 'dd/MM/yyyy');
    let toDate = this.datepipe.transform(this.defaultToDate, 'dd/MM/yyyy');
    this.callAPIService.setHttp('get', 'Dashboard_Count2_Data_1_0?UserId=' + this.commonService.loggedInUserId() + '&FromDate=' + fromDate + '&ToDate=' + toDate, false, false, false, 'ncpServiceForWeb');
    this.callAPIService.getHttp().subscribe((res: any) => {
      if (res.data == 0) {
        this.spinner.hide();
        this.workInThisWeekArray = res.data2;
        this.workLineChart();
        this.newMemberInThisWeekArray = res.data1;
        this.weeklyColumnChart();
      } else {
          this.toastrService.error("Data is not available");
      }
    }  ,(error:any) => {
      if (error.status == 500) {
        this.router.navigate(['../500'], { relativeTo: this.route });
      }
    })
  }

  getDistrictWiseMemberCount(event: any) {
    event == false ? this.districtId = 0 : this.districtId = event;
    this.spinner.show();
    let fromDate = this.datepipe.transform(this.defaultFromDate, 'dd/MM/yyyy');
    let toDate = this.datepipe.transform(this.defaultToDate, 'dd/MM/yyyy');
    this.callAPIService.setHttp('get', 'Dashboard_CountNewmember_Dist_1_0?UserId=' + this.commonService.loggedInUserId() + '&FromDate=' + fromDate + '&ToDate=' + toDate + '&DistrictId=' + this.districtId, false, false, false, 'ncpServiceForWeb');
    this.callAPIService.getHttp().subscribe((res: any) => {
      if (res.data == 0) {
        this.spinner.hide();
        this.districtWiseMemberCountArray = res.data1;
        this.weeklyColumnChart();
      } else {
          this.toastrService.error("Data is not available");
      }
    }  ,(error:any) => {
      if (error.status == 500) {
        this.router.navigate(['../500'], { relativeTo: this.route });
      }
    })
  }


  /* Chart code */
  workLineChart(){
  am4core.useTheme(am4themes_animated);
  // Themes end
  
  // Create chart instance
  let chart = am4core.create("workLineChartdiv", am4charts.XYChart);
  
  // Add data

  chart.data = this.workInThisWeekArray;

  // Create category axis
  let categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
  categoryAxis.dataFields.category = "Date";
  categoryAxis.renderer.opposite = false;
  
  
  // Create value axis
  let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
  valueAxis.renderer.inversed = false;
  valueAxis.title.text = "Work In This Week Dated Count";
  valueAxis.renderer.minLabelPosition = 0.01;
  
  // Create series
  let series1 = chart.series.push(new am4charts.LineSeries());
  series1.dataFields.valueY = "ActivityCount";
  series1.dataFields.categoryX = "Date";
  series1.name = "Work Count";
  series1.bullets.push(new am4charts.CircleBullet());
  series1.tooltipText = "{name} in {categoryX}: {valueY}";
  series1.legendSettings.valueText = "{valueY}";
  series1.visible  = false;

  let series2 = chart.series.push(new am4charts.LineSeries());
  series2.dataFields.valueY = "MemberCount";
  series2.dataFields.categoryX = "Date";
  series2.name = 'Members Count';
  series2.bullets.push(new am4charts.CircleBullet());
  series2.tooltipText = "{name} in {categoryX}: {valueY}";
  series2.legendSettings.valueText = "{valueY}";

  let series3 = chart.series.push(new am4charts.LineSeries());
series3.dataFields.valueY = "UserCount";
series3.dataFields.categoryX = "Date";
series3.name = 'UserCount';
series3.bullets.push(new am4charts.CircleBullet());
series3.tooltipText = "{name} in {categoryX}: {valueY}";
series3.legendSettings.valueText = "{valueY}";

  // Add chart cursor
  // chart.cursor = new am4charts.XYCursor();
  // chart.cursor.behavior = "zoomY";
  
  
  let hs1 = series1.segments.template.states.create("hover")
  hs1.properties.strokeWidth = 5;
  series1.segments.template.strokeWidth = 1;
  
  let hs2 = series2.segments.template.states.create("hover")
  hs2.properties.strokeWidth = 5;
  series2.segments.template.strokeWidth = 1;

  let hs3 = series3.segments.template.states.create("hover")
hs3.properties.strokeWidth = 5;
series3.segments.template.strokeWidth = 1;
  
  // Add legend
  chart.legend = new am4charts.Legend();
  chart.legend.maxWidth = 70;
  chart.legend.fontSize = 9;

  // let markerTemplate = chart.legend.markers.template;
  // markerTemplate.width = 15;
  // markerTemplate.height = 15;


  // chart.legend.itemContainers.template.events.on("over", function(event:any){
  //   let segments = event.target.dataItem.dataContext.segments;
  //   segments.each(function(segment:any){
  //     segment.isHover = true;
  //   })
  // })
  
  // chart.legend.itemContainers.template.events.on("out", function(event:any){
  //   let segments = event.target.dataItem.dataContext.segments;
  //   segments.each(function(segment:any){
  //     segment.isHover = false;
  //   })
  // })
  
}


  // workLineChart() {
  //   // Themes begin
  //   am4core.useTheme(am4themes_kelly);
  //   am4core.useTheme(am4themes_animated);
  //   // Themes end

  //   // Create chart instance
  //   let chart = am4core.create("workLineChartdiv", am4charts.XYChart);

  //   // Add data 
  //   // chart.data = this.workInThisWeekArray;
  //   chart.data = [{
  //     "x": 1,
  //     "ay": 6.5,
  //     "by": 2.2,
  //     "aValue": 15,
  //     "bValue": 10
  //   }, {
  //     "x": 2,
  //     "ay": 12.3,
  //     "by": 4.9,
  //     "aValue": 8,
  //     "bValue": 3
  //   }, {
  //     "x": 3,
  //     "ay": 12.3,
  //     "by": 5.1,
  //     "aValue": 16,
  //     "bValue": 4
  //   }, {
  //     "x": 5,
  //     "ay": 2.9,
  //     "aValue": 9
  //   }, {
  //     "x": 7,
  //     "by": 8.3,
  //     "bValue": 13
  //   }, {
  //     "x": 10,
  //     "ay": 2.8,
  //     "by": 13.3,
  //     "aValue": 9,
  //     "bValue": 13
  //   }, {
  //     "x": 12,
  //     "ay": 3.5,
  //     "by": 6.1,
  //     "aValue": 5,
  //     "bValue": 2
  //   }, {
  //     "x": 13,
  //     "ay": 5.1,
  //     "aValue": 10
  //   }, {
  //     "x": 15,
  //     "ay": 6.7,
  //     "by": 10.5,
  //     "aValue": 3,
  //     "bValue": 10
  //   }, {
  //     "x": 16,
  //     "ay": 8,
  //     "by": 12.3,
  //     "aValue": 5,
  //     "bValue": 13
  //   }, {
  //     "x": 20,
  //     "by": 4.5,
  //     "bValue": 11
  //   }, {
  //     "x": 22,
  //     "ay": 9.7,
  //     "by": 15,
  //     "aValue": 15,
  //     "bValue": 10
  //   }, {
  //     "x": 23,
  //     "ay": 10.4,
  //     "by": 10.8,
  //     "aValue": 1,
  //     "bValue": 11
  //   }, {
  //     "x": 24,
  //     "ay": 1.7,
  //     "by": 19,
  //     "aValue": 12,
  //     "bValue": 3
  //   }];

  //   // 13: {ActivityCount: 0, MemberCount: 0, UserCount: 0, Date: "28/05/2021"}



  //   // Create axes
  //   let xAxis = chart.xAxes.push(new am4charts.ValueAxis());
  //   xAxis.renderer.minGridDistance = 40;


  //   // Create value axis
  //   let yAxis = chart.yAxes.push(new am4charts.ValueAxis());

  //   // Create series
  //   let series1 = chart.series.push(new am4charts.LineSeries());
  //   series1.dataFields.valueX = "x";
  //   series1.dataFields.valueY = "ay";
  //   series1.dataFields.value = "aValue";
  //   series1.name = "Work Count";
  //   series1.strokeWidth = 2;
  //   // series1.bullets.push(new am4charts.CircleBullet());
  //   // series1.tooltipText = "Place{name} in {valueX}: {valueY}";
  //   // series1.legendSettings.valueText = "{valueY}";

  //   let bullet1 = series1.bullets.push(new am4charts.CircleBullet());
  //   series1.heatRules.push({
  //     target: bullet1.circle,
  //     min: 5,
  //     max: 5,
  //     property: "radius"
  //   });

  //   bullet1.tooltipText = "{valueX} x {valueY}: [bold]{value}[/]";

  //   let series2 = chart.series.push(new am4charts.LineSeries());
  //   series2.dataFields.valueX = "x";
  //   series2.dataFields.valueY = "by";
  //   series2.dataFields.value = "bValue";
  //   series2.name = 'Members Count';
  //   series2.strokeWidth = 2;
  //   // series2.bullets.push(new am4charts.CircleBullet());
  //   // series2.tooltipText = "Place{name} in {valueX}: {valueY}";
  //   // series2.legendSettings.valueText = "{valueY}";

  //   let bullet2 = series2.bullets.push(new am4charts.CircleBullet());
  //   series2.heatRules.push({
  //     target: bullet2.circle,
  //     min: 5,
  //     max: 5,
  //     property: "radius"
  //   });

  //   bullet2.tooltipText = "{valueX} x {valueY}: [bold]{value}[/]";


  //   let hs1 = series1.segments.template.states.create("hover")
  //   hs1.properties.strokeWidth = 5;
  //   series1.segments.template.strokeWidth = 1;

  //   let hs2 = series2.segments.template.states.create("hover")
  //   hs2.properties.strokeWidth = 5;
  //   series2.segments.template.strokeWidth = 1;

  //   // //scrollbars
  //   // chart.scrollbarX = new am4core.Scrollbar();
  //   // chart.scrollbarY = new am4core.Scrollbar();

  //   // Add legend
  //   chart.legend = new am4charts.Legend();
  //   chart.legend.itemContainers.template.events.on("over", function (event: any) {
  //     let segments = event.target.dataItem.dataContext.segments;
  //     segments.each(function (segment: any) {
  //       segment.isHover = true;
  //     })
  //   })

  //   chart.legend.itemContainers.template.events.on("out", function (event: any) {
  //     let segments = event.target.dataItem.dataContext.segments;
  //     segments.each(function (segment: any) {
  //       segment.isHover = false;
  //     })
  //   })
  // }

  weeklyColumnChart() {
    // Themes begin
    am4core.useTheme(am4themes_kelly);
    am4core.useTheme(am4themes_animated);
    // Themes end

    let chart = am4core.create("weeklyChartdiv", am4charts.XYChart);
    chart.colors.list = [
      am4core.color("#F1948A"),
      am4core.color("#E59866"),
      am4core.color("#AED6F1"),
      am4core.color("#ABEBC6"),
      am4core.color("#80DEEA"),
      am4core.color("#99A3A4"),
      am4core.color("#D2B4DE")
    ];

    chart.data = this.newMemberInThisWeekArray;

    chart.padding(5, 5, 5, 5);

    let categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.renderer.grid.template.location = 0;
    categoryAxis.dataFields.category = "DayName";
    categoryAxis.title.text = "Days";
    // categoryAxis.renderer.minGridDistance = 60;
    // categoryAxis.renderer.labels.template.rotation = -45;
    categoryAxis.renderer.minGridDistance = 20;
    let label = categoryAxis.renderer.labels.template;
    label.truncate = true;
    label.maxWidth = 60;
    // categoryAxis.renderer.inversed = true;
    // categoryAxis.renderer.grid.template.disabled = true;

    let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.min = 0;
    valueAxis.title.text = "New Members in This Week Count";
    valueAxis.extraMax = 0.1;

    let series = chart.series.push(new am4charts.ColumnSeries());
    series.dataFields.categoryX = "DayName";
    series.dataFields.valueY = "UserCount";
    series.tooltipText = "{valueY.value}"
    series.columns.template.strokeOpacity = 0;
    series.columns.template.column.cornerRadiusTopRight = 10;
    series.columns.template.column.cornerRadiusTopLeft = 10;
    let labelBullet = series.bullets.push(new am4charts.LabelBullet());
    labelBullet.label.fill = am4core.color("#00000");
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
        item.UserCount += Math.round(Math.random() * 200 - 100);
        // item.UserCount = Math.abs(item.UserCount);
      })
      // chart.invalidateRawData();
    }, 2000)
  }

  pieChart() {
    am4core.useTheme(am4themes_animated);

    // Create chart instance
    let chart = am4core.create("pieChartdiv", am4charts.PieChart);

    // Add and configure Series
    let pieSeries = chart.series.push(new am4charts.PieSeries());
    pieSeries.colors.list = [
      am4core.color("#CC9999"),
      am4core.color("#4DB6AC"),
      am4core.color("#FF6F91"),
      am4core.color("#FF9671"),
      am4core.color("#FFC75F"),
      am4core.color("#9FA8DA"),
    ];

    pieSeries.dataFields.value = "ActivityCount";
    pieSeries.dataFields.category = "Category";

    // Let's cut a hole in our Pie chart the size of 30% the radius
    // chart.innerRadius = am4core.percent(30);

    // Put a thick white border around each Slice
    pieSeries.slices.template.stroke = am4core.color("#fff");
    pieSeries.slices.template.strokeWidth = 2;
    pieSeries.slices.template.strokeOpacity = 1;
    pieSeries.slices.template
      // change the cursor on hover to make it apparent the object can be interacted with
      .cursorOverStyle = [
        {
          "property": "cursor",
          "value": "pointer"
        }
      ];

    // Create a base filter effect (as if it's not there) for the hover to return to
    let shadow = pieSeries.slices.template.filters.push(new am4core.DropShadowFilter);
    shadow.opacity = 0;

    // Create hover state
    let hoverState: any = pieSeries.slices.template.states.getKey("hover"); // normally we have to create the hover state, in this case it already exists

    // Slightly shift the shadow and make it more prominent on hover
    let hoverShadow = hoverState.filters.push(new am4core.DropShadowFilter);
    hoverShadow.opacity = 0.7;
    hoverShadow.blur = 5;
    chart.radius = am4core.percent(80);
    // Add a legend
    chart.legend = new am4charts.Legend();
    chart.legend.maxWidth = 100;
    chart.legend.fontSize = 9;
    chart.legend.scrollable = true;
    chart.legend.position = "bottom";
    chart.legend.contentAlign = "left";

    let markerTemplate = chart.legend.markers.template;
    markerTemplate.width = 15;
    markerTemplate.height = 15;
    pieSeries.labels.template.disabled = true;


    chart.data = this.typesOfWorksArray;

  }

  socialMediaChart() {
    am4core.useTheme(am4themes_animated);
    // Themes end

    let chart = am4core.create("socialMediaChartdiv", am4charts.XYChart);
    chart.hiddenState.properties.opacity = 0; // this creates initial fade-in

    chart.data = this.perceptionOnSocialMediaArray;
    chart.colors.list = [
      am4core.color("#99C6F9"),
      am4core.color("#FFB888"),
      am4core.color("#A7D89C"),
      am4core.color("#A0A7E3"),
      am4core.color("#F8BFBF"),
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


  redirectCountingPage(status: any) {
    if (status == 'executiveMember' && this.dashboardCount1Array?.ExcecutiveMembers !== 0) {
      this.router.navigate(['/member/executive'], { relativeTo: this.route })
    } else if (status == 'YouthMembers' && this.dashboardCount1Array?.YouthMembers !== 0) {
      this.router.navigate(['/member/all'], { relativeTo: this.route })
    } else if (status == 'activeMembers' && this.dashboardCount1Array?.ActiveMembers !== 0) {
      // this.router.navigate(['/dashboard'], {relativeTo:this.route})
      this.toastrService.error("Page Not Avaliable...!!!");
    } else if (status == 'committeeWork' && this.dashboardCount1Array?.CommitteeWork !== 0) {
      // this.router.navigate(['/dashboard'], {relativeTo:this.route})
      this.toastrService.error("Page Not Avaliable...!!!");
    } else if (status == 'memberWork' && this.dashboardCount1Array?.MemberWork !== 0) {
      // this.router.navigate(['/dashboard'], {relativeTo:this.route})
      this.toastrService.error("Page Not Avaliable...!!!!");
    } else if (status == 'socialMediaWork' && this.dashboardCount1Array?.SocialMediaWork !== 0) {
      this.router.navigate(['/social-media'], { relativeTo: this.route })
    } else {
      this.toastrService.error("Data is not available.");
    }
  }


}
