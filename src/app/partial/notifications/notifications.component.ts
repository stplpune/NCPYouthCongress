import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { CallAPIService } from 'src/app/services/call-api.service';
import { CommonService } from 'src/app/services/common.service';
import { ActivatedRoute, Router } from '@angular/router';
import { debounceTime } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css', '../partial.component.css']
})
export class NotificationsComponent implements OnInit {
  subject: Subject<any> = new Subject();
  notificationForm!: FormGroup;
  submitted = false;
  allLevels: any;
  memberNameArray: any;
  filterForm!: FormGroup;
  allDistrict: any;
  viewMembersObj:any = { DistrictId: 0, Talukaid: 0, villageid: 0, SearchText:''}
  getTalkaByDistrict: any;
  resultVillageOrCity: any;
  notificationscopeArray: any;
  notificationArray: any;
  paginationNo: number = 1;
  pageSize: number = 10;
  searchFilter = "";
  defaultCloseBtn:boolean = false;
  total:any;

  constructor(
    private callAPIService: CallAPIService, 
    private fb: FormBuilder,
    private toastrService: ToastrService,
    private commonService: CommonService,
    private spinner: NgxSpinnerService,
    private route: ActivatedRoute,
    private router: Router,
    private datePipe:DatePipe
    ) { }

  ngOnInit(): void {
    this.customForm();
    this.getLevel();
    this.getMemberName();
    this.getDistrict();
    this.defaultFilterForm();
    this.gerNotificationscope();
    this.getNotificationData();
    this.searchFilters('false');
  }

  customForm() {
    this.notificationForm = this.fb.group({
      titleName: ['', Validators.required],
      notifi_Body: ['', Validators.required],
      Photo: ['', Validators.required],
      link: ['', Validators.required],
      attachment: ['', Validators.required],
      scope_Of_Not: ['', Validators.required],
      members: ['', Validators.required],
      check:['']
    })
  }

  defaultFilterForm() {
    this.filterForm = this.fb.group({
      fromTo: [['','']],
      ScopeId: [0],
      searchText:[''],
    })
  }

  get f() { return this.notificationForm.controls };
  
  onSubmit(){
    this.submitted = true;
    console.log(this.notificationForm.value);
    //this.clearForm();
  }

  getLevel() {
    this.spinner.show();
    this.callAPIService.setHttp('get', 'Web_GetLevel_1_0', false, false, false, 'ncpServiceForWeb');
    this.callAPIService.getHttp().subscribe((res: any) => {
      if (res.data == 0) {
        this.spinner.hide();
        this.allLevels = res.data1;
      } else {
          this.toastrService.error("Data is not available");
      }
    } ,(error:any) => {
      if (error.status == 500) {
        this.router.navigate(['../500'], { relativeTo: this.route });
      }
    })
  }

  getMemberName() {
    this.spinner.show();    
    this.callAPIService.setHttp('get', 'GetMemberddl_Web_1_0?UserId=' + this.commonService.loggedInUserId(), false, false, false, 'ncpServiceForWeb');
    this.callAPIService.getHttp().subscribe((res: any) => {
      if (res.data == 0) {
        this.spinner.hide();
        this.memberNameArray = res.data1;
      } else {
          this.toastrService.error("Data is not available");
      }
    } ,(error:any) => {
      if (error.status == 500) {
        this.router.navigate(['../500'], { relativeTo: this.route });
      }
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
          this.toastrService.error("Data is not available 2");
      }
    } ,(error:any) => {
      if (error.status == 500) {
        this.router.navigate(['../500'], { relativeTo: this.route });
      }
    })
  }

  getTaluka(districtId: any) {
    this.viewMembersObj.DistrictId = districtId;
    this.spinner.show();
    this.callAPIService.setHttp('get', 'Web_GetTaluka_1_0?DistrictId=' + districtId, false, false, false, 'ncpServiceForWeb');
    this.callAPIService.getHttp().subscribe((res: any) => {
      if (res.data == 0) {
        this.spinner.hide();
        this.getTalkaByDistrict = res.data1;
        console.log(this.getTalkaByDistrict)
      } else {
          this.toastrService.error("Data is not available");
      }
    } ,(error:any) => {
      if (error.status == 500) {
        this.router.navigate(['../500'], { relativeTo: this.route });
      }
    })
  }

  getVillageOrCity(talukaID: any) {
    debugger
    this.viewMembersObj.Talukaid = talukaID
    this.callAPIService.setHttp('get', 'Web_GetVillage_1_0?talukaid=' + talukaID, false, false, false, 'ncpServiceForWeb');
    this.callAPIService.getHttp().subscribe((res: any) => {
      if (res.data == 0) {
        this.spinner.hide();
        this.resultVillageOrCity = res.data1;

      } else {
          this.toastrService.error("Data is not available1");
      }
    } ,(error:any) => {
      if (error.status == 500) {
        this.router.navigate(['../500'], { relativeTo: this.route });
      }
    })
  } 

  gerNotificationscope() {
    this.spinner.show();
    this.callAPIService.setHttp('get', 'Web_Notificationscope', false, false, false, 'ncpServiceForWeb');
    this.callAPIService.getHttp().subscribe((res: any) => {
      if (res.data == 0) {
        this.spinner.hide();
        this.notificationscopeArray = res.data1;
        console.log(this.notificationscopeArray)
      } else {
        this.spinner.hide();
          this.toastrService.error("Data is not available");
      }
    } ,(error:any) => {
      this.spinner.hide();
      if (error.status == 500) {
        this.router.navigate(['../500'], { relativeTo: this.route });
      }
    })
  }


  clearFilter(flag:any){
    if(flag ==  'notifications'){
      this.filterForm.controls['ScopeId'].setValue(0);
    }else  if(flag ==  'search'){
      this.filterForm.controls['searchText'].setValue('');
    }else  if(flag ==  'dateRangePIcker'){
      this.defaultCloseBtn = false;
      this.filterForm.controls['fromTo'].setValue(['','']);
    }
    this.paginationNo = 1;
    this.getNotificationData();
  }

  filterData(flag:any){
    flag == 'range' ?  this.defaultCloseBtn = true :  this.defaultCloseBtn = false; 
    this.paginationNo = 1;
    this.getNotificationData();
  }

  getNotificationData(){
    debugger;
    let getObj:any = this.filterForm.value;
    this.spinner.show();
    let fromDate: any;
    let toDate: any;
    getObj.fromTo[0] != "" ? (fromDate = this.datePipe.transform(getObj.fromTo[0], 'dd/MM/yyyy')) : fromDate = '';
    getObj.fromTo[1] != "" ? (toDate = this.datePipe.transform(getObj.fromTo[1], 'dd/MM/yyyy')) : toDate = '';
    this.callAPIService.setHttp('get', 'GetNotification_Web_1_0?UserId='+this.commonService.loggedInUserId()+'&PageNo='+this.paginationNo+'&FromDate='+fromDate+'&ToDate='+toDate+'&ScopeId='+getObj.ScopeId+'&SearchText='+getObj.searchText, false, false, false, 'ncpServiceForWeb');
    this.callAPIService.getHttp().subscribe((res: any) => {
      if (res.data == 0) {
        this.spinner.hide();
        this.notificationArray = res.data1;
        this.total = res.data2[0].TotalCount;
        console.log(this.notificationArray)
      } else {
        this.notificationArray = [];
        this.spinner.hide();
      }
    } ,(error:any) => {
      this.notificationArray = [];
      this.spinner.hide();
      if (error.status == 500) {
        this.router.navigate(['../500'], { relativeTo: this.route });
      }
    })
  }
  
  onClickPagintion(pageNo: number) {
    this.paginationNo = pageNo;
    this.getNotificationData();
  }

  onKeyUpFilter(){
    this.subject.next();
  }

  searchFilters(flag: any) {
    if (flag == 'true') {
      if (this.filterForm.value.searchText == "" || this.filterForm.value.searchText == null) {
        this.toastrService.error("Please search and try again");
        return
      }
    }
    this.subject.pipe(debounceTime(700)).subscribe(() => {
      this.searchFilter = this.filterForm.value.searchText;
      this.paginationNo = 1;
      this.getNotificationData();
    }
    );
  }

}
