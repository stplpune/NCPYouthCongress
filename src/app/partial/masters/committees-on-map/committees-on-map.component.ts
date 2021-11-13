import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { CallAPIService } from 'src/app/services/call-api.service';
import { CommonService } from 'src/app/services/common.service';
import { Location } from '@angular/common';
import { Subject } from 'rxjs';
declare var $: any
import { debounceTime } from 'rxjs/operators';
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import am4themes_material from "@amcharts/amcharts4/themes/material";
import { DateTimeAdapter } from 'ng-pick-datetime';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-committees-on-map',
  templateUrl: './committees-on-map.component.html',
  styleUrls: ['./committees-on-map.component.css', '../../partial.component.css']
})

export class CommitteesOnMapComponent implements OnInit, OnDestroy, AfterViewInit {

  resultCommittees: any;
  resultOrganizationMember: any;
  activeRow: any;
  selCommitteeName: any;
  districtName = "Maharashtra State";
  defaultCommitteesFlag: boolean = false;
  defaultMembersFlag: boolean = false;
  globalBodyId: any;
  defaultCloseBtn: boolean = false;
  allDistrict: any;
  selectedDistrictId: any;
  selDistrict = new FormControl();
  fromToDate = new FormControl();
  Search = new FormControl('');
  subject: Subject<any> = new Subject();
  searchFilter = "";
  DistrictId: any; //DistrictId fetch Work this Week Page
  fromDate: any = '';
  toDate: any = '';
  clearDataFlag: any;
  DistWiseCommityWGraphArray: any;
  graphInstance: any;
  loggedDistrictId: any;
  loggedUserTypeId: any;
  allowClear: boolean = true;
  allDistrictMaharashta: any;
  CommitteeId:any;
  committeeName:any;
  selCommiteeFlag:boolean = true;

  constructor(private commonService: CommonService, private toastrService: ToastrService,
    private spinner: NgxSpinnerService, private router: Router, private fb: FormBuilder, public datePipe: DatePipe,
    private route: ActivatedRoute, private callAPIService: CallAPIService, public location: Location
    , public dateTimeAdapter: DateTimeAdapter<any>) {
    { dateTimeAdapter.setLocale('en-IN'); }
    let getsessionStorageData: any = sessionStorage.getItem('DistrictIdWorkThisWeek');
    let DistrictId = JSON.parse(getsessionStorageData);
    this.DistrictId = DistrictId.DistrictId;
    this.CommitteeId = DistrictId.CommitteeId;
    this.committeeName = DistrictId.committeeName;
  }

  ngOnInit(): void {
    this.loggedUserTypeId = this.commonService.loggedInSubUserTypeId();
    this.selDistrictName();
    this.DistrictId ? this.getOrganizationByDistrictId(this.DistrictId) : this.getOrganizationByDistrictId(0);
    this.searchFilterByCommittee('false');
  }

  selDistrictName(){
    this.loggedUserTypeId == 5 ? this.districtName = this.commonService.getCommiteeInfo().CommiteeName : this.districtName = "Maharashtra State";
  }

  callSVGMap(){
    this.showSvgMap(this.commonService.mapRegions()); 
  }

  svgMapColorReset(){
    $('path').css('fill', '#7289da');
  }

  ngAfterViewInit() {
    this.callSVGMap() // default call SVG MAP
    this.DistrictId == "" || this.DistrictId ==  undefined ? this.DistrictId =  0 : this.DistrictId = this.DistrictId;
    this.selectDistrict(this.DistrictId);

    $(document).on('click', 'path', (e: any) => { // add on SVG Map
      let getClickedId = e.currentTarget;
      let distrctId = $(getClickedId).attr('id');
      this.toggleClassActive(Number(distrctId));
      this.getOrganizationByDistrictId(Number(distrctId));
    });
  }

  addClasscommitteeWise(id: any) {
    $('.mapsvg-wrap path').addClass('notClicked');
    this.allDistrict.forEach((element:any) => {
      $('.mapsvg-wrap path[id="' + element.DistrictId + '"]').addClass('clicked'); 
    });
  }

  toggleClassActive(distrctId:any){
    let checksvgDistrictActive = $('path').hasClass( "svgDistrictActive");   
    checksvgDistrictActive == true ?  ($('path').removeClass('svgDistrictActive'), $('path#' + distrctId).addClass('svgDistrictActive')):  $('path#' + distrctId).addClass('svgDistrictActive');;
  }

  ngOnDestroy() {
    sessionStorage.removeItem('DistrictIdWorkThisWeek');
    if (this.graphInstance) {
      this.graphInstance.destroy();
    }
  }

  selectDistrict(event: any) {
   // this.callSVGMap()
    this.selectedDistrictId = event;
    // this.clearFilterByCommittee();
    this.getOrganizationByDistrictId(this.selectedDistrictId);
    this.toggleClassActive(this.selectedDistrictId)
    // this.comActiveClass(0);  
  }

  getOrganizationByDistrictId(id: any) {
    this.spinner.show();
    this.callAPIService.setHttp('get', 'Sp_Web_GetOrganization_byDistrictId_2_0?UserId=' + this.commonService.loggedInUserId() + '&DistrictId=' + id + '&Search=' + this.searchFilter+'&FromDate=&ToDate=', false, false, false, 'ncpServiceForWeb');
    this.callAPIService.getHttp().subscribe((res: any) => {
      if (res.data == 0) {
        this.getDistrict(id)
        this.defaultCloseBtn = true;
        if (id == 0) {
          this.defaultCloseBtn = false;
        }
        this.defaultCommitteesFlag = true;
        this.spinner.hide();
        this.resultCommittees = res.data1;
        this.selDistrict.setValue(Number(id));
      } else {
        this.defaultCommitteesFlag = true;
        this.defaultCloseBtn = true;
        this.resultCommittees = [];
        this.selDistrict.setValue('');
        this.spinner.hide();
        this.selDistrict.setValue(Number(id));
      }

    }, (error: any) => {
      this.spinner.hide();
      if (error.status == 500) {
        this.router.navigate(['../500'], { relativeTo: this.route });
      }
    })
  }

  getDistrict(id: any) {
    // this.spinner.show();
    this.callAPIService.setHttp('get', 'Web_GetDistrict_1_0_CommitteeonMap?StateId=' + 1 + '&UserId=' + this.commonService.loggedInUserId(), false, false, false, 'ncpServiceForWeb'); //old API  Web_GetDistrict_1_0_Committee
    this.callAPIService.getHttp().subscribe((res: any) => {
      if (res.data == 0) {
        this.spinner.hide();
        this.allDistrict = res.data1;
        // if district id != 0  then show district name
        
        this.CommitteeId && this.loggedUserTypeId == 5 && this.selCommiteeFlag ? this.committeeNameByOrganizationMember(this.CommitteeId, this.committeeName) : '';

        if(id != 0 ){
          this.allDistrict.find((ele: any) => {
              if (ele.DistrictId == id) {
                this.districtName = ele.DistrictName;
              }
            });
        }
        this.districtWiseCommityWorkGraph(id);
        this.addClasscommitteeWise(id);
        $('path#' + this.selectedDistrictId).addClass('svgDistrictActive');
      } 
    }, (error: any) => {
      if (error.status == 500) {
        this.router.navigate(['../../500'], { relativeTo: this.route });
      }
    })
  }

  committeeNameByOrganizationMember(bodyId: any, committeeName: any) {
    this.spinner.show();
    this.globalBodyId = bodyId;
    this.activeRow = bodyId
    this.callAPIService.setHttp('get', 'Web_GetOrganizationMember_byBodyId_1_0?UserId=' + this.commonService.loggedInUserId() + '&BodyId=' + bodyId, false, false, false, 'ncpServiceForWeb');
    this.callAPIService.getHttp().subscribe((res: any) => {
      if (res.data == 0) {
        this.comActiveClass(1)
        this.spinner.hide();
        this.selCommitteeName = committeeName;
        this.resultOrganizationMember = res.data1;
      } else {
        this.comActiveClass(1)
        this.resultOrganizationMember = [];
        this.selCommitteeName = committeeName;
        this.spinner.hide();
      }
    }, (error: any) => {
      this.spinner.hide();
      if (error.status == 500) {
        this.router.navigate(['../500'], { relativeTo: this.route });
      }
    })
  }

  redirectOrgDetails() {

  }

  redToMemberProfile(memberId: any, FullName: any) {
  }

  comActiveClass(flag:any){ // 0 - false 1 - true
    flag == 0 ? this.defaultMembersFlag = false : this.defaultMembersFlag = true;
    this.selCommiteeFlag = false;
    
  }
  // --------------------------------------- filter start here ----------------------------------------------- //

  clearFilter(flag: any) {
    if (flag == 'CommitteesIn') {
      this.selDistrict.reset();
      this.selDistrictName();
      this.defaultCloseBtn = false;
      // this.removeSessionData();
      this.toggleClassActive(0);
    }else if (flag == 'dateRangePIcker'){
      this.clearDateRangeByFilter();
    }
    this.comActiveClass(0);
    this.activeRow = 0;
    // this.showSvgMap(this.commonService.mapRegions());
    this.getOrganizationByDistrictId(0);

  }

  removeSessionData(){
    sessionStorage.setItem('DistrictIdWorkThisWeek','');
  }


  selDateRangeByFilter(getDate: any) {
    this.comActiveClass(0);
    this.fromDate = this.datePipe.transform(getDate[0], 'dd/MM/yyyy');
    this.toDate = this.datePipe.transform(getDate[1], 'dd/MM/yyyy');
    this.districtWiseCommityWorkGraph(0);
  }

  clearDateRangeByFilter(){
    this.fromToDate.setValue('');
    this.fromDate = '';
    this.toDate = '';
    
  }
 

  filterByCommittee() {
    this.subject.next();
  }

  searchFilterByCommittee(flag: any) {
    if (flag == 'true') {
      if (this.Search.value == "" || this.Search.value == null) {
        this.toastrService.error("Please search and try again");
        return
      }
    }
    this.subject
      .pipe(debounceTime(700))
      .subscribe(() => {
        this.searchFilter = this.Search.value;
        this.selDistrictName();
        this.getOrganizationByDistrictId(0);
        this.toggleClassActive(0);
        this.districtWiseCommityWorkGraph(0);
        
      });
  }

  clearFilterByCommittee() {
    this.Search.reset('');
    this.searchFilter = "";
    this.selDistrict.reset();
    this.selDistrictName();
    this.getOrganizationByDistrictId(0);
    this.districtWiseCommityWorkGraph(0);
    this.defaultCloseBtn = false;
    // this.svgMapColorReset();
    this.toggleClassActive(0);
  }

  // --------------------------------------- Comparison of Committees chart start here ----------------------------------------------- //
  districtWiseCommityWorkGraph(id: any) {
    this.spinner.show();
    let globalDistrictId = this.selectedDistrictId || id;
    let obj = this.commonService.loggedInUserId() + '&DistrictId=' + globalDistrictId + '&FromDate=' + this.fromDate + '&ToDate=' + this.toDate + '&Search=' + this.Search.value;
    this.callAPIService.setHttp('get', 'Web_DistrictWiseCommitteeWorkGraph?UserId=' + obj, false, false, false, 'ncpServiceForWeb');
    this.callAPIService.getHttp().subscribe((res: any) => {
      if (res.data == 0) {
        this.spinner.hide();
        this.DistWiseCommityWGraphArray = res.data1;
        this.WorkDoneByYuvak();
      } else {
        this.DistWiseCommityWGraphArray = [];
        this.WorkDoneByYuvak();
        this.spinner.hide();
      }
    }, (error: any) => {
      this.spinner.hide();
      if (error.status == 500) {
        this.router.navigate(['../500'], { relativeTo: this.route });
      }
    })
  }

  WorkDoneByYuvak() {
    am4core.ready(() => {
      am4core.useTheme(am4themes_animated);
      am4core.useTheme(am4themes_material);
      let chart = am4core.create('WorkDoneByYuvak1', am4charts.XYChart)
      chart.responsive.enabled = true;

      chart.colors.list = [
        // am4core.color("#515ee6"),
        // am4core.color("#515ee6"),
        am4core.color("#b959e0"),
        am4core.color("#b959e0"),
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
      xAxis.dataFields.category = 'BodyOrgCellName'
      xAxis.title.text = "Committes Name";
      xAxis.renderer.cellStartLocation = 0.1
      xAxis.renderer.cellEndLocation = 0.9
      xAxis.renderer.grid.template.location = 0;
      xAxis.renderer.labels.template.rotation = -90;
      xAxis.renderer.minGridDistance = 30;
      //chart.scrollbarX = new am4core.Scrollbar();

      let label = xAxis.renderer.labels.template;
      // label.truncate = true;
      // label.maxWidth = 120;
      label.tooltipText = "{category}";

      function createSeries(value: string | undefined, name: string) {
        let series = chart.series.push(new am4charts.ColumnSeries())
        series.dataFields.valueY = value
        series.dataFields.categoryX = 'BodyOrgCellName'
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

      chart.data = this.DistWiseCommityWGraphArray;
      chart.padding(10, 5, 5, 5);
      // createSeries('TotalWork', 'Work Done by Committees');
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
  }

  // --------------------------------------- Maharashtra SVG MAP ----------------------------------------------- //

  showSvgMap(regions_m: any) {
    if (this.graphInstance) {
      this.graphInstance.destroy();
    }
    this.graphInstance = $("#mapsvg1").mapSvg({
      width: 550,
      height: 430,
      colors: {
        baseDefault: "#bfddff",
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
      title: "Maharashtra-bg_o",
      responsive: true
    });
  }
}

