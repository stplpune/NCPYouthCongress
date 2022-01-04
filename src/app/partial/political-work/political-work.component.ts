import { Component, OnInit } from '@angular/core';
import { CallAPIService } from 'src/app/services/call-api.service';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from '../../services/common.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgxSpinnerService } from "ngx-spinner";
import { ActivatedRoute, Router } from '@angular/router';
import { DateTimeAdapter } from 'ng-pick-datetime';
import { DatePipe } from '@angular/common';
import { Gallery, GalleryItem, ImageItem, ThumbnailsPosition, ImageSize } from '@ngx-gallery/core';
import { Lightbox } from '@ngx-gallery/lightbox';

@Component({
  selector: 'app-political-work',
  templateUrl: './political-work.component.html',
  styleUrls: ['./political-work.component.css', '../partial.component.css']
})
export class PoliticalWorkComponent implements OnInit {
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
  comUserdetImg: any;
  programGalleryImg!: GalleryItem[];
  HighlightRow: any;
  mapHideShowDiv: boolean = false;
  previous:any;
  
  constructor(
    private callAPIService: CallAPIService,
    private spinner: NgxSpinnerService,
    private toastrService: ToastrService,
    private commonService: CommonService,
    private fb: FormBuilder,
    private router: Router,
    public gallery: Gallery,
    private _lightbox: Lightbox,
    private route: ActivatedRoute,
    public dateTimeAdapter: DateTimeAdapter<any>,
    private datePipe: DatePipe
  ) { { dateTimeAdapter.setLocale('en-IN') } }

  ngOnInit(): void {
    this.minDate.setDate(this.minDate.getDate() - 1);
    this.defaultFilterForm();
    this.getPoliticalWork();
    this.getMemberName();
    //this.getSocialMedia();
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

    let obj = 'UserId='+this.commonService.loggedInUserId()+'&categoryid=' + formData.workType + '&nopage=' + this.paginationNo + '&MemberId=' + formData.memberName + '&FromDate=' + fromDate + '&ToDate=' + toDate;
    this.callAPIService.setHttp('get', 'Web_GetPoliticalWork_Web_1_0_Commmittee?' + obj, false, false, false, 'ncpServiceForWeb');
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
      if (error.status == 500) {
        this.router.navigate(['../500'], { relativeTo: this.route });
      }
    })
  }

  getMemberName() {
    this.spinner.show();
    this.callAPIService.setHttp('get', 'Web_GetBodyMemberListHaveWork_1_0?UserId=' + this.commonService.loggedInUserId(), false, false, false, 'ncpServiceForWeb'); //old API GetMemberddl_Web_1_0
    this.callAPIService.getHttp().subscribe((res: any) => {
      if (res.data == 0) {
        this.spinner.hide();
        this.memberNameArray = res.data1;
      } else {
        //this.toastrService.error("Data is not available");
      }
    }, (error: any) => {
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

  redToMemberProfile(memberId: any, FullName: any) {
    let obj = { 'memberId': memberId, 'FullName': FullName }
    sessionStorage.setItem('memberId', JSON.stringify(obj));
    this.router.navigate(['/profile'], { relativeTo: this.route })
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
        //this.toastrService.error("Data is not available");
      }
    }, (error: any) => {
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
        //this.toastrService.error("Data is not available");
      }
    }, (error: any) => {
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
    this.comUserdetImg = this.commonService.imgesDataTransform(this.comUserdetImg, 'array');
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

  clickedMarker(infowindow:any) {
    if (this.previous) {
        this.previous.close();
    }
    this.previous = infowindow;
 }

}
