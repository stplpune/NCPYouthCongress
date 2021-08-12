import { Component, OnInit } from '@angular/core';
import { CallAPIService } from 'src/app/services/call-api.service';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from '../../services/common.service';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { NgxSpinnerService } from "ngx-spinner";
import { DateTimeAdapter } from 'ng-pick-datetime';
import { DatePipe, Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
@Component({
  selector: 'app-social-media-person',
  templateUrl: './social-media-person.component.html',
  styleUrls: ['./social-media-person.component.css', '../partial.component.css']
})
export class SocialMediaPersonComponent implements OnInit {

  dateTime = new FormControl();
  fromDateWorkdetails: any = "";
  toDateWorkdetails: any = "";
  defaultCloseBtn: boolean = false;
  globalFromDate: any = "";
  globalToDate: any = "";
  socialMediaMessagesPersonArray: any;
  PersonName: any;
  MemberMobileNo: any;
  paginationNo: number = 1;
  total: any;
  pageSize: number = 10;
  getDatabyPersonId: any;

  constructor(
    private callAPIService: CallAPIService,
    private spinner: NgxSpinnerService,
    private toastrService: ToastrService,
    private commonService: CommonService,
    public datepipe: DatePipe,
    public location: Location,
    private route: ActivatedRoute,
    private router: Router,
    public dateTimeAdapter: DateTimeAdapter<any>,
  ) { { dateTimeAdapter.setLocale('en-IN'); }

  let getLocalStorageData: any = localStorage.getItem('SocialMediaDataPM');
  let localStorageData = JSON.parse(getLocalStorageData);
  this.PersonName = localStorageData.PersonName;
  this.MemberMobileNo = localStorageData.MemberMobileNo;
}

  ngOnInit(): void {
    this.getSocialMediaMessagesPerson();
  }

  getRage(value: any) {
    this.defaultCloseBtn = true;
    this.fromDateWorkdetails = this.datepipe.transform(value.value[0], 'dd/MM/YYYY');
    this.globalFromDate = this.datepipe.transform(value.value[0], 'dd/MM/YYYY');
    this.toDateWorkdetails = this.datepipe.transform(value.value[1], 'dd/MM/YYYY');
    this.globalToDate = this.datepipe.transform(value.value[1], 'dd/MM/YYYY');
    this.getSocialMediaMessagesPerson();
    // this.getMemberprofileDetails();
  }

  clearValue() {
    this.defaultCloseBtn = false;
    this.fromDateWorkdetails = "";
    this.toDateWorkdetails = "";
    this.getSocialMediaMessagesPerson();
    // this.getMemberprofileDetails();
    this.dateTime.setValue(null);
  }


  getSocialMediaMessagesPerson() {
    this.spinner.show();
    let mob='';
    let obj = 'MobileNo=' + mob + '&nopage=' + this.paginationNo + '&FromDate=' + this.globalFromDate + '&ToDate=' + this.globalToDate
    this.callAPIService.setHttp('get', 'Web_GetSocialMediaMessages_Person_Profile?' + obj, false, false, false, 'ncpServiceForWeb');
    this.callAPIService.getHttp().subscribe((res: any) => {
      if (res.data == 0) {
        this.spinner.hide();
        this.socialMediaMessagesPersonArray = res.data1;
        this.total = res.data2[0].TotalCount;
      } else {
        this.toastrService.error("Data is not available");
      }
    }, (error: any) => {
      if (error.status == 500) {
        this.router.navigate(['../500'], { relativeTo: this.route });
      }
    })
  }

  getSocialMediaPersonDataById(index:any) {
    this.getDatabyPersonId=this.socialMediaMessagesPersonArray[index];
  }

  onClickPagintion(pageNo: number) {
    this.paginationNo = pageNo;
    this.getSocialMediaMessagesPerson()
  }

  ngOnDestroy() {
    localStorage.removeItem('SocialMediaDataPM');
  }

}
