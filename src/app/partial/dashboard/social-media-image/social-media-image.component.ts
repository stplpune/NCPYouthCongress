import { AfterViewInit, Component, OnChanges, OnDestroy, OnInit } from '@angular/core';
import { NgxSpinnerService } from "ngx-spinner";
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import { CallAPIService } from 'src/app/services/call-api.service';
import { ToastrService } from 'ngx-toastr';

import { DatePipe, Location } from '@angular/common';
import { DateTimeAdapter } from 'ng-pick-datetime';
import { CommonService } from 'src/app/services/common.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { pairwise, startWith } from 'rxjs/operators';
declare var $: any

@Component({
  selector: 'app-social-media-image',
  templateUrl: './social-media-image.component.html',
  styleUrls: ['./social-media-image.component.css', '../../partial.component.css'],

})
export class SocialMediaImageComponent implements OnInit, AfterViewInit, OnDestroy {

  maxDate: any = new Date();
  toDate = this.datepipe.transform(new Date(), 'dd/MM/yyyy');
  fromDate = this.datepipe.transform(new Date(Date.now() + -7 * 24 * 60 * 60 * 1000), 'dd/MM/yyyy');
  mostLikedPersonArray: any;
  mostHatedPersonArray: any;
  perceptionOnSocialMediaArray: any;
  trendOnSocialMediaArray: any;
  dateRange = [new Date(Date.now() + -7 * 24 * 60 * 60 * 1000), new Date()];
  dateRange1 = [new Date(Date.now() + -7 * 24 * 60 * 60 * 1000), new Date()];
  allDistrict: any;
  getTalkaByDistrict: any;
  filterForm!: FormGroup;
  defaultCloseBtn: boolean = false;
  perceptionTrendWebArray: any;
  perOnSocialMedArray: any;
  graphInstance: any;
  resPoliticalParty: any;
  selectedParty: number = 1;
  resultofPartyData: any;
  allowClearParty:boolean = false; 
  selPrevPartyId:any = 1;

  constructor(
    private fb: FormBuilder,
    private callAPIService: CallAPIService,
    private spinner: NgxSpinnerService,
    private toastrService: ToastrService,
    private commonService: CommonService,
    public dateTimeAdapter: DateTimeAdapter<any>,
    public location: Location,
    public datepipe: DatePipe,
  ) { { dateTimeAdapter.setLocale('en-IN'); } }

  ngOnInit(): void {
    this.getDistrict();
    this.defaultFilterForm();
    this.getMostLikeHatedPerson();
    this.getPoliticalParty();
  }


  ngAfterViewInit() {
    this.showSvgMap(this.commonService.mapRegions());
  }


  showSvgMap(regions_m: any) {
    if (this.graphInstance) {
      this.graphInstance.destroy();
    }
    this.graphInstance = $("#mapsvg").mapSvg({
      width: 550,
      height: 430,
      colors: {
        //baseDefault: "#bfddff",
        background: "#fff",
        selected: "#7289da",
        hover: "#7289da",
        directory: "#bfddff",
        status: {}
      },
      regions: regions_m,
      viewBox: [0, 0, 763.614, 599.92],
      cursor: "pointer",
      zoom: {
        on: false,
        limit: [0, 50],
        delta: 2,
        buttons: {
          on: true,
          location: "left"
        },
        mousewheel: true
      },
      tooltips: {
        mode: "title",
        off: true,
        priority: "local",
        position: "bottom"
      },
      popovers: {
        mode: "on",
        on: false,
        priority: "local",
        position: "top",
        centerOn: false,
        width: 300,
        maxWidth: 50,
        maxHeight: 50,
        resetViewboxOnClose: false,
        mobileFullscreen: false
      },
      gauge: {
        on: false,
        labels: {
          low: "low",
          high: "high"
        },
        colors: {
          lowRGB: {
            r: 211,
            g: 227,
            b: 245,
            a: 1
          },
          highRGB: {
            r: 67,
            g: 109,
            b: 154,
            a: 1
          },
          low: "#d3e3f5",
          high: "#436d9a",
          diffRGB: {
            r: -144,
            g: -118,
            b: -91,
            a: 0
          }
        },
        min: 0,
        max: false
      },
      source: "assets/images/maharashtra_districts_texts.svg",
      // source: "assets/images/divisionwise.svg",
      title: "Maharashtra-bg_o",
      responsive: true
    });
    // });
  }

  defaultFilterForm() {
    this.filterForm = this.fb.group({
      DistrictId: [0],
      TalukaId: [0],
      fromTo: [this.dateRange],
    })
  }

  getDistrict() {
    this.spinner.show();
    this.callAPIService.setHttp('get', 'Web_GetDistrict_1_0_HaveSocialMediaFilter?StateId=' + 1 + '&UserId=' + this.commonService.loggedInUserId(), false, false, false, 'ncpServiceForWeb');
    this.callAPIService.getHttp().subscribe((res: any) => {
      if (res.data == 0) {
        this.spinner.hide();
        this.allDistrict = res.data1;
        this.addClasscommitteeWise();
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
  addClasscommitteeWise() {
    $('.mapsvg-wrap path').addClass('notClicked');
    this.allDistrict.forEach((element:any) => {
      $('.mapsvg-wrap path[id="' + element.DistrictId + '"]').addClass('clicked'); 
    });
  }

  getTaluka(districtId: any) {
    this.getMostLikeHatedPerson();
     this.partyChangeEvent(1);
    this.spinner.show();
    this.callAPIService.setHttp('get', 'Web_GetTaluka_1_0?DistrictId=' + districtId, false, false, false, 'ncpServiceForWeb');
    this.callAPIService.getHttp().subscribe((res: any) => {
      if (res.data == 0) {
        this.spinner.hide();
        this.getTalkaByDistrict = res.data1;
      } else {
        this.spinner.hide();
        if (res.data == 1) {
          //this.toastrService.error("Data is not available");
        } else {
          this.toastrService.error("Please try again something went wrong");
        }
      }
    })
  }


  getweekRage(dates: any) {
    this.defaultCloseBtn = true;
    var Time = dates.value[1].getTime() - dates.value[0].getTime();
    var Days = Time / (1000 * 3600 * 24);

    if (Days <= 7) {
      // this.fromDate = this.datepipe.transform(dates.value[0], 'dd/MM/yyyy');
      // this.toDate = this.datepipe.transform(dates.value[1], 'dd/MM/yyyy');
      this.getMostLikeHatedPerson();
      this.partyChangeEvent(1);
    } else {
      this.toastrService.error("Please Select Date Only Week Range");
    }
  }
  filterData() {
    this.getMostLikeHatedPerson();
  }

  clearFilter(flag: any) {
    if (flag == 'district') {
      this.filterForm.controls['DistrictId'].setValue(0);
      // this.filterForm.controls['TalukaId'].setValue(0);
    } else if (flag == 'taluka') {
      this.filterForm.controls['TalukaId'].setValue(0);
    } else if (flag == 'Date') {
      this.defaultCloseBtn = false;
      this.filterForm.controls['fromTo'].setValue(this.dateRange1);
    }

    this.partyChangeEvent(1)
    this.getMostLikeHatedPerson();
    this.perceptionTrendWeb();
  }

  getMostLikeHatedPerson() {
    let fromDate: any;
    let toDate: any;
    this.filterForm.value.fromTo[0] != "" ? (fromDate = this.datepipe.transform(this.filterForm.value.fromTo[0], 'dd/MM/yyyy')) : fromDate = '';
    this.filterForm.value.fromTo[1] != "" ? (toDate = this.datepipe.transform(this.filterForm.value.fromTo[1], 'dd/MM/yyyy')) : toDate = '';
    this.spinner.show();
    this.callAPIService.setHttp('get', 'Dashboard_MostLikeHatedPerson_web_1_0?UserId=' + this.commonService.loggedInUserId() + '&FromDate=' + fromDate + '&ToDate=' + toDate + '&DistrictId=' + this.filterForm.value.DistrictId + '&TalukaId=' + this.filterForm.value.TalukaId, false, false, false, 'ncpServiceForWeb');
    this.callAPIService.getHttp().subscribe((res: any) => {
      if (res.data == 0) {
        this.spinner.hide();
        this.mostLikedPersonArray = res.data1;
        this.mostHatedPersonArray = res.data2;
        this.perceptionTrendWeb();
      } else {
        this.perceptionTrendWeb();
        if (res.data == 1) {
          this.spinner.hide();
          //this.toastrService.error("Data is not available");
          this.mostLikedPersonArray = [];
          this.mostHatedPersonArray = [];
        } else {
          this.spinner.hide();
          this.toastrService.error("Please try again something went wrong");
        }
      }
    })
  }

  perceptionTrendWeb() {
    let fromDate: any;
    let toDate: any;
    this.filterForm.value.fromTo[0] != "" ? (fromDate = this.datepipe.transform(this.filterForm.value.fromTo[0], 'dd/MM/yyyy')) : fromDate = '';
    this.filterForm.value.fromTo[1] != "" ? (toDate = this.datepipe.transform(this.filterForm.value.fromTo[1], 'dd/MM/yyyy')) : toDate = '';
    this.spinner.show();
    this.callAPIService.setHttp('get', 'Dashboard_PerceptionTrend_web_2_0?UserId=' + this.commonService.loggedInUserId() + '&FromDate=' + fromDate + '&ToDate=' + toDate + '&DistrictId=' + this.filterForm.value.DistrictId + '&TalukaId=' + this.filterForm.value.TalukaId, false, false, false, 'ncpServiceForWeb');
    this.callAPIService.getHttp().subscribe((res: any) => {
      if (res.data == 0) {

        this.perOnSocialMedArray = res.data2;

        this.trendOnSocialMediaArray = res.data1;


        this.trendOnSocialMediaArray.map((ele: any) => {
          if (ele.Date) {
            let DateFormate = this.changeDateFormat(ele.Date);
            let transformDate = this.datepipe.transform(DateFormate, 'MMM d');
            ele.Date = transformDate;
          }
        })
        this.trendSocialMediaLineChart();
        this.socialMediaChart();
        this.spinner.hide();
      } else {
        if (res.data == 1) {

          //this.toastrService.error("Data is not available");
          this.perOnSocialMedArray = [];
          this.trendOnSocialMediaArray = [];
          this.trendSocialMediaLineChart();
          this.socialMediaChart();
          this.spinner.hide();
        } else {
          this.spinner.hide();
          this.toastrService.error("Please try again something went wrong");
        }
      }
    })
  }

  changeDateFormat(date: string) {
    const dateParts = date.substring(0, 10).split("/");
    const ddMMYYYYDate = new Date(+dateParts[2], parseInt(dateParts[1]) - 1, +dateParts[0]);
    return ddMMYYYYDate;
  }

  getPoliticalParty() {
    this.callAPIService.setHttp('get', 'Web_GetPoliticalParty', false, false, false, 'ncpServiceForWeb');
    this.callAPIService.getHttp().subscribe((res: any) => {
      if (res.data == 0) {
        this.spinner.hide();
        this.resPoliticalParty = res.data1;
        this.mahaSVGMap();
      } else {
        this.spinner.hide();
        if (res.data == 1) {
          //this.toastrService.error("Data is not available");
        } else {
          this.toastrService.error("Please try again something went wrong");
        }
      }
    })
  }

  partyChangeEvent(getPartyId: any) {
    this.prevColorRemove(this.selPrevPartyId);
    this.selectedParty = getPartyId;
    this.selPrevPartyId = getPartyId;

    if (this.selectedParty == 1) {
      this.allowClearParty = false;
      this.selPrevPartyId = 1;
    } else {
      this.allowClearParty = true;
    }
    $('#map svg path').css('fill', '#7289da');
    this.mahaSVGMap();
  }



  mahaSVGMap() {
    debugger;
    let fromDate: any;
    let toDate: any;
    this.filterForm.value.fromTo[0] != "" ? (fromDate = this.datepipe.transform(this.filterForm.value.fromTo[0], 'dd/MM/yyyy')) : fromDate = '';
    this.filterForm.value.fromTo[1] != "" ? (toDate = this.datepipe.transform(this.filterForm.value.fromTo[1], 'dd/MM/yyyy')) : toDate = '';
    this.spinner.show();
    this.callAPIService.setHttp('get', 'Dashboard_PerceptionPartywise_web_2_0?UserId=' + this.commonService.loggedInUserId() + '&FromDate=' + fromDate + '&ToDate=' + toDate + '&DistrictId=' + this.filterForm.value.DistrictId + '&TalukaId=' + this.filterForm.value.TalukaId + '&PartyId=' + this.selectedParty, false, false, false, 'ncpServiceForWeb');
    this.callAPIService.getHttp().subscribe((res: any) => {
      if (res.data == 0) {
        this.resultofPartyData = res.data1;
        this.spinner.hide();
        this.resultofPartyData.map((ele: any) => {
          if (ele.ActivityCount > 0) {
            if (this.selectedParty == 1) {
              $('path[id="' + ele.Id + '"]').addClass('NCPColorCode');
            } else if (this.selectedParty == 2) {
              $('path[id="' + ele.Id + '"]').addClass('SSColorCode');
            } else if (this.selectedParty == 3) {
              $('path[id="' + ele.Id + '"]').addClass('BJPCode'); 
            } else if (this.selectedParty == 4) {
              $('path[id="' + ele.Id + '"]').addClass('INCColorCode');
            }else if (this.selectedParty == 5) {
              $('path[id="' + ele.Id + '"]').addClass('OTRColorCode');
            }
            $('#' + ele.DistrictName).text(ele.ActivityCount);
          }else{
              $('#' + ele.DistrictName).text(''); 
          }
          // $('#' + ele.DistrictName).text(ele.ActivityCount);
          // $('#mapsvg-menu-regions option[value="' + ele.DistrictName + '"]').css('fill', '#fff').prop('selected', true);
          // $('#mapsvg-menu-regions-marathi option[value="' + ele.DistrictName + '"]').css('fill', '#fff').prop('selected', true);
        })
      } else {
        this.spinner.hide();
        if (res.data == 1) {
          $("path").removeClass("NCPColorCode SSColorCode BJPCode INCColorCode OTRColorCode");
          //this.toastrService.error("Data is not available");
        } else {
          this.toastrService.error("Please try again something went wrong");
        }
      }
    })
  }

  prevColorRemove(selPrevPartyId:any) {
    if (selPrevPartyId == 1) {
      $('path').removeClass('NCPColorCode');
    } else if (selPrevPartyId == 2) {
      $('path').removeClass('SSColorCode');
    } else if (selPrevPartyId == 3) {
      $('path').removeClass('BJPCode'); 
    } else if (selPrevPartyId == 4) {
      $('path').removeClass('INCColorCode');
    }else if (selPrevPartyId == 5) {
      $('path').removeClass('OTRColorCode');
    }
  }
  
  socialMediaChart() {
    am4core.useTheme(am4themes_animated);
    // Themes end
    let chart = am4core.create("socialMediaChartdiv", am4charts.XYChart);
    chart.hiddenState.properties.opacity = 0; // this creates initial fade-in

    chart.data = this.perOnSocialMedArray;
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
    categoryAxis.title.text = "Party Name";


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

  trendSocialMediaLineChart() {
    // Themes begin
    am4core.useTheme(am4themes_animated);
    // Themes end

    // Create chart instance
    let chart = am4core.create("trendSocialMediaChart", am4charts.XYChart);

    // Add data
    chart.data = this.trendOnSocialMediaArray;

    chart.colors.list = [
      am4core.color("#80DEEA"),
      am4core.color("#FF8A65"),
      am4core.color("#E57373"),
      am4core.color("#7986CB"),
      am4core.color("#4DB6AC"),
    ];

    // Create category axis
    let categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = "Date";
    categoryAxis.renderer.minGridDistance = 20;
    categoryAxis.renderer.opposite = false;
    // categoryAxis.title.text = "X-Axis";

    // Create value axis
    let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.renderer.inversed = false;
    valueAxis.title.text = "% of followers";
    valueAxis.renderer.minLabelPosition = 0.01;

    // Create series
    let series1 = chart.series.push(new am4charts.LineSeries());
    series1.dataFields.valueY = "NCP";
    series1.dataFields.categoryX = "Date";
    series1.name = "NCP";
    series1.bullets.push(new am4charts.CircleBullet());
    series1.tooltipText = "Count: {valueY}";
    series1.legendSettings.valueText = "{valueY}";
    series1.visible = false;

    let series2 = chart.series.push(new am4charts.LineSeries());
    series2.dataFields.valueY = "SHIVSENA";
    series2.dataFields.categoryX = "Date";
    series2.name = 'SS';
    series2.bullets.push(new am4charts.CircleBullet());
    series2.tooltipText = "Count: {valueY}";
    series2.legendSettings.valueText = "{valueY}";

    let series3 = chart.series.push(new am4charts.LineSeries());
    series3.dataFields.valueY = "BJP";
    series3.dataFields.categoryX = "Date";
    series3.name = 'BJP';
    series3.bullets.push(new am4charts.CircleBullet());
    series3.tooltipText = "Count: {valueY}";
    series3.legendSettings.valueText = "{valueY}";

    let series4 = chart.series.push(new am4charts.LineSeries());
    series4.dataFields.valueY = "INC";
    series4.dataFields.categoryX = "Date";
    series4.name = 'INC';
    series4.bullets.push(new am4charts.CircleBullet());
    series4.tooltipText = "Count: {valueY}";
    series4.legendSettings.valueText = "{valueY}";

    let series5 = chart.series.push(new am4charts.LineSeries());
    series5.dataFields.valueY = "Other";
    series5.dataFields.categoryX = "Date";
    series5.name = 'OTR';
    series5.bullets.push(new am4charts.CircleBullet());
    series5.tooltipText = "Count: {valueY}";
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

      //Show Single Tooltip At a Time

   chart.cursor = new am4charts.XYCursor()
   chart.cursor.maxTooltipDistance = -1

  }

  ngOnDestroy() {
    this.graphInstance.destroy();
  }
}