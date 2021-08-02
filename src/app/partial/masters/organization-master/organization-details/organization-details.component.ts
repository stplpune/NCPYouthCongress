import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { CallAPIService } from 'src/app/services/call-api.service';
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import { CommonService } from 'src/app/services/common.service';
import { DateTimeAdapter } from 'ng-pick-datetime';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-organization-details',
  templateUrl: './organization-details.component.html',
  styleUrls: ['./organization-details.component.css', '../../../partial.component.css']
})
export class OrganizationDetailsComponent implements OnInit {
  bodyMember!: FormGroup;
  globalDistrictId: any;
  allDistrict: any;
  resAllMember: any;
  getTalkaByDistrict: any;
  resultVillageOrCity: any;
  submitted: boolean = false;
  items: string[] = [];
  villageCityLabel = "Village";
  setVillOrCityId = "VillageId";
  setVillOrcityName = "VillageName";
  bodyMemberDetails: any;
  bodyMemberFilterDetails: any;
  allDesignatedMembers: any;
  TotalWorkAndIosCount: any;
  prevDesMembers: any[] = [];
  resBodyMemAct: any;
  resultBodyMemActGraph: any;
  imgStringToArray: any;
  DesignationNameBYBodyId: any;
  bodyId: any;
  resultPrevDesMembers: any;
  getPreDesMembersArray: any[] = [];
  resultBodyMemActDetails: any;
  paginationNo: number = 1;
  total: any;
  pageSize: number = 10;
  resWorkcategory: any;
  filter!: FormGroup;
  globalMemberId: number = 0;
  globalCategoryId: number = 0;
  dataAddEditMember: any;
  @ViewChild('addMemberModal') addMemberModal: any;
  @ViewChild('closeAddMemberModal') closeAddMemberModal: any;
  lat: any = 19.75117687556874;
  lng: any = 75.71630325927731;
  getCommitteeName:any;
  toDate:any = this.datepipe.transform(new Date(), 'dd/MM/yyyy');
  fromDate:any = this.datepipe.transform(new Date(Date.now() + -6 * 24 * 60 * 60 * 1000), 'dd/MM/yyyy');
  maxDate: any = new Date();
  constructor(private fb: FormBuilder, private callAPIService: CallAPIService, 
    private spinner: NgxSpinnerService,  public dateTimeAdapter: DateTimeAdapter<any>,
    private toastrService: ToastrService, private router: Router, 
    private commonService: CommonService , public datepipe: DatePipe,) { 
      let getLocalStorageData:any = localStorage.getItem('bodyId') ;
      getLocalStorageData = JSON.parse(getLocalStorageData);
      this.bodyId = getLocalStorageData.bodyId;
      this.getCommitteeName = getLocalStorageData.BodyOrgCellName;
      { dateTimeAdapter.setLocale('en-IN')  }
    }

  ngOnInit(): void {
    this.defaultFilterForm()
    this.defaultBodyMemForm();
    this.getAllBodyMember();
    this.getBodyMemberFilterDetails(this.bodyId);
    this.getCurrentDesignatedMembers(this.bodyId);
    this.getBodyMemeberActivities(this.bodyId);
    this.getBodyMemeberGraph(this.bodyId);
    this.getWorkcategoryFilterDetails(this.bodyId);
  }

  defaultFilterForm() {
    this.filter = this.fb.group({
      memberName: ['', Validators.required],
      workType: ['', Validators.required],
      FromDate: [this.fromDate, Validators.required],
      ToDate: [this.toDate, Validators.required],
    })
  }

  filterForm(text: any, flag: any) {
    if (flag == "member") {
      this.globalMemberId = text;
      this.getBodyMemeberActivities(this.bodyId)
    } else if (flag == "workType") {
      this.globalCategoryId = text;
      this.getBodyMemeberActivities(this.bodyId)
    }
  }

  selectLevelClear(text: any) {
    if (text == "member") {
      this.globalMemberId = 0;
      this.getBodyMemeberActivities(this.bodyId)
    } else if (text == "workType") {
      this.globalCategoryId = 0;
      this.getBodyMemeberActivities(this.bodyId)
    }
  }

  defaultBodyMemForm() {
    this.bodyMember = this.fb.group({
      bodyId: ['', Validators.required]
    })
  }

  get f() { return this.bodyMember.controls };


  getAllBodyMember() {
    this.spinner.show();
    this.callAPIService.setHttp('get', 'Web_GetAllMember_1_0', false, false, false, 'ncpServiceForWeb');
    this.callAPIService.getHttp().subscribe((res: any) => {
      if (res.data == 0) {
        this.spinner.hide();
        this.resAllMember = res.data1;
      } else {
        this.spinner.hide();
        if (res.data == 1) {
          this.toastrService.error("Body member is not available");
        } else {
          this.toastrService.error("Please try again something went wrong");
        }
      }
    })
  }

  getBodyMemberDetails(id: any) {
    this.spinner.show();
    this.callAPIService.setHttp('get', 'Web_GetMemberDetails_1_0?MemberId=' + id, false, false, false, 'ncpServiceForWeb');
    this.callAPIService.getHttp().subscribe((res: any) => {
      if (res.data == 0) {
        this.spinner.hide();
        this.bodyMemberDetails = res.data1[0];
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

  getBodyMemberFilterDetails(id: any) {
    this.spinner.show();
    this.callAPIService.setHttp('get', 'Web_GetBodyMemberList_1_0?BodyId=' + id, false, false, false, 'ncpServiceForWeb');
    this.callAPIService.getHttp().subscribe((res: any) => {
      if (res.data == 0) {
        this.spinner.hide();
        this.bodyMemberFilterDetails = res.data1;
      } else {
        this.spinner.hide();
        if (res.data == 1) {
          this.toastrService.error("Member is not available");
        } else {
          this.toastrService.error("Please try again something went wrong");
        }
      }
    })
  }

  getWorkcategoryFilterDetails(id: any) {
    this.spinner.show();
    this.callAPIService.setHttp('get', 'Web_Workcategory_1_0', false, false, false, 'ncpServiceForWeb');
    this.callAPIService.getHttp().subscribe((res: any) => {
      if (res.data == 0) {
        this.spinner.hide();
        this.resWorkcategory = res.data1;
      } else {
        this.spinner.hide();
        if (res.data == 1) {
          this.toastrService.error("Member is not available");
        } else {
          this.toastrService.error("Please try again something went wrong");
        }
      }
    })
  }

  getCurrentDesignatedMembers(id: any) {
    this.spinner.show();
    this.callAPIService.setHttp('get', 'Web_GetCurrentDesignatedMembers_1_0?BodyId=' + id, false, false, false, 'ncpServiceForWeb');
    this.callAPIService.getHttp().subscribe((res: any) => {
      if (res.data == 0) {
        this.spinner.hide();
        this.allDesignatedMembers = res.data1;
        this.TotalWorkAndIosCount = res.data2[0];
        this.DesignationNameBYBodyId = res.data3;
        this.DesignationNameBYBodyId.forEach((ele: any) => {
          this.getPreviousDesignatedMembers(this.bodyId, ele.DesignationId);
        });
        // this.getPreDesMembersArray
      } else {
        this.spinner.hide();
        if (res.data == 1) {
          this.toastrService.error("Member is not available");
        } else {
          this.toastrService.error("Please try again something went wrong");
        }
      }
    })
  }

  getPreviousDesignatedMembers(id: any, DesignationId: any) {
    this.spinner.show();
    this.callAPIService.setHttp('get', 'Web_GetPreviousDesignatedMembers_1_0?BodyId=' + id + '&DesignationId=' + DesignationId, false, false, false, 'ncpServiceForWeb');
    this.callAPIService.getHttp().subscribe((res: any) => {
      if (res.data == 0) {
        this.spinner.hide();
        this.getPreDesMembersArray.push(res.data1)
        // this.prevDesMembers = res.data1;

        // this.prevDesMembers.push(res.data1);
      } else {
        this.spinner.hide();
        if (res.data == 1) {
          this.toastrService.error("Member is not available");
        } else {
          this.toastrService.error("Please try again something went wrong");
        }
      }
    })
  }

  getBodyMemeberActivities(id: any) {
    this.spinner.show();
    this.callAPIService.setHttp('get', 'Web_BodyMemeber_Activities?MemberId=' + this.globalMemberId + '&BodyId=' + id + '&nopage=' + this.paginationNo + '&CategoryId=' + this.globalCategoryId+'&FromDate='+this.filter.value.FromDate+'&ToDate='+this.filter.value.ToDate, false, false, false, 'ncpServiceForWeb');
    this.callAPIService.getHttp().subscribe((res: any) => {
      if (res.data == 0) {
        this.spinner.hide();
        this.resBodyMemAct = res.data1;
        this.total = res.data2[0].TotalCount;
      } else {
        this.spinner.hide();
        if (res.data == 1) {
          this.resBodyMemAct = [];
          this.toastrService.error("Member is not available");
        } else {
          this.toastrService.error("Please try again something went wrong");
        }
      }
    })
  }


  onClickPagintion(pageNo: number) {
    // this.clearForm();
    this.paginationNo = pageNo;
    this.getBodyMemeberActivities(this.bodyId)
  }

  getBodyMemeberGraph(id: any) {
    this.spinner.show();
    this.callAPIService.setHttp('get', 'Web_BodyMemeber_ActivitiesGraph?BodyId=' + id, false, false, false, 'ncpServiceForWeb');
    this.callAPIService.getHttp().subscribe((res: any) => {
      if (res.data == 0) {
        this.spinner.hide();
        this.resultBodyMemActGraph = res.data1;
        this.bodyMemeberChartGraph(this.resultBodyMemActGraph);
      } else {
        this.spinner.hide();
        if (res.data == 1) {
          this.toastrService.error("Member is not available");
        } else {
          this.toastrService.error("Please try again something went wrong");
        }
      }
    })
  }

  getBodyMemeberActivitiesDetails(id: any) {
    this.spinner.show();
    this.callAPIService.setHttp('get', 'Web_BodyMemeber_ActivitiesDetails?WorkId=' + id, false, false, false, 'ncpServiceForWeb');
    this.callAPIService.getHttp().subscribe((res: any) => {
      if (res.data == 0) {
        this.spinner.hide();
        this.resultBodyMemActDetails = res.data1[0];
        let latLong = this.resultBodyMemActDetails.ActivityLocation.split(",");
       this.lat = latLong[0]
       this.lng = latLong[0]
        
      } else {
        this.spinner.hide();
        if (res.data == 1) {
          this.toastrService.error("Member is not available");
        } else {
          this.toastrService.error("Please try again something went wrong");
        }
      }
    })
  }


  // chart DIv 
  bodyMemeberChartGraph(data: any) {
    am4core.ready(() => {
      am4core.useTheme(am4themes_animated);

      let chart = am4core.create('membersProBarChart', am4charts.XYChart)
      chart.colors.step = 2;

      chart.legend = new am4charts.Legend()
      chart.legend.position = 'top'
      chart.legend.paddingBottom = 10
      chart.legend.labels.template.maxWidth = 20

      let xAxis = chart.xAxes.push(new am4charts.CategoryAxis())
      xAxis.dataFields.category = 'MemberName'
      xAxis.renderer.cellStartLocation = 0.1
      xAxis.renderer.cellEndLocation = 0.9
      xAxis.renderer.grid.template.location = 0;

      let yAxis = chart.yAxes.push(new am4charts.ValueAxis());
      yAxis.min = 0;

      function createSeries(value: string | undefined, name: string) {
        let series = chart.series.push(new am4charts.ColumnSeries())
        series.dataFields.valueY = value
        series.dataFields.categoryX = 'MemberName'
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

      chart.data = data;

      chart.padding(10, 5, 5, 5);
      // createSeries('MemberName', 'Work Done by Committes');
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

  ngOnDestroy() {
    localStorage.removeItem('bodyId');
  }

  addEditMember(data: any) {
    if (data.UserId == "" || data.UserId == "") {
      this.toastrService.error("Please select member and try again");
    }
    else {
      console.log(data)
      this.dataAddEditMember = data
      let openMemberModal: HTMLElement = this.addMemberModal.nativeElement;
      openMemberModal.click();

    }
  }

  onSubmit() {
    this.submitted = true;
    if (this.bodyMember.invalid) {
      this.spinner.hide();
      return;
    }
    else {
      let fromData = new FormData();
      fromData.append('UserPostBodyId', this.dataAddEditMember.userpostbodyId);
      fromData.append('BodyId', this.dataAddEditMember.BodyId);
      fromData.append('DesignationId', this.dataAddEditMember.DesignationId);
      fromData.append('UserId', this.bodyMember.value.bodyId);
      fromData.append('IsMultiple', this.dataAddEditMember.IsMultiple);
      fromData.append('CreatedBy', this.commonService.loggedInUserId());
      this.spinner.show();
      this.callAPIService.setHttp('Post', 'Web_Insert_AssignMember_1_0', false, fromData, false, 'ncpServiceForWeb');
      this.callAPIService.getHttp().subscribe((res: any) => {
        if (res.data == 0) {
          this.spinner.hide();
          let closeAddMemModal: HTMLElement = this.closeAddMemberModal.nativeElement;
          closeAddMemModal.click();
          this.resultBodyMemActDetails = res.data1[0];
          this.toastrService.success(this.resultBodyMemActDetails.Msg);
          this.bodyMember.reset();
          this.getCurrentDesignatedMembers(this.bodyId);
        } else {
          this.spinner.hide();
          if (res.data == 1) {
            this.toastrService.error("Member is not available");
          } else {
            this.toastrService.error("Please try again something went wrong");
          }
        }
      })
    }
  }
  getweekRage(event:any){
    this.filter.patchValue({
      FromDate:this.datepipe.transform(event.value[0], 'dd/MM/yyyy'),
      ToDate:this.datepipe.transform(event.value[1], 'dd/MM/yyyy')
    })
    this.getBodyMemeberActivities(this.bodyId)
  }
}
