import { Component, OnInit } from '@angular/core';
import { CallAPIService } from 'src/app/services/call-api.service';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from '../../services/common.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgxSpinnerService } from "ngx-spinner";
@Component({
  selector: 'app-social-media-messages',
  templateUrl: './social-media-messages.component.html',
  styleUrls: ['./social-media-messages.component.css', '../partial.component.css']
})
export class SocialMediaMessagesComponent implements OnInit {

  paginationNo: number = 1;
  total: any;
  pageSize: number = 10;
  viewMembersObj: any = { DistrictId: 0, Talukaid: 0, villageid: 0, SearchText: '' }
  filterForm!: FormGroup;
  allDistrictArray: any;
  socialMediaArray: any;
  memberNameArray: any;
  socialMediaMessagesArray: any;
  socialMediaDetailsArray: any;
  lat: any = 19.75117687556874;
  lng: any = 75.71630325927731;
  zoom: any = 12;
  socialMediaDetailsImageArray: any;

  constructor(
    private callAPIService: CallAPIService,
    private spinner: NgxSpinnerService,
    private toastrService: ToastrService,
    private commonService: CommonService,
    private fb: FormBuilder,
  ) { }

  ngOnInit(): void {
    this.defaultFilterForm();
    this.getDistrict();
    this.getMemberName();
    this.getSocialMedia();
    this.GetSocialMediaMessages();
    //this.getSocialMediaDetails();
  }

  defaultFilterForm() {
    this.filterForm = this.fb.group({
      memberName: ['0'],
      district: ['0'],
      mediaSource: ['0'],
    })
  }

  GetSocialMediaMessages() {
    this.spinner.show();  
    let formData=this.filterForm.value;
    let obj = 'Districtid=' + formData.district + '&MediaType=' + formData.mediaSource + '&nopage=' + this.paginationNo + '&MemberId=' + formData.memberName
    this.callAPIService.setHttp('get', 'GetSocialMediaMessages_Web_1_0?' + obj, false, false, false, 'ncpServiceForWeb');
    this.callAPIService.getHttp().subscribe((res: any) => {
      if (res.data == 0) {
        this.spinner.hide();
        this.socialMediaMessagesArray = res.data1;
        this.total = res.data2[0].TotalCount;
      } else {
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

  getMemberName() {
    this.spinner.show();    
    this.callAPIService.setHttp('get', 'GetMemberddl_Web_1_0?UserId=' + this.commonService.loggedInUserId(), false, false, false, 'ncpServiceForWeb');
    this.callAPIService.getHttp().subscribe((res: any) => {
      if (res.data == 0) {
        this.spinner.hide();
        this.memberNameArray = res.data1;
      } else {
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

  getDistrict() {
    this.spinner.show();    
    this.callAPIService.setHttp('get', 'Web_GetDistrict_1_0?StateId=' + 1, false, false, false, 'ncpServiceForWeb');
    this.callAPIService.getHttp().subscribe((res: any) => {
      if (res.data == 0) {
        this.spinner.hide();
        this.allDistrictArray = res.data1;
      } else {
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

  getSocialMedia() {
    this.spinner.show();    
    this.callAPIService.setHttp('get', 'GetSocialMediaddl_Web_1_0?UserId=' + this.commonService.loggedInUserId(), false, false, false, 'ncpServiceForWeb');
    this.callAPIService.getHttp().subscribe((res: any) => {
      if (res.data == 0) {
        this.spinner.hide();
        this.socialMediaArray = res.data1;
      } else {
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

  getSocialMediaDetails(id:any) {
    this.spinner.show();    
    this.callAPIService.setHttp('get', 'GetSocialMediaMessage_Details_Web_1_0?UserId=' + this.commonService.loggedInUserId() +'&Id=' + id, false, false, false, 'ncpServiceForWeb');
    this.callAPIService.getHttp().subscribe((res: any) => {
      if (res.data == 0) {
        this.spinner.hide();
        this.socialMediaDetailsArray = res.data1[0];
        this.socialMediaDetailsImageArray = res.data2;
        let socialMediaDetailsLatLongArray = res.data3[0];
        this.lat = socialMediaDetailsLatLongArray.Latitude;
       this.lng = socialMediaDetailsLatLongArray.Longitude;
      } else {
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

  onClickPagintion(pageNo: number) {
    this.paginationNo = pageNo;
    this.GetSocialMediaMessages()
  }

}
