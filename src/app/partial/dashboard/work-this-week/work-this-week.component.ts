import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { CallAPIService } from 'src/app/services/call-api.service';
import { CommonService } from 'src/app/services/common.service';
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import am4themes_material from "@amcharts/amcharts4/themes/material";
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { DatePipe, Location } from '@angular/common';
import { DateTimeAdapter } from 'ng-pick-datetime';
declare var $: any

@Component({
  selector: 'app-work-this-week',
  templateUrl: './work-this-week.component.html',
  styleUrls: ['./work-this-week.component.css', '../../partial.component.css'],
  providers: [DatePipe]
})
export class WorkThisWeekComponent implements OnInit, OnDestroy, AfterViewInit {
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
  topFilterForm!: FormGroup;
  toDate: any;
  fromDate: any;
  catValue: any;
  bestPerCat = [{'id':1,'name':"Committee"},{'id':0,'name':"Location"}];
  bestWorstArray = [{'id':0,'name':"Worst"}, {'id':1,'name':"Best"}];
  defultCategoryName:any = 1;
  resWorkcategory:any;
  dateRange:any;
  dateRange1:any;
  defaultCloseBtn: boolean = false;
  resultBestPerKaryMember:any;
  memberNameArray:any;
  regions_m:any;
  isBestworst = 1;
  savgMapArray:any;
  svgMapWorkDoneByYuvakBP:any;
  svgMapWorkDoneByYuvakTp:any;
  
  constructor(private callAPIService: CallAPIService, private spinner: NgxSpinnerService,
    private toastrService: ToastrService, private commonService: CommonService, private router: Router, private fb: FormBuilder,
    public datepipe: DatePipe, private route: ActivatedRoute,
    public location: Location,  public dateTimeAdapter: DateTimeAdapter<any>) {
   {dateTimeAdapter.setLocale('en-IN');} 
    let data: any = localStorage.getItem('weekRange');
    this.selweekRange = JSON.parse(data);
    this.dateRange1 = [this.selweekRange.fromDate, this.selweekRange.toDate];
    this.dateRange = [this.selweekRange.fromDate, this.selweekRange.toDate];
  }

  ngOnInit(): void {
    this.getWorkcategoryFilterDetails();
    this. defaultFilterForm();
    this.defaultFilterBestPer();
    this.geWeekReport()
    this.getDistrict();

    this.getBestPerKaryMember();
    this.bestPerformance();
    this.regions_m = {
      'path3109': {
          id: "1",
          tooltip: "पुणे",
          data: {}
      },
      'path3121': {
          id: "2",
          tooltip: "सांगली",
          data: {}
      },
      'path3117': {
          id: "3",
          tooltip: "सातारा",
          data: {}
      },
      'path3193': {
          id: "5",
          tooltip: "परभणी",
          data: {}
      },
      'path3209': {
          id: "6",
          tooltip: "यवतमाळ",
          data: {}
      },
      'path3113': {
          id: "7",
          tooltip: "सोलापूर",
          data: {}
      },
      'path3157': {
          id: "8",
          tooltip: "अहमदनगर",
          data: {}
      },
      'path3125': {
          id: "9",
          tooltip: "कोल्हापूर",
          data: {}
      },
      'path3169': {
          id: "10",
          tooltip: "औरंगाबाद",
          data: {}
      },
      'path3181': {
          id: "11",
          tooltip: "बीड",
          data: {}
      },
      'path3197': {
          id: "12",
          tooltip: "हिंगोली",
          data: {}
      },
      'path3173': {
          id: "13",
          tooltip: "जालना",
          data: {}
      },
      'path3185': {
          id: "14",
          tooltip: "लातूर",
          data: {}
      },
      'path3177': {
          id: "15",
          tooltip: "नांदेड",
          data: {}
      },
      'path3189': {
          id: "16",
          tooltip: "उस्मानाबाद",
          data: {}
      },
      'path3213': {
          id: "17",
          tooltip: "अकोला",
          data: {}
      },
      'path3201': {
          id: "18",
          tooltip: "अमरावती",
          data: {}
      },
      'path3205': {
          id: "19",
          tooltip: "बुलडाणा",
          data: {}
      },
      'path3217': {
          id: "20",
          tooltip: "वाशिम",
          data: {}
      },
      'path3165': {
          id: "21",
          tooltip: "धुळे",
          data: {}
      },
      'path3149': {
          id: "22",
          tooltip: "जळगाव",
          data: {}
      },
      'path3161': {
          id: "23",
          tooltip: "नंदुरबार",
          data: {}
      },
      'path3153': {
          id: "24",
          tooltip: "नाशिक",
          data: {}
      },
      'path3237': {
          id: "25",
          tooltip: "भंडारा",
          data: {}
      },
      'path3233': {
          id: "26",
          tooltip: "चंद्रपूर",
          data: {}
      },
      'path3229': {
          id: "27",
          tooltip: "गडचिरोली",
          data: {}
      },
      'path3241': {
          id: "28",
          tooltip: "गोंदिया",
          data: {}
      },
      'path3221': {
          id: "29",
          tooltip: "नागपूर",
          data: {}
      },
      'path3225': {
          id: "30",
          tooltip: "वर्धा",
          data: {}
      },
      'path3129': {
          id: "31",
          tooltip: "मुंबई उपनगर",
          data: {}
      },
      'path3137': {
          id: "32",
          tooltip: "रायगड",
          data: {}
      },
      'path3133': {
          id: "33",
          tooltip: "रत्नागिरी",
          data: {}
      },
      'path3141': {
          id: "34",
          tooltip: "सिंधुदुर्ग",
          data: {}
      },
      'path1022': {
          id: "35",
          tooltip: "ठाणे",
          data: {}
      },
      'path1026': {
          id: "36",
          tooltip: "मुंबई शहर",
          data: {}
      },
      'path3145': {
          id: "37",
          tooltip: "पालघर",
          data: {}
      },
  }
  }

  ngAfterViewInit(){
    setTimeout(() => {
      this.showSvgMap(this.regions_m)
    }, 1000);
  }

  showSvgMap(regions_m:any) {
    $(document).ready(function () {
      $("#mapsvg").mapSvg({
        width: 763.614,
        height: 599.92,
        colors: {
          baseDefault: "#bfddff",
          background: "#fff",
          selected: "#6365AE",
          hover: "#6365AE",
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
          position: "top"
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
        source: "assets/images/maharashtra_districts_map.svg",
        // source: "assets/images/divisionwise.svg",
        title: "Maharashtra-bg_o",
        responsive: true
      });
    });
  }



  filterData(flag:any){
    if (flag == 'district') {
      this.getTaluka(this.filterBestPer.value.DistrictId)
    }else if (flag == 'workType'){
      // this.bestPerformance();
      this.getBestPerKaryMember();
      this.geWeekReport();
    }
    // district talka committee
    this.bestPerformance();
  }

  getweekRage(event:any){
    this.defaultCloseBtn = true;
    this.bestPerformance();
    this.getBestPerKaryMember();
    this.geWeekReport();
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
        this.toastrService.error("Data is not available");
      }
    }, (error: any) => {
      this.spinner.hide();
      if (error.status == 500) {
        this.router.navigate(['../../500'], { relativeTo: this.route });
      }
    });
  }

  getTaluka(districtId: any) {
    this.spinner.show();
    this.filterObj.globalDistrictId = districtId;
    this.callAPIService.setHttp('get', 'Web_GetTaluka_1_0?DistrictId=' + districtId, false, false, false, 'ncpServiceForWeb');
    this.callAPIService.getHttp().subscribe((res: any) => {
      if (res.data == 0) {
        this.spinner.hide();
        this.getTalkaByDistrict = res.data1;
      } else {
        this.spinner.hide();
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


  getWorkcategoryFilterDetails() {
    this.spinner.show();
    this.callAPIService.setHttp('get', 'Web_Workcategory_1_0', false, false, false, 'ncpServiceForWeb');
    this.callAPIService.getHttp().subscribe((res: any) => {
      if (res.data == 0) {
        this.spinner.hide();
        this.resWorkcategory = res.data1;
      } else {
        this.spinner.hide();
        this.toastrService.error("Member is not available");
      }
    }, (error: any) => {
      this.spinner.hide();
      if (error.status == 500) {
        this.router.navigate(['../../500'], { relativeTo: this.route });
      }
    })
  }

  defaultFilterBestPer() {
    this.filterBestPer = this.fb.group({
      DistrictId: [0],
      TalukaId: [0],
      VillageId: [0],
      IsBody: [0],
      BodyId: [0],
    })
  }

  defaultFilterForm() {
    this.topFilterForm = this.fb.group({
      category: [0],
      fromTo: [this.dateRange],
    })
  }

  clearFilter(flag:any){
    if (flag == 'workType') {
      this.topFilterForm.controls['category'].setValue(0);
      this.getBestPerKaryMember();
      this.geWeekReport();
    } else if (flag == 'dateValue') {
      console.log(this.savgMapArray);
      this.defaultCloseBtn = false;
      this.topFilterForm.controls['fromTo'].setValue(this.dateRange1);
      this.savgMapArray = [];
      this.getBestPerKaryMember();
      this.geWeekReport();
    }  else if (flag == 'district') {
      this.filterBestPer.controls['DistrictId'].setValue(0);
      this.filterBestPer.controls['TalukaId'].setValue(0);
    } else if (flag == 'taluka') {
      this.filterBestPer.controls['TalukaId'].setValue(0);
    }  else if (flag == 'committee') {
      this.filterBestPer.controls['BodyId'].setValue(0);
      this.filterBestPer.controls['IsBody'].setValue(1);
    } 
    this.bestPerformance();
  }

  committee() {
    this.bestPerformance();
  }

  getBestPerKaryMember() {
    this.spinner.show();
    let topFilterValue = this.topFilterForm.value;
    this.callAPIService.setHttp('get', 'DashboardData_BestPerformance_web_1_0?UserId=' + this.commonService.loggedInUserId() +  '&FromDate=' + this.datepipe.transform(topFilterValue.fromTo[0], 'dd/MM/yyyy') + '&ToDate=' + this.datepipe.transform(topFilterValue.fromTo[1],
       'dd/MM/yyyy')+ '&CategoryId=' + topFilterValue.category + '&IsBest=' + this.isBestworst, false, false, false, 'ncpServiceForWeb');
    this.callAPIService.getHttp().subscribe((res: any) => {
      if (res.data == 0) {
        console.log(res);
        this.spinner.hide();
        this.resBestPerKaryMember = res.data1;
      } else {
        this.resBestPerKaryMember = [];
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
  geWeekReport() {
    this.spinner.show();
    let topFilterValue = this.topFilterForm.value
    // let fromDate: any;
    // let toDate: any;
    // topFilterValue.fromTo[0] != "" ? (fromDate = this.datepipe.transform(topFilterValue.fromTo[0], 'dd/MM/yyyy')) : fromDate = '';
    // topFilterValue.fromTo[1] != "" ? (toDate = this.datepipe.transform(topFilterValue.fromTo[1], 'dd/MM/yyyy')) : toDate = '';
    this.spinner.show();

    this.callAPIService.setHttp('get', 'DashboardData_Week_web_1_0?UserId=' + this.commonService.loggedInUserId() +  '&FromDate=' + this.datepipe.transform(topFilterValue.fromTo[0], 'dd/MM/yyyy') + '&ToDate=' + this.datepipe.transform(topFilterValue.fromTo[1], 'dd/MM/yyyy') + '&CategoryId=' + topFilterValue.category, false, false, false, 'ncpServiceForWeb');
    this.callAPIService.getHttp().subscribe((res: any) => {
      if (res.data == 0) {
        this.WorkDoneByYuvakTP = res.data1;
        this.WorkDoneByYuvakBP = res.data2;
        this.WorkDoneByYuvakBarchart = res.data3;
        console.log(this.WorkDoneByYuvakTP);
        this.WorkDoneByYuvak();
        this.spinner.hide();
      } else {
        this.WorkDoneByYuvakTP = [];
        this.WorkDoneByYuvakBP = [];
        this.WorkDoneByYuvakBarchart = [];
        this.WorkDoneByYuvak();
        this.spinner.hide();
        if (res.data == 1) {
          this.toastrService.error("Data is not available");
        } else {
          this.toastrService.error("Please try again something went wrong");
        }
      }
    })
  }


  bestPerformance() {
    this.spinner.show();
    let topFilterValue = this.topFilterForm.value;
    let filter = this.filterBestPer.value;
    // let fromDate: any;
    // let toDate: any;
    // topFilterValue.fromTo[0] != "" ? (fromDate = this.datepipe.transform(this.commonService.dateFormatChange(topFilterValue.fromTo[0]), 'dd/MM/yyyy')) : fromDate = '';
    // topFilterValue.fromTo[1] != "" ? (toDate = this.datepipe.transform(this.commonService.dateFormatChange(topFilterValue.fromTo[1]), 'dd/MM/yyyy')) : toDate = '';
    this.callAPIService.setHttp('get', 'DashboardData_BestPerformance_Filter_web_2_0?UserId=' + this.commonService.loggedInUserId() + '&FromDate=' + this.datepipe.transform(topFilterValue.fromTo[0], 'dd/MM/yyyy') + '&ToDate=' + this.datepipe.transform(topFilterValue.fromTo[1], 'dd/MM/yyyy')  +'&DistrictId='+filter.DistrictId+'&TalukaId='+filter.TalukaId+ '&IsBody=' + filter.IsBody +'&BodyId=' + filter.BodyId , false, false, false, 'ncpServiceForWeb');
    // this.callAPIService.setHttp('get', 'DashboardData_BestPerformance_Filter_web_2_0?UserId=' + this.commonService.loggedInUserId() + '&FromDate=' + fromDate + '&ToDate=' + toDate +'&DistrictId='+filter.DistrictId+'&TalukaId='+filter.TalukaId+ '&IsBody=' + filter.IsBody +'&BodyId=' + filter.DistrictId , false, false, false, 'ncpServiceForWeb');
    this.callAPIService.getHttp().subscribe((res: any) => {
      if (res.data == 0) {
        this.resultBestPerKaryMember =  res.data1;
        console.log(this.resultBestPerKaryMember);
        // this.WorkDoneByYuvak();
        this.spinner.hide();
      } else {
        this.resultBestPerKaryMember =  [];
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
  WorkDoneByYuvak() {
 

    am4core.ready(() => {
      am4core.useTheme(am4themes_animated);
      am4core.useTheme(am4themes_material);
      let chart = am4core.create('WorkDoneByYuvak', am4charts.XYChart)
      chart.colors.list = [
        am4core.color("#ABEBC6"),
        am4core.color("#ABEBC6"),
        am4core.color("#D2B4DE"),
        am4core.color("#D2B4DE"),
      ];
      chart.colors.step = 2;

      chart.legend = new am4charts.Legend()
      chart.legend.position = 'top'
      chart.legend.paddingBottom = 10
      chart.legend.labels.template.maxWidth = 20

      let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
      valueAxis.min = 0;
      valueAxis.title.text = "Committes Work Done Count";

      let xAxis = chart.xAxes.push(new am4charts.CategoryAxis())
      xAxis.dataFields.category = 'DistrictName'
      xAxis.title.text = "District Name";
      xAxis.renderer.cellStartLocation = 0.1
      xAxis.renderer.cellEndLocation = 0.9
      xAxis.renderer.grid.template.location = 0;
// xAxis.renderer.labels.template.rotation = -45;
xAxis.renderer.minGridDistance = 30;

      function createSeries(value: string | undefined, name: string) {
        let series = chart.series.push(new am4charts.ColumnSeries())
        series.dataFields.valueY = value
        series.dataFields.categoryX = 'DistrictName'
        series.name = name

        series.events.on("hidden", arrangeColumns);
        series.events.on("shown", arrangeColumns);

        let bullet = series.bullets.push(new am4charts.LabelBullet())
        bullet.interactionsEnabled = false
        bullet.dy = 30;
        bullet.label.text = '{valueY}'
        bullet.label.fill = am4core.color('#ffffff')

        return series;
      }

      chart.data = this.WorkDoneByYuvakBarchart;

      chart.padding(10, 5, 5, 5);
      createSeries('MemberWork', 'Work Done by Committes');
      createSeries('TotalWork', 'Total Work Done');

      function arrangeColumns() {

        var series: any = chart.series.getIndex(0);

        let w = 1 - xAxis.renderer.cellStartLocation - (1 - xAxis.renderer.cellEndLocation);
        if (series.dataItems.length > 1) {
          let x0 = xAxis.getX(series.dataItems.getIndex(0), "categoryX");
          let x1 = xAxis.getX(series.dataItems.getIndex(1), "categoryX");
          let delta = ((x1 - x0) / chart.series.length) * w;
          if (am4core.isNumber(delta)) {
            let middle = chart.series.length / 2;

            let newIndex = 0;
            chart.series.each(function (series) {
              if (!series.isHidden && !series.isHiding) {
                series.dummyData = newIndex;
                newIndex++;
              }
              else {
                series.dummyData = chart.series.indexOf(series);
              }
            })
            let visibleCount = newIndex;
            let newMiddle = visibleCount / 2;

            chart.series.each(function (series) {
              let trueIndex = chart.series.indexOf(series);
              let newIndex = series.dummyData;

              let dx = (newIndex - trueIndex + middle - newMiddle) * delta

              series.animate({ property: "dx", to: dx }, series.interpolationDuration, series.interpolationEasing);
              series.bulletsContainer.animate({ property: "dx", to: dx }, series.interpolationDuration, series.interpolationEasing);
            })
          }
        }
      }
    });
    this.svgMapWorkDoneByYuvakTp= this.WorkDoneByYuvakTP;
    this.svgMapWorkDoneByYuvakBP = this.WorkDoneByYuvakBP;
    this.mahaSVGMap();
  }
  mahaSVGMap(){
    debugger;
    if(this.svgMapWorkDoneByYuvakTp.length != 0){
      this.svgMapWorkDoneByYuvakTp.map((ele:any)=>{
        $('path[id="' + ele.DistrictId + '"]').css('fill', '#d1e7dd');
        $('#mapsvg-menu-regions option[value="' + ele.DistrictId + '"]').prop('selected', true);
        $('#mapsvg-menu-regions-marathi option[value="' + ele.DistrictId + '"]').prop('selected', true);
      })
    }else{
      $('path').css('fill', '#a5caf3');
    }
    

    this.svgMapWorkDoneByYuvakBP.map((ele:any)=>{
      $("#divId1count").text("33")
      $('path[id="' + ele.DistrictId + '"]').css('fill', '#f8d7da');
        $('#mapsvg-menu-regions option[value="' + ele.DistrictId + '"]').prop('selected', true);
        $('#mapsvg-menu-regions-marathi option[value="' + ele.DistrictId + '"]').prop('selected', true);
      })
  }

  catChange(value: any) {
    this.catValue = value.name;
    if(this.catValue == 'Committee'){
      this.filterBestPer.controls['DistrictId'].setValue(0);
      this.filterBestPer.controls['TalukaId'].setValue(0);
      this.getMemberName();
    }else{
      this.filterBestPer.controls['BodyId'].setValue(0);
      this.filterBestPer.controls['IsBody'].setValue(0);
    }
    this.bestPerformance();
  }

  bestWorstPer(value: any) {
     this.isBestworst=value.id;
     this.getBestPerKaryMember();
  }

  ngOnDestroy() {
    // localStorage.removeItem('weekRange');
  }

  redirectOrgDetails(bodyId: any,  BodyOrgCellName:any) {
      let obj = {bodyId:bodyId, BodyOrgCellName:BodyOrgCellName}
      localStorage.setItem('bodyId', JSON.stringify(obj))
      this.router.navigate(['../../master/organization/details'], { relativeTo: this.route })
  }

  redToMemberProfile(memberId:any,FullName:any){
    let obj = {'memberId':memberId, 'FullName':FullName}
    localStorage.setItem('memberId', JSON.stringify(obj));
    this.router.navigate(['../../member/profile'], {relativeTo:this.route})
  }

  getMemberName() {
    this.spinner.show();
    this.callAPIService.setHttp('get', 'Web_GetBodyOrgCellName_1_0?', false, false, false, 'ncpServiceForWeb');
    this.callAPIService.getHttp().subscribe((res: any) => {
      if (res.data == 0) {
        this.spinner.hide();
        this.memberNameArray = res.data1;
        console.log(this.memberNameArray)
      } else {
        this.spinner.hide();
          this.toastrService.error("Data is not available");
      }
    } ,(error:any) => {
      this.spinner.hide();
      if (error.status == 500) {
        this.router.navigate(['../../500'], { relativeTo: this.route });
      }
    })
  }
}

