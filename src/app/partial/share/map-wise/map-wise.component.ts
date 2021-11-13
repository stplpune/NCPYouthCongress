import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router, ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { CallAPIService } from 'src/app/services/call-api.service';
import { CommonService } from 'src/app/services/common.service';
import { MaharashtraGeofanceService } from 'src/app/services/maharashtra-geofance.service';
import { ActivityDetailsComponent } from '../../dialogs/activity-details/activity-details.component';

@Component({
  selector: 'app-map-wise',
  templateUrl: './map-wise.component.html',
  styleUrls: ['./map-wise.component.css', '../../partial.component.css']
})
export class MapWiseComponent implements OnInit {
  resActivityLocation:any;
  lat: any = 19.7515;
  lng: any = 75.7139;
  zoom: any = 6;
  resultBodyMemActDetails:any;
  map:any;
  paths:any;
  resCommitee:any;
  resWorkcategory:any;
  filter!:FormGroup;
  maxDate: any = new Date();
  deafultShowIcon:boolean = true;
  ProgramListArray: any;
  ProgramListDisabled : boolean = true;

  constructor( private callAPIService: CallAPIService,
    private toastrService: ToastrService,
    public dialog: MatDialog,
    private spinner: NgxSpinnerService,
    private router: Router,
    private route: ActivatedRoute,
    private fb:FormBuilder,
    private datePipe: DatePipe,
    private MaharashtraGeofance:MaharashtraGeofanceService,
    private commonService: CommonService) { }

  ngOnInit(): void {
    this.defaultFilterForm();
    this.getCommiteeName();
    this.getWorkcategoryFilterDetails();
    this.dashboardActivityLocation();
  }

  defaultFilterForm() {
    this.filter = this.fb.group({
      CommitteeId: [0],
      ProgramId: [0],
      CategoryId: [0],
      selDate: [['', '']],
      fromDate: [''],
      toDate: [''],
    })
  }

  filterData(){
    let formData = this.filter.value;
    if(formData.CategoryId == 5){
      this.getWebProgramList();
      this.ProgramListDisabled = false;
    } else{
      this.ProgramListDisabled = true;
      this.filter.controls['ProgramId'].setValue(0);
    }
    this.dashboardActivityLocation();
  }

  clearFilter(flag:any){
    if (flag == 'Committee') {
      this.filter.controls['ProgramId'].setValue(0);
      this.filter.controls['CommitteeId'].setValue(0);
    } else if (flag == 'Program') {
      this.filter.controls['ProgramId'].setValue(0);
      this.ProgramListDisabled = false;
    } else if (flag == 'Category') {
      this.filter.controls['CategoryId'].setValue(0);
      this.filter.controls['ProgramId'].setValue(0);
      this.ProgramListDisabled = true;  
    } else if (flag == 'dateValue') {
      this.deafultShowIcon = true;
      this.filter.controls['ProgramId'].setValue(0);
      this.filter.controls['selDate'].setValue(['', '']);
    }
    this.dashboardActivityLocation()
  }

  getweekRage(event:any){
    this.deafultShowIcon = false;
    this.dashboardActivityLocation();

  }
  getCommiteeName() {
    this.spinner.show();
    this.callAPIService.setHttp('get', 'Web_GetBodyOrgCellName_1_0_Committee?UserId=' + this.commonService.loggedInUserId(), false, false, false, 'ncpServiceForWeb'); // old API Web_GetBodyOrgCellName_1_0
    this.callAPIService.getHttp().subscribe((res: any) => {
      if (res.data == 0) {
        this.spinner.hide();
        this.resCommitee = res.data1;
      } else {
        this.resCommitee = [];
        //this.toastrService.error("Data is not available");
      }
    }, (error: any) => {
      if (error.status == 500) {
        this.router.navigate(['../../500'], { relativeTo: this.route });
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

  getWebProgramList() {
    this.spinner.show();
    this.callAPIService.setHttp('get', 'Web_getProgramList_1_0?UserId='+this.commonService.loggedInUserId(), false, false, false, 'ncpServiceForWeb');
    this.callAPIService.getHttp().subscribe((res: any) => {
      if (res.data == 0) {
        this.spinner.hide();
        this.ProgramListArray = res.data1;
      } else {
        this.spinner.hide();
        //this.toastrService.error("Member is not available");
      }
    }, (error: any) => {
      this.spinner.hide();
      if (error.status == 500) {
        this.router.navigate(['../../500'], { relativeTo: this.route });
      }
    })
  }


  onMapReady(map:any) {
    this.map = map;
    this.drawPolygon()
  }

  drawPolygon() {
    let drawState = this.MaharashtraGeofance.MaharashtraGeofance[0].polygonText.replace(/\s*,\s*/g, ",");

    var AllPolyCoords: any = [];
    var AllPolygonData = drawState.split('),(');

    AllPolygonData.map((currentlatlon: any) => {
      var drawPolygonCoords: any = [];
      var str = currentlatlon.replace(/\)|\(/g, "").split(',')
      str.map(function (data: any) { drawPolygonCoords.push(data.split(' ')); })//  

      var PolyCoords: any = [];
      drawPolygonCoords.map((data: any) => {
        if (Number(data[1]) && Number(data[0])) {
          PolyCoords.push({ "lat": Number(data[1]), "lng": Number(data[0]) });
          AllPolyCoords.push({ "lat": Number(data[1]), "lng": Number(data[0]) });
        }

      })
      this.paths = AllPolyCoords;
    });
    const polygon = new google.maps.Polygon({
      paths: this.paths,
      strokeColor: '#A50606',//26b86f',//FFFFFF, ff0000
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: '#ef7b26',//e20d0f',
      fillOpacity: 0.35,
  });
  polygon.setMap(this.map);
 }

  dashboardActivityLocation(){
    let filterValue = this.filter.value;
    let fromDate:any; 
    let toDate:any;
    filterValue.ProgramId == "" || filterValue.ProgramId == null ?  filterValue.ProgramId = 0 : '';
    filterValue.selDate[0] != "" ? (fromDate = this.datePipe.transform(filterValue.selDate[0], 'dd/MM/yyyy')) : fromDate = '';
    filterValue.selDate[1] != "" ? (toDate = this.datePipe.transform(filterValue.selDate[1], 'dd/MM/yyyy')) : toDate = '';
    let obj = 'UserId='+this.commonService.loggedInUserId()+'&CommitteeId='+filterValue.CommitteeId+'&CategoryId='+filterValue.CategoryId+'&FromDate='+fromDate+''+'&ToDate='+toDate +'&ProgramId='+filterValue.ProgramId
    this.spinner.show();
    this.callAPIService.setHttp('get', 'Dashboard_Activity_Location?'+obj, false, false , false, 'ncpServiceForWeb');
    this.callAPIService.getHttp().subscribe((res: any) => {
      if (res.data == 0) {
        this.resActivityLocation = res.data1;
        this.spinner.hide();
      } else {
        this.toastrService.error('Location is not available')
        this.resActivityLocation = [];
        this.spinner.hide();
      }
    } ,(error:any) => {
      this.spinner.hide();
      if (error.status == 500) {
        this.router.navigate(['../500'], { relativeTo: this.route });
      }
    })
  }

  getBodyMemeberActivitiesDetails(viewMemberId: any) {
    this.spinner.show();
    this.callAPIService.setHttp('get', 'Web_BodyMemeber_ActivitiesDetails?WorkId=' + viewMemberId, false, false, false, 'ncpServiceForWeb');
    this.callAPIService.getHttp().subscribe((res: any) => {
      if (res.data == 0) {
        this.spinner.hide();
        this.resultBodyMemActDetails = res.data1[0];
        this.openDialogBodyMemActDetails();
      } else {
        this.spinner.hide();
        this.resultBodyMemActDetails = [];
      }
    }, (error: any) => {
      if (error.status == 500) {
        this.router.navigate(['../../../500'], { relativeTo: this.route });
      }
    })
  }

  openDialogBodyMemActDetails() {
    const dialogRef = this.dialog.open(ActivityDetailsComponent, {
      width: '1024px',
      data: this.resultBodyMemActDetails
    });
  }

}
