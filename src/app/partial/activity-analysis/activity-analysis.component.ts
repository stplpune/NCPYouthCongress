import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { DateTimeAdapter } from 'ng-pick-datetime';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { CallAPIService } from 'src/app/services/call-api.service';
import { Gallery, GalleryItem, ImageItem, ThumbnailsPosition, ImageSize } from '@ngx-gallery/core';
import { Lightbox } from '@ngx-gallery/lightbox';
import { CommonService } from '../../services/common.service';
@Component({
  selector: 'app-activity-analysis',
  templateUrl: './activity-analysis.component.html',
  styleUrls: ['./activity-analysis.component.css', '../partial.component.css']
})
export class ActivityAnalysisComponent implements OnInit {
  memberNameArray: any;
  politicalWorkArray: any;
  paginationNo: number = 1;
  total: any;
  pageSize: number = 10;
  viewMembersObj: any = { DistrictId: 0, Talukaid: 0, villageid: 0, SearchText: '' }
  filterForm!: FormGroup;
  minDate = new Date();
  defaultCloseBtn: boolean = false;
  globalMemberId: number = 0;
  PoliticalWork: any;
  newsLetters: any;
  PersonalHelp: any;
  partyPrograms: any;
  Helpme: any;
  TotalWorks: any;
  socialMediaCount: any;
  socialMediaArray: any;
  categoryArray: any;
  viewPoliticleWorkDetailsById: any;
  lat: any;
  lng: any;
  zoom: any = 12;
  activityLikesArray: any;
  disabledMarkAsAbuse: boolean = false; 
  disabledMarkasNotAbuse: boolean = false;
  comUserdetImg:any;
  HighlightRow: any;
  programGalleryImg!: GalleryItem[]; 
  @ViewChild('TotalLikes') TotalLikes:any;
  @ViewChild('TotalComments') TotalComments:any;
  @ViewChild('TotalShares') TotalShares:any;
  @ViewChild('TotalAbuses') TotalAbuses:any;
  constructor(
    private callAPIService: CallAPIService,
    private spinner: NgxSpinnerService,
    private toastrService: ToastrService,
    public gallery: Gallery,
    private _lightbox: Lightbox,
    private commonService: CommonService,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    public dateTimeAdapter: DateTimeAdapter<any>,
    private datePipe: DatePipe
  ) { { dateTimeAdapter.setLocale('en-IN') } }

  ngOnInit(): void {
    this.minDate.setDate(this.minDate.getDate() - 1);
    this.defaultFilterForm();
    this.getPoliticalWork();
    this.getMemberName();
    this.getSocialMedia();
    this.getCategory();
  }

  defaultFilterForm() {
    this.filterForm = this.fb.group({
      memberName: [0],
      fromTo: [['', '']],
      workType: [0],
      fromDate: [''],
      toDate: [''],
    })
  }

  selDateRangeByFilter(getDate: any) {
    this.defaultCloseBtn = true;
    this.filterForm.value.fromDate = this.datePipe.transform(getDate[0], 'dd/MM/yyyy');
    this.filterForm.value.toDate = this.datePipe.transform(getDate[1], 'dd/MM/yyyy');
    this.getPoliticalWork();
  }


  clearValue() {
    this.defaultCloseBtn = false;
    // this.defaultToDate = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000);
    // this.defaultFromDate = new Date(Date.now() + - 365 * 24 * 60 * 60 * 1000);
    this.filterForm.controls['fromTo'].setValue(['', '']);
    this.paginationNo = 1;
    this.getPoliticalWork();

  }

  filterData() {
    this.paginationNo = 1;
    this.getPoliticalWork()
  }

  getPoliticalWork() {
    this.spinner.show();
    let formData = this.filterForm.value;
    let fromDate: any;
    let toDate: any;
    this.filterForm.value.fromTo[0] != "" ? (fromDate = this.datePipe.transform(this.filterForm.value.fromTo[0], 'dd/MM/yyyy')) : fromDate = '';
    this.filterForm.value.fromTo[1] != "" ? (toDate = this.datePipe.transform(this.filterForm.value.fromTo[1], 'dd/MM/yyyy')) : toDate = '';

    let obj = 'categoryid=' + formData.workType + '&nopage=' + this.paginationNo + '&MemberId=' + formData.memberName + '&FromDate=' + fromDate + '&ToDate=' + toDate;
    this.callAPIService.setHttp('get', 'GetPoliticalWork_Web_1_0?' + obj, false, false, false, 'ncpServiceForWeb');
    this.callAPIService.getHttp().subscribe((res: any) => {
      res.data == 0 ? (this.PoliticalWork = res.data3[0].Totalwork) : this.PoliticalWork = 0;
      res.data == 0 ? (this.newsLetters = res.data3[1].Totalwork) : this.newsLetters = 0;
      res.data == 0 ? (this.socialMediaCount = res.data3[2].Totalwork) : this.socialMediaCount = 0;
      res.data == 0 ? (this.PersonalHelp = res.data3[3].Totalwork) : this.PersonalHelp = 0;
      res.data == 0 ? (this.partyPrograms = res.data3[4].Totalwork) : this.partyPrograms = 0;
      res.data == 0 ? (this.Helpme = res.data3[5].Totalwork) : this.Helpme = 0;
      res.data == 0 ? (this.TotalWorks = res.data3[6].Totalwork) : this.TotalWorks = 0;
      if (res.data == 0) {
        this.spinner.hide();
        this.politicalWorkArray = res.data1;
        this.total = res.data2[0].TotalCount;
      } else {
        this.spinner.hide();
        this.politicalWorkArray = [];
      }
    }, (error: any) => {
      this.spinner.hide();
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
        this.spinner.hide();
        //this.toastrService.error("Data is not available");
      }
    }, (error: any) => {
      this.spinner.hide();
      if (error.status == 500) {
        this.router.navigate(['../500'], { relativeTo: this.route });
      }
    })
  }

  getPoliticalWorkById() {
    this.paginationNo = 1;
    this.getPoliticalWork()
  }

  onClickPagintion(pageNo: number) {
    this.paginationNo = pageNo;
    this.getPoliticalWork()
  }

  redToMemberProfile(memberId:any,FullName:any){
    let obj = {'memberId':memberId, 'FullName':FullName}
    sessionStorage.setItem('memberId', JSON.stringify(obj));
    this.router.navigate(['/profile'], {relativeTo:this.route})
  }


  clearFilter(flag: any) {
    if (flag == 'member') {
      this.filterForm.controls['memberName'].setValue(0);
    } else if (flag == 'dateRangePIcker') {
      this.filterForm.controls['fromTo'].setValue(0);
    } else if (flag == 'media') {
      this.filterForm.controls['workType'].setValue(0);
    }
    this.paginationNo = 1;
    this.getPoliticalWork()
  }

  getSocialMedia() {
    this.spinner.show();
    this.callAPIService.setHttp('get', 'GetSocialMediaddl_Web_1_0?UserId=' + this.commonService.loggedInUserId(), false, false, false, 'ncpServiceForWeb');
    this.callAPIService.getHttp().subscribe((res: any) => {
      if (res.data == 0) {
        this.spinner.hide();
        this.socialMediaArray = res.data1;
      } else {
        this.spinner.hide();
        //this.toastrService.error("Data is not available");
      }
    }, (error: any) => {
      this.spinner.hide();
      if (error.status == 500) {
        this.router.navigate(['../500'], { relativeTo: this.route });
      }
    })
  }

  getCategory() {
    this.spinner.show();
    this.callAPIService.setHttp('get', 'Web_GetCategory?UserId=' + this.commonService.loggedInUserId(), false, false, false, 'ncpServiceForWeb');
    this.callAPIService.getHttp().subscribe((res: any) => {
      if (res.data == 0) {
        this.spinner.hide();
        this.categoryArray = res.data1;
      } else {
        this.spinner.hide();
        //this.toastrService.error("Data is not available");
      }
    }, (error: any) => {
      this.spinner.hide();
      if (error.status == 500) {
        this.router.navigate(['../500'], { relativeTo: this.route });
      }
    })
  }

  ViewPoliticleWorkDetails(index: any) {
    this.viewPoliticleWorkDetailsById = null;
    this.viewPoliticleWorkDetailsById = this.politicalWorkArray[index];
    this.HighlightRow = this.viewPoliticleWorkDetailsById.Id;

        this.comUserdetImg = this.viewPoliticleWorkDetailsById.Images.split(',');
        this.comUserdetImg = this.commonService.imgesDataTransform(this.comUserdetImg,'array');
        this.gallery.ref().load(this.comUserdetImg);
  
    let latLong: any = (this.viewPoliticleWorkDetailsById.ActivityLocation);
    if (latLong != "" && latLong != undefined && latLong != null) {
      let getLatLong = latLong.split(',');
      this.lat = Number(getLatLong[0]);
      this.lng = Number(getLatLong[1]);
    } else {
      this.lat = 19.663280;
      this.lng = 75.300293;
    }
  }

  getActivityLikes(activityId:any,flag:any, counter:any) {
    if(counter == 0 ){
      this.toastrService.info('No data found...');
      return;
    }
    this.spinner.show();
    if (flag == 1) {
      let clickTotalLikesModal: any = this.TotalLikes.nativeElement;
      clickTotalLikesModal.click();
    } else if (flag == 2) {
      let clickTotalComments: any = this.TotalComments.nativeElement;
      clickTotalComments.click();
    } else if (flag == 3) {
      let clickTotalShares: any = this.TotalShares.nativeElement;
      clickTotalShares.click();
    } else if (flag == 4) {
      let clickTotalAbuses: any = this.TotalAbuses.nativeElement;
      clickTotalAbuses.click();
    }
    this.callAPIService.setHttp('get', 'Web_GetActivityLikes_1_0?ActivityId=' + activityId + '&flag='+ flag , false, false, false, 'ncpServiceForWeb');
    this.callAPIService.getHttp().subscribe((res: any) => {
      if (res.data == 0) {
        this.spinner.hide();
        this.activityLikesArray = res.data1 ? res.data1 : [];
      } else {
        this.spinner.hide();
        this.activityLikesArray = [];
        // //this.toastrService.error("Data is not available");
      }
    }, (error: any) => {
      this.spinner.hide();
      if (error.status == 500) {
        this.router.navigate(['../500'], { relativeTo: this.route });
      }
    })
}

  insertMarkAsAbuse(activityId: any, IsAbuse: any) {
    let AbuseStatus:any;
    let MarkAsNotAbuse:any = 0;
    if(IsAbuse == 0){
      AbuseStatus = 1 
    }else if (IsAbuse == 1){
      AbuseStatus = 1;  MarkAsNotAbuse = 1; 
    }else if (IsAbuse == 1 && MarkAsNotAbuse == 1){
      AbuseStatus = 1;  MarkAsNotAbuse = 0; 
    }
 
    this.spinner.show();
    this.callAPIService.setHttp('get', 'InsertMarkAsAbuse?ActivityId=' + activityId + '&UserId=' + this.commonService.loggedInUserId() + '&IsAbuse=' + AbuseStatus+'&MarkAsNotAbuse='+MarkAsNotAbuse, false, false, false, 'ncpServiceForWeb');
    this.callAPIService.getHttp().subscribe((res: any) => {
      if (res.data == 0) {
        this.spinner.hide();
        this.toastrService.success(res.data1[0].Msg);
        this.getPoliticalWork();
      } else {
        this.spinner.hide();
        //this.toastrService.error("Data is not available");
      }
    }, (error: any) => {
      this.spinner.hide();
      // if (error.status == 500) {
      //   this.router.navigate(['../500'], { relativeTo: this.route });
      // }
    })
  }
}
