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
  fromToDate = new FormControl(['', '']);
  Search = new FormControl();
  subject: Subject<any> = new Subject();
  searchFilter = "";
  DistrictId: any; //DistrictId fetch Work this Week Page
  fromDate: any = '';
  toDate: any = '';
  clearDataFlag: any;
  DistWiseCommityWGraphArray: any;
  graphInstance: any;

  constructor(private commonService: CommonService, private toastrService: ToastrService,
    private spinner: NgxSpinnerService, private router: Router, private fb: FormBuilder, public datePipe: DatePipe,
    private route: ActivatedRoute, private callAPIService: CallAPIService, public location: Location
    , public dateTimeAdapter: DateTimeAdapter<any>) {
    { dateTimeAdapter.setLocale('en-IN'); }
    let getsessionStorageData: any = sessionStorage.getItem('DistrictIdWorkThisWeek');
    let DistrictId = JSON.parse(getsessionStorageData);
    this.DistrictId = DistrictId;

  }

  ngOnInit(): void {
    this.getOrganizationByDistrictId(0);
    this.searchFilters('false');
    this.DistrictWiseCommityWorkGraph();

  }

  clearFilter(flag: any) {
    this.clearDataFlag = flag;
    if (flag == 'dateRangePIcker') {
      this.fromToDate.setValue(['', '']);
      this.fromDate = '';
      this.toDate = '';
      this.defaultCloseBtn = false;
      this.DistrictWiseCommityWorkGraph();
    } else if (flag == 'CommitteesIn') {
      this.districtName = "Maharashtra State";
      this.showSvgMap(this.commonService.mapRegions());
      this.defaultMembersFlag = false;
      this.selectedDistrictId = "";
      this.selDistrict.reset();
      this.getOrganizationByDistrictId(0);
      this.defaultCloseBtn = false;
      this.DistrictWiseCommityWorkGraph();
    }
  };

  ngAfterViewInit() {
    // this.showSvgMap(this.commonService.mapRegions());
    if (this.DistrictId) {
      this.selectDistrict(this.DistrictId);
      this.showSvgMap(this.commonService.mapRegions());
    }else{
      this.showSvgMap(this.commonService.mapRegions());
    }

    $(document).on('click', 'path', (e: any) => {
      $('path#' + this.selectedDistrictId).css('fill', '#7289da');
      let getClickedId = e.currentTarget;
      let distrctId = $(getClickedId).attr('id');
      this.getOrganizationByDistrictId(distrctId);
    });
  }

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
        selected: "#272848",
        hover: "#272848",
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

  getOrganizationByDistrictId(id: any) {
    this.getDistrict(id)
    this.spinner.show();
    this.callAPIService.setHttp('get', 'Sp_Web_GetOrganization_byDistrictId_2_0?UserId=' + this.commonService.loggedInUserId() + '&DistrictId=' + id + '&Search=' + this.searchFilter, false, false, false, 'ncpServiceForWeb');
    this.callAPIService.getHttp().subscribe((res: any) => {
      if (res.data == 0) {
        this.defaultCloseBtn = true;
        if (id == 0) {
          this.defaultCloseBtn = false;
        }
        this.defaultCommitteesFlag = true;
        this.spinner.hide();
        this.resultCommittees = res.data1;
        this.selDistrict.setValue(Number(id));
      } else {
        this.defaultMembersFlag = false;
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

  selectDistrict(event: any) {
    //this.clearFilterByCommitteesName();
    $('path').css('fill', '#7289da');
    this.selectedDistrictId = event;
    this.DistrictWiseCommityWorkGraph();
    $('path#' + this.selectedDistrictId).css('fill', 'rgb(39 40 72)');
    this.getOrganizationByDistrictId(this.selectedDistrictId);
    this.defaultMembersFlag = false;
  }

  getDistrict(id: any) {
    this.callAPIService.setHttp('get', 'Web_GetDistrict_1_0?StateId=' + 1, false, false, false, 'ncpServiceForWeb');
    this.callAPIService.getHttp().subscribe((res: any) => {
      if (res.data == 0) {
        this.spinner.hide();
        this.allDistrict = res.data1;
        res.data1.find((ele: any) => {
          if (ele.DistrictId == id) {
            this.districtName = ele.DistrictName;
          }
        })
      } else {
        // this.toastrService.error("Data is not available 2");
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
        this.defaultMembersFlag = true;
        this.spinner.hide();
        this.selCommitteeName = committeeName;
        this.resultOrganizationMember = res.data1;
      } else {
        this.defaultMembersFlag = true;
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




  redToMemberProfile(memberId: any, FullName: any) {
    let obj = { 'memberId': memberId, 'FullName': FullName }
    sessionStorage.setItem('memberId', JSON.stringify(obj));
    this.router.navigate(['../../profile'])
  }

  redirectOrgDetails() {
    let obj = { bodyId: this.globalBodyId, BodyOrgCellName: this.selCommitteeName }
    sessionStorage.setItem('bodyId', JSON.stringify(obj))
    this.router.navigate(['../committee/details'], { relativeTo: this.route })
  }


  onKeyUpFilter() {
    this.subject.next();
  }

  searchFilters(flag: any) {
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
        this.getOrganizationByDistrictId(0);
      }
      );
  }
  clearFilterByCommitteesName() {
    this.searchFilter = "";
    this.Search.reset();
    this.getOrganizationByDistrictId(0);
  }

  selDateRangeByFilter(getDate: any) {
    this.defaultCloseBtn = true;
    this.fromDate = this.datePipe.transform(getDate[0], 'dd/MM/yyyy');
    this.toDate = this.datePipe.transform(getDate[1], 'dd/MM/yyyy');
    this.DistrictWiseCommityWorkGraph();
  }

  DistrictWiseCommityWorkGraph() {
    this.spinner.show();
    let globalDistrictId = this.selectedDistrictId || 0;
    let obj = this.commonService.loggedInUserId() + '&DistrictId=' + globalDistrictId + '&FromDate=' + this.fromDate + '&ToDate=' + this.toDate;
    this.callAPIService.setHttp('get', 'Web_DistrictWiseCommitteeWorkGraph?UserId=' + obj, false, false, false, 'ncpServiceForWeb');
    this.callAPIService.getHttp().subscribe((res: any) => {
      if (res.data == 0) {
        this.spinner.hide();
        this.DistWiseCommityWGraphArray = res.data1;
        this.WorkDoneByYuvak();
      } else {
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
      let chart = am4core.create('WorkDoneByYuvak', am4charts.XYChart)
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
      // xAxis.renderer.labels.template.rotation = -45;
      xAxis.renderer.minGridDistance = 30;

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
    //this.mahaSVGMap();
  }

  ngOnDestroy() {
    // sessionStorage.removeItem('weekRange');
    sessionStorage.removeItem('DistrictIdWorkThisWeek');
    if (this.graphInstance) {
      this.graphInstance.destroy();
    }
  }
}
