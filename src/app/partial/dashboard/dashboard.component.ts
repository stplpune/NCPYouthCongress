import { Component, OnInit } from '@angular/core';
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_kelly from "@amcharts/amcharts4/themes/kelly";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import { CallAPIService } from 'src/app/services/call-api.service';
import { NgxSpinnerService } from "ngx-spinner";
import { ToastrService } from 'ngx-toastr';
import { CommonService } from '../../services/common.service';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
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
    private fb: FormBuilder,
    public dateTimeAdapter: DateTimeAdapter<any>,
    public datepipe: DatePipe,
    private router: Router,
    private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.workLineChart();
    this.getDistrict();
    this.getDashboardCount1();
    this.getLowHighSocialMTypesOfWorks();
    this.getNewMemberAndWorkInThisWeek();
    this.getDistrictWiseMemberCount(false);
  }

  getweekRage(dates: any) {
    var Time = dates.value[1].getTime() - dates.value[0].getTime();
    var Days = Time / (1000 * 3600 * 24);

    if (Days <= 7) {
      let fromDate: any = this.datepipe.transform(dates.value[0], 'dd/MM/yyyy');
      let toDate: any = this.datepipe.transform(dates.value[1], 'dd/MM/yyyy');
      this.weekRangeObj = { 'fromDate': fromDate, 'toDate': toDate };
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

  getDashboardCount1() {//count1 api
    this.spinner.show();
    this.callAPIService.setHttp('get', 'Dashboard_Count1_Data_1_0?UserId=' + this.commonService.loggedInUserId(), false, false, false, 'ncpServiceForWeb');
    this.callAPIService.getHttp().subscribe((res: any) => {
      if (res.data == 0) {
        this.spinner.hide();
        this.dashboardCount1Array = res.data1[0];
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

  getNewMemberAndWorkInThisWeek() {
    this.spinner.show();
    let fromDate = this.datepipe.transform(this.defaultFromDate, 'dd/MM/yyyy');
    let toDate = this.datepipe.transform(this.defaultToDate, 'dd/MM/yyyy');
    this.callAPIService.setHttp('get', 'Dashboard_Count2_Data_1_0?UserId=' + this.commonService.loggedInUserId() + '&FromDate=' + fromDate + '&ToDate=' + toDate, false, false, false, 'ncpServiceForWeb');
    this.callAPIService.getHttp().subscribe((res: any) => {
      if (res.data == 0) {
        this.spinner.hide();
        this.workInThisWeekArray = res.data2;
        this.newMemberInThisWeekArray = res.data1;
        this.weeklyColumnChart();
        console.log('workInThisWeekArray', this.workInThisWeekArray);
        console.log('newMemberInThisWeekArray', this.newMemberInThisWeekArray);
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


  /* Chart code */

  workLineChart() {
    // Themes begin
    am4core.useTheme(am4themes_kelly);
    am4core.useTheme(am4themes_animated);
    // Themes end

    // Create chart instance
    let chart = am4core.create("workLineChartdiv", am4charts.XYChart);

    // Add data 
    // chart.data = this.workInThisWeekArray;
    chart.data = [{
      "x": 1,
      "ay": 6.5,
      "by": 2.2,
      "aValue": 15,
      "bValue": 10
    }, {
      "x": 2,
      "ay": 12.3,
      "by": 4.9,
      "aValue": 8,
      "bValue": 3
    }, {
      "x": 3,
      "ay": 12.3,
      "by": 5.1,
      "aValue": 16,
      "bValue": 4
    }, {
      "x": 5,
      "ay": 2.9,
      "aValue": 9
    }, {
      "x": 7,
      "by": 8.3,
      "bValue": 13
    }, {
      "x": 10,
      "ay": 2.8,
      "by": 13.3,
      "aValue": 9,
      "bValue": 13
    }, {
      "x": 12,
      "ay": 3.5,
      "by": 6.1,
      "aValue": 5,
      "bValue": 2
    }, {
      "x": 13,
      "ay": 5.1,
      "aValue": 10
    }, {
      "x": 15,
      "ay": 6.7,
      "by": 10.5,
      "aValue": 3,
      "bValue": 10
    }, {
      "x": 16,
      "ay": 8,
      "by": 12.3,
      "aValue": 5,
      "bValue": 13
    }, {
      "x": 20,
      "by": 4.5,
      "bValue": 11
    }, {
      "x": 22,
      "ay": 9.7,
      "by": 15,
      "aValue": 15,
      "bValue": 10
    }, {
      "x": 23,
      "ay": 10.4,
      "by": 10.8,
      "aValue": 1,
      "bValue": 11
    }, {
      "x": 24,
      "ay": 1.7,
      "by": 19,
      "aValue": 12,
      "bValue": 3
    }];

    // 13: {ActivityCount: 0, MemberCount: 0, UserCount: 0, Date: "28/05/2021"}



    // Create axes
    let xAxis = chart.xAxes.push(new am4charts.ValueAxis());
    xAxis.renderer.minGridDistance = 40;


    // Create value axis
    let yAxis = chart.yAxes.push(new am4charts.ValueAxis());

    // Create series
    let series1 = chart.series.push(new am4charts.LineSeries());
    series1.dataFields.valueX = "x";
    series1.dataFields.valueY = "ay";
    series1.dataFields.value = "aValue";
    series1.name = "Work Count";
    series1.strokeWidth = 2;
    // series1.bullets.push(new am4charts.CircleBullet());
    // series1.tooltipText = "Place{name} in {valueX}: {valueY}";
    // series1.legendSettings.valueText = "{valueY}";

    let bullet1 = series1.bullets.push(new am4charts.CircleBullet());
    series1.heatRules.push({
      target: bullet1.circle,
      min: 5,
      max: 5,
      property: "radius"
    });

    bullet1.tooltipText = "{valueX} x {valueY}: [bold]{value}[/]";

    let series2 = chart.series.push(new am4charts.LineSeries());
    series2.dataFields.valueX = "x";
    series2.dataFields.valueY = "by";
    series2.dataFields.value = "bValue";
    series2.name = 'Members Count';
    series2.strokeWidth = 2;
    // series2.bullets.push(new am4charts.CircleBullet());
    // series2.tooltipText = "Place{name} in {valueX}: {valueY}";
    // series2.legendSettings.valueText = "{valueY}";

    let bullet2 = series2.bullets.push(new am4charts.CircleBullet());
    series2.heatRules.push({
      target: bullet2.circle,
      min: 5,
      max: 5,
      property: "radius"
    });

    bullet2.tooltipText = "{valueX} x {valueY}: [bold]{value}[/]";


    let hs1 = series1.segments.template.states.create("hover")
    hs1.properties.strokeWidth = 5;
    series1.segments.template.strokeWidth = 1;

    let hs2 = series2.segments.template.states.create("hover")
    hs2.properties.strokeWidth = 5;
    series2.segments.template.strokeWidth = 1;

    // //scrollbars
    // chart.scrollbarX = new am4core.Scrollbar();
    // chart.scrollbarY = new am4core.Scrollbar();

    // Add legend
    chart.legend = new am4charts.Legend();
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

  weeklyColumnChart() {
    // Themes begin
    am4core.useTheme(am4themes_kelly);
    am4core.useTheme(am4themes_animated);
    // Themes end

    let chart = am4core.create("weeklyChartdiv", am4charts.XYChart);

    chart.data = this.newMemberInThisWeekArray;
    // chart.data = [{
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

    chart.padding(5, 5, 5, 5);

    let categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.renderer.grid.template.location = 0;
    categoryAxis.dataFields.category = "DayName";
    categoryAxis.renderer.minGridDistance = 60;
    // categoryAxis.renderer.inversed = true;
    // categoryAxis.renderer.grid.template.disabled = true;

    let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.min = 0;
    valueAxis.extraMax = 0.1;

    let series = chart.series.push(new am4charts.ColumnSeries());
    series.dataFields.categoryX = "DayName";
    series.dataFields.valueY = "UserCount";
    series.tooltipText = "{valueY.value}"
    series.columns.template.strokeOpacity = 0;
    series.columns.template.column.cornerRadiusTopRight = 10;
    series.columns.template.column.cornerRadiusTopLeft = 10;
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
        item.UserCount += Math.round(Math.random() * 200 - 100);
        // item.UserCount = Math.abs(item.UserCount);
      })
      // chart.invalidateRawData();
    }, 2000)

    // categoryAxis.sortBySeries = series;

  }

  pieChart() {
    // Themes begin
    am4core.useTheme(am4themes_kelly);
    am4core.useTheme(am4themes_animated);
    // Themes end

    // Create chart instance
    var chart = am4core.create("pieChartdiv", am4charts.PieChart);

    // Add data
    chart.data = this.typesOfWorksArray;



    // Add and configure Series
    let pieSeries = chart.series.push(new am4charts.PieSeries());
    pieSeries.dataFields.value = "ActivityCount";
    pieSeries.dataFields.category = "Category";
    pieSeries.slices.template.stroke = am4core.color("#fff");
    pieSeries.slices.template.strokeOpacity = 1;

    // This creates initial animation
    pieSeries.hiddenState.properties.opacity = 1;
    pieSeries.hiddenState.properties.endAngle = -90;
    pieSeries.hiddenState.properties.startAngle = -90;

    chart.hiddenState.properties.radius = am4core.percent(0);
  }

  socialMediaChart() {
    // Themes begin
    am4core.useTheme(am4themes_animated);
    // Themes end

    /**
     * Chart design taken from Samsung health app
     */

    let chart = am4core.create("socialMediaChartdiv", am4charts.XYChart);
    chart.hiddenState.properties.opacity = 0; // this creates initial fade-in

    chart.paddingBottom = 10;

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
    columnTemplate.maxWidth = 40;
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
      return circleBullet.circle.pixelRadius + 0;
    })

    let image = bullet.createChild(am4core.Image);
    image.width = 45;
    image.height = 45;
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

  redirectCountingPage(status: any) {
    if (status == 'executiveMember' && this.dashboardCount1Array?.ExcecutiveMembers !== 0) {
      this.router.navigate(['/members/executive-members'], { relativeTo: this.route })
    } else if (status == 'YouthMembers' && this.dashboardCount1Array?.YouthMembers !== 0) {
      this.router.navigate(['/members/view-members'], { relativeTo: this.route })
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
      this.router.navigate(['/social-media-messages'], { relativeTo: this.route })
    } else {
      this.toastrService.error("Data is not available.");
    }
  }

}
