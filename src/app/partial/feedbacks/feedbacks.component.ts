import { DatePipe } from '@angular/common';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { CallAPIService } from 'src/app/services/call-api.service';
import { CommonService } from 'src/app/services/common.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-feedbacks',
  templateUrl: './feedbacks.component.html',
  styleUrls: ['./feedbacks.component.css', '../partial.component.css', '../help-support/help-support.component.css']
})
export class FeedbacksComponent implements OnInit {
  public items: string[] = [];
  allDistrict: any;
  getTalkaByDistrict: any;
  resultVillageOrCity: any;
  resultAllFeedBackData: any;
  paginationNo: number = 1;
  total: any;
  pageSize: number = 10;
  HighlightRow: any = 1;
  resultAllFeedBackDetails: any;
  FeedbackObj: any = { DistrictId: 0, Talukaid: 0, villageid: 0, MemberId: 0, statusId: 0 }
  filterForm!: FormGroup;
  globalFullName: any;
  detailsData: any;
  defualtHideFeedback: boolean = false;
  globalFeedbackStatus: number = 0;
  memberNameArray: any;
  defaultToDate = Date.now();
  defaultFromDate = new Date(Date.now() + - 30 * 24 * 60 * 60 * 1000);

  constructor(private fb: FormBuilder, private callAPIService: CallAPIService,
    private spinner: NgxSpinnerService,
    private toastrService: ToastrService, private router: Router,private route: ActivatedRoute,
    private commonService: CommonService, public datepipe: DatePipe,) { }

  ngOnInit(): void {
    this.getFeedBackData(this.FeedbackObj);
    this.getDistrict();
    this.defaultFilterForm();
    this.getMemberName();
  }


  defaultFilterForm() {
    this.filterForm = this.fb.group({
      DistrictId: [''],
      TalukaId: [''],
      VillageId: [0],
      MemberId: ['']
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
        this.spinner.hide();
          this.toastrService.error("Data is not available 2");
      }
    } ,(error:any) => {
      this.spinner.hide();
      if (error.status == 500) {
        this.router.navigate(['../500'], { relativeTo: this.route });
      }
    } )
  }

  getTaluka(districtId: any) {
    this.FeedbackObj.DistrictId = districtId;
    this.paginationNo = 1;
    this.getFeedBackData(this.FeedbackObj);

    this.spinner.show();
    this.callAPIService.setHttp('get', 'Web_GetTaluka_1_0?DistrictId=' + districtId, false, false, false, 'ncpServiceForWeb');
    this.callAPIService.getHttp().subscribe((res: any) => {
      if (res.data == 0) {
        this.spinner.hide();
        this.getTalkaByDistrict = res.data1;
        // this.details(1)
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

  getVillageOrCity(talukaID: any) {
    this.FeedbackObj.Talukaid = talukaID
    this.getFeedBackData(this.FeedbackObj);

    this.callAPIService.setHttp('get', 'Web_GetVillage_1_0?talukaid=' + talukaID, false, false, false, 'ncpServiceForWeb');
    this.callAPIService.getHttp().subscribe((res: any) => {
      if (res.data == 0) {
        this.spinner.hide();
        this.resultVillageOrCity = res.data1;

      } else {
        this.spinner.hide();
          this.toastrService.error("Data is not available1");
      }
    } ,(error:any) => {
      this.spinner.hide();
      if (error.status == 500) {
        this.router.navigate(['../500'], { relativeTo: this.route });
      }
    })
  }

  getVillByTaluka(villageId: any) {
    // this.filterObj.globalVillageid = villageId;
    // this.getFeedBackData(this.selweekRange)
  }

  getMemberName() {
    // this.spinner.show();
    this.callAPIService.setHttp('get', 'GetMemberddl_Web_1_0?UserId=' + this.commonService.loggedInUserId(), false, false, false, 'ncpServiceForWeb');
    this.callAPIService.getHttp().subscribe((res: any) => {
      if (res.data == 0) {
        this.spinner.hide();
        this.memberNameArray = res.data1;
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


  filterVillage(villageId: any) {
    this.FeedbackObj.villageid = villageId
    this.getFeedBackData(this.FeedbackObj);
  }

  getFeedBackData(FeedbackObj: any) {
    let fromDate: any = this.datepipe.transform(this.defaultFromDate, 'dd/MM/yyyy');
    let toDate: any = this.datepipe.transform(this.defaultToDate, 'dd/MM/yyyy');

    if (FeedbackObj != false) {
      (FeedbackObj.DistrictId == undefined || FeedbackObj.DistrictId == null) ? FeedbackObj.DistrictId = 0 : FeedbackObj.DistrictId = this.FeedbackObj.DistrictId;
      (FeedbackObj.Talukaid == undefined || FeedbackObj.DistrictId == null) ? FeedbackObj.Talukaid = 0 : FeedbackObj.Talukaid = this.FeedbackObj.Talukaid;
      (FeedbackObj.MemberId == undefined || FeedbackObj.MemberId == null) ? FeedbackObj.MemberId = 0 : FeedbackObj.MemberId = this.FeedbackObj.MemberId;
    }
    let statusId: any;
    statusId = this.FeedbackObj.statusId == undefined || this.FeedbackObj.statusId == null ? statusId = 0 : statusId = this.FeedbackObj.statusId;
    this.spinner.show();
    this.callAPIService.setHttp('get', 'FeedBackData_Web_1_0?UserId=' + this.commonService.loggedInUserId() + '&DistrictId=' + FeedbackObj.DistrictId + '&Talukaid=' + FeedbackObj.Talukaid + '&villageid=' + 0 + '&MemberId=' + FeedbackObj.MemberId + '&PageNo=' + this.paginationNo + '&StatusId=' + statusId + '&FromDate=' + fromDate + '&ToDate=' + toDate, false, false, false, 'ncpServiceForWeb');
    this.callAPIService.getHttp().subscribe((res: any) => {
      if (res.data == 0) {
        this.spinner.hide();
        this.resultAllFeedBackData = res.data1;
    
        this.total = res.data2[0].TotalCount;
      } else {
        this.spinner.hide();
        if (res.data == 1) {
          this.resultAllFeedBackData = [];
          this.toastrService.error("Data is not available");
        } else {
          this.toastrService.error("Please try again something went wrong");
        }
      }
    } ,(error:any) => {
      this.spinner.hide();
      if (error.status == 500) {
        this.router.navigate(['../500'], { relativeTo: this.route });
      }
    })
  }

  feedBackDataResult(flag: any) {
    if (flag == 'Ignored') {
      this.FeedbackObj.statusId = 3;
    } else if (flag == 'Replied') {
      this.FeedbackObj.statusId = 2;
    } else if (flag == 'New') {
      this.FeedbackObj.statusId = 0;
    } else if (flag == 'Read') {
      this.FeedbackObj.statusId = 1;
    }
    this.paginationNo  = 1;
    this.getFeedBackData(this.FeedbackObj);
  }

  onClickPagintion(pageNo: number) {
    this.paginationNo = pageNo;
    this.getFeedBackData(this.FeedbackObj)
  }

  filterClear(flag: any) {
    if (flag == 'district') {
      this.FeedbackObj = { DistrictId: 0, Talukaid: 0, villageid: 0, MemberId: 0 }
      this.filterForm.reset();
    } else if (flag == 'taluka') {
      this.filterForm.reset({ DistrictId: this.FeedbackObj.DistrictId });
      this.FeedbackObj = { 'DistrictId': this.FeedbackObj.DistrictId, 'TalukaId': this.filterForm.value.TalukaId, 'VillageId': this.filterForm.value.VillageId, MemberId: this.filterForm.value.MemberId }
    }
    // else if (flag == 'village') {
    //   this.filterForm.reset({
    //     VillageId: 0
    //   });
    //   this.FeedbackObj = { 'DistrictId': this.FeedbackObj.DistrictId, 'TalukaId': this.filterForm.value.TalukaId, 'VillageId': this.filterForm.value.VillageId }
    // } 

    else if (flag == 'member') {
      this.FeedbackObj.MemberId = 0;
    }
    this.paginationNo = 1;
    this.getFeedBackData(this.FeedbackObj)
  }

  selectMember(memberId: any) {
    this.FeedbackObj.MemberId = memberId;
    this.getFeedBackData(this.FeedbackObj)
  }

  searchFilter() {
    this.FeedbackObj.SearchText = this.filterForm.value.searchText
    this.getFeedBackData(this.FeedbackObj)
  }

  details(data: any) {
    // this.HighlightRow = data.SrNo;
    this.detailsData = data;
    console.log(this.detailsData);
    this.defualtHideFeedback = true;
    this.defaultFeebackReply(this.detailsData.Id, this.detailsData.FeedbackStatus);
    // this.spinner.show();
    this.callAPIService.setHttp('get', 'GetFeedbackReplyById_Web_1_0?UserId=' + this.commonService.loggedInUserId() + '&FeedbackId=' + data.Id, false, false, false, 'ncpServiceForWeb');
    this.callAPIService.getHttp().subscribe((res: any) => {
      if (res.data == 0) {
        this.spinner.hide();
        this.resultAllFeedBackDetails = res.data1;
      } else {
        // this.spinner.hide();
        // if (res.data == 1) {
          this.resultAllFeedBackDetails = [];
          // this.toastrService.error("Feedback is not available");
        // } else {
        //   this.toastrService.error("Please try again something went wrong");
        // }
      }
    } ,(error:any) => {
      this.spinner.hide();
      if (error.status == 500) {
        this.router.navigate(['../500'], { relativeTo: this.route });
      }
    })
  }

  defaultFeebackReply(id: any, FeedbackStatus: any) {
    if (FeedbackStatus == 0) {
      this.callAPIService.setHttp('get', 'InsertFeebackReply_Web_1_0?UserId=' + this.commonService.loggedInUserId() + '&FeedbackId=' + id + '&Replymessage=&FeedbackStatus=1', false, false, false, 'ncpServiceForWeb');
      this.callAPIService.getHttp().subscribe((res: any) => {
        if (res.data == 0) {
          this.defualtHideFeedback = true;
          this.spinner.hide();
          this.toastrService.success(' Message Read...')
          this.getFeedBackData(this.FeedbackObj)
        } else {
          this.spinner.hide();
          this.defualtHideFeedback = false;
            this.toastrService.error("Data is not available");
        }
      } ,(error:any) => {
        this.spinner.hide();
        if (error.status == 500) {
          this.router.navigate(['../500'], { relativeTo: this.route });
        }
      })
    }
  }

  insertFeebackReply(data: any, flag: any, id: any, fStatus: any) {
    if ((data == "" || data == null) && flag != 'read') {
      this.toastrService.error("Action taken field is required");
    } else {
      if (flag == 'read') {
        this.globalFeedbackStatus = 1
      } else if (flag == 'Ignore') {
        this.globalFeedbackStatus = 3
      } else if (flag == 'Reply') {
        this.globalFeedbackStatus = 2
      }
      this.callAPIService.setHttp('get', 'InsertFeebackReply_Web_1_0?UserId=' + this.commonService.loggedInUserId() + '&FeedbackId=' + id + '&Replymessage=' + data + '&FeedbackStatus=' + this.globalFeedbackStatus, false, false, false, 'ncpServiceForWeb');
      this.callAPIService.getHttp().subscribe((res: any) => {
        if (res.data == 0) {
          this.defualtHideFeedback = true;
          this.spinner.hide();
          this.toastrService.success(res.data1[0].Msg)
          this.getFeedBackData(this.FeedbackObj)
          this.defualtHideFeedback = false;
        } else {
          this.spinner.hide();
          this.defualtHideFeedback = false;
            this.toastrService.error("Data is not available");
        }
      } ,(error:any) => {
        this.spinner.hide();
        if (error.status == 500) {
          this.router.navigate(['../500'], { relativeTo: this.route });
        }
      })
    }
  }

}
