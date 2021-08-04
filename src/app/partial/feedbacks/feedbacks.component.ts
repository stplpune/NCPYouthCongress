import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { CallAPIService } from 'src/app/services/call-api.service';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-feedbacks',
  templateUrl: './feedbacks.component.html',
  styleUrls: ['./feedbacks.component.css', '../partial.component.css']
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
  HighlightRow: number = 1;
  resultAllFeedBackDetails: any;
  FeedbackObj: any = { DistrictId: 0, Talukaid: 0, villageid: 0, SearchText: '', statusId: 0 }
  filterForm!: FormGroup;
  globalFullName: any;
  detailsData: any;
  defualtHideFeedback: boolean = false;
  globalFeedbackStatus:any;

  constructor(private fb: FormBuilder, private callAPIService: CallAPIService,
    private spinner: NgxSpinnerService,
    private toastrService: ToastrService, private router: Router,
    private commonService: CommonService, public datepipe: DatePipe,) { }

  ngOnInit(): void {
    this.getFeedBackData(this.FeedbackObj);
    this.getDistrict();
    this.defaultFilterForm();
  }

  defaultFilterForm() {
    this.filterForm = this.fb.group({
      DistrictId: [''],
      TalukaId: [''],
      VillageId: [''],
      searchText: ['']
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
        if (res.data == 1) {
          this.toastrService.error("Data is not available 2");
        } else {
          this.toastrService.error("Please try again something went wrong");
        }
      }
    })
  }

  getTaluka(districtId: any) {
    this.FeedbackObj.DistrictId = districtId
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
        if (res.data == 1) {
          this.toastrService.error("Data is not available");
        } else {
          this.toastrService.error("Please try again something went wrong");
        }
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
        if (res.data == 1) {
          this.toastrService.error("Data is not available1");
        } else {
          this.toastrService.error("Please try again something went wrong");
        }
      }
    })
  }

  filterVillage(villageId: any) {
    this.FeedbackObj.villageid = villageId
    this.getFeedBackData(this.FeedbackObj);
  }

  getFeedBackData(FeedbackObj: any) {
    if (FeedbackObj != false) {
      (FeedbackObj.DistrictId == undefined || FeedbackObj.DistrictId == null) ? FeedbackObj.DistrictId = 0 : FeedbackObj.DistrictId = this.FeedbackObj.DistrictId;
      (FeedbackObj.Talukaid == undefined || FeedbackObj.DistrictId == null) ? FeedbackObj.Talukaid = 0 : FeedbackObj.Talukaid = this.FeedbackObj.Talukaid;
      (FeedbackObj.villageid == undefined || FeedbackObj.DistrictId == null) ? FeedbackObj.villageid = 0 : FeedbackObj.villageid = this.FeedbackObj.villageid;
    }
    this.spinner.show();
    this.callAPIService.setHttp('get', 'FeedBackData_Web_1_0?UserId=' + this.commonService.loggedInUserId() + '&DistrictId=' + FeedbackObj.DistrictId + '&Talukaid=' + FeedbackObj.Talukaid + '&villageid=' + FeedbackObj.villageid + '&SearchText=' + FeedbackObj.SearchText + '&PageNo=' + this.paginationNo + '&StatusId=' + this.FeedbackObj.statusId, false, false, false, 'ncpServiceForWeb');
    this.callAPIService.getHttp().subscribe((res: any) => {
      if (res.data == 0) {
        this.spinner.hide();
        this.resultAllFeedBackData = res.data1;
        this.total = res.data2[0].TotalCount;
        // if(this.resultAllFeedBackData){
        //   this.globalFullName = this.resultAllFeedBackData[0].FullName 
        //   this.details(this.resultAllFeedBackData[0].Id);
        // }
      } else {
        this.spinner.hide();
        if (res.data == 1) {
          this.resultAllFeedBackData = [];
          this.toastrService.error("Data is not available");
        } else {
          this.toastrService.error("Please try again something went wrong");
        }
      }
    })
  }

  feedBackDataResult(flag: any) {
    if (flag == 'Ignored') {
      this.FeedbackObj.statusId = 3;
    } else if (flag == 'Replied') {
      this.FeedbackObj.statusId = 2;
    } else if (flag == 'New') {
      this.FeedbackObj.statusId = 1;
    }
    this.getFeedBackData(this.FeedbackObj);
  }

  onClickPagintion(pageNo: number) {
    debugger;
    console.log(pageNo);
    this.paginationNo = pageNo;
    this.getFeedBackData(this.FeedbackObj)
  }

  districtClear(flag: any) {
    if (flag == 'district') {
      this.FeedbackObj = { DistrictId: 0, Talukaid: 0, villageid: 0, SearchText: '' }
      this.filterForm.reset();
    } else if (flag == 'taluka') {
      this.filterForm.reset({ DistrictId: this.FeedbackObj.DistrictId });
      this.FeedbackObj = { 'DistrictId': this.FeedbackObj.DistrictId, 'TalukaId': this.filterForm.value.TalukaId, 'VillageId': this.filterForm.value.VillageId, SearchText: '' }
    }
    else if (flag == 'village') {
      this.filterForm.reset({
        VillageId: 0
      });
      this.FeedbackObj = { 'DistrictId': this.FeedbackObj.DistrictId, 'TalukaId': this.filterForm.value.TalukaId, 'VillageId': this.filterForm.value.VillageId }
    } else if (flag == 'search') {
      this.FeedbackObj.SearchText = "";
      this.filterForm.controls['searchText'].setValue('');
    }
    this.getFeedBackData(this.FeedbackObj)
  }

  searchFilter() {
    this.FeedbackObj.SearchText = this.filterForm.value.searchText
    this.getFeedBackData(this.FeedbackObj)
  }

  details(data: any) {
    this.detailsData = data;
    this.spinner.show();
    this.callAPIService.setHttp('get', 'GetFeedbackReplyById_Web_1_0?UserId=' + this.commonService.loggedInUserId() + '&FeedbackId=' + data.Id, false, false, false, 'ncpServiceForWeb');
    this.callAPIService.getHttp().subscribe((res: any) => {
      if (res.data == 0) {
        this.sendData(this.detailsData.Id, 'read')
        this.defualtHideFeedback = true;
        this.spinner.hide();
        this.resultAllFeedBackDetails = res.data1;
      } else {
        this.defualtHideFeedback = false;
        this.spinner.hide();
        if (res.data == 1) {
          this.resultAllFeedBackDetails = [];
          this.toastrService.error("Data is not available");
        } else {
          this.toastrService.error("Please try again something went wrong");
        }
      }
    })
  }

  sendData(data:any, flag:any){
    debugger;
    if(data == "" || data == null){
      this.toastrService.error("Action taken field is required");
    }else{
      // this.globalFeedbackStatus = ""
      // this.globalFeedbackStatus = ""
      this.callAPIService.setHttp('get', 'InsertFeebackReply_Web_1_0?UserId=' + this.commonService.loggedInUserId() + '&FeedbackId=' + data+'&Replymessage='+data+'&FeedbackStatus='+this.globalFeedbackStatus, false, false, false, 'ncpServiceForWeb');
      this.callAPIService.getHttp().subscribe((res: any) => {
        if (res.data == 0) {
          this.defualtHideFeedback = true;
          this.spinner.hide();
          this.resultAllFeedBackDetails = res.data1;
        } else {
          this.defualtHideFeedback = false;
          this.spinner.hide();
          if (res.data == 1) {
            this.toastrService.error("Data is not available");
          } else {
            this.toastrService.error("Please try again something went wrong");
          }
        }
      })
    }
  }
}
