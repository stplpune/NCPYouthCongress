import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { CallAPIService } from 'src/app/services/call-api.service';
import { CommonService } from 'src/app/services/common.service';
import { debounceTime } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { AddMemberComponent } from '../../dialogs/add-member/add-member.component';
import { MatDialog } from '@angular/material/dialog';
import { UserBlockUnblockComponent } from '../../dialogs/user-block-unblock/user-block-unblock.component';
@Component({
  selector: 'app-executive-members',
  templateUrl: './executive-members.component.html',
  styleUrls: ['./executive-members.component.css', '../../partial.component.css']
})
export class ExecutiveMembersComponent implements OnInit {
  public items: string[] = [];
  allDistrict: any;
  getTalkaByDistrict: any;
  resultVillageOrCity: any;
  resultAllExeMembers: any;
  paginationNo: number = 1;
  total: any;
  pageSize: number = 10;
  globalBodyId: number = 0;
  // viewMembersObj: any = { DistrictId: 0, Talukaid: 0, villageid: 0, SearchText: '', BodyId: 0 }
  // clearMemberObj: any = { DistrictId: 0, Talukaid: 0, villageid: 0, SearchText: '', BodyId: 0 }
  filterForm!: FormGroup;
  memberNameArray: any;
  memberCountData: any;
  subject: Subject<any> = new Subject();
  result: any;
  highlightedRow: number = 0;
  memberStatusArray = [{ id: 0, name: "All" } ,{ id: 1, name: "Active" }, { id: 2, name: "Non Active" }];
  DeviceAppArray = [{ id: 0, name: "All" },{ id: 1, name: "Android" }, { id: 2, name: "iOS" } , { id: 3, name: "No Device" }];
  activeInactiveId: any;

  constructor(private fb: FormBuilder, private callAPIService: CallAPIService,
    private spinner: NgxSpinnerService, public dialog: MatDialog,
    private toastrService: ToastrService, private router: Router, private route: ActivatedRoute,
    private commonService: CommonService, public datepipe: DatePipe,) {
      let getsessionStorageData: any = sessionStorage.getItem('activeInactiveId');
      this.activeInactiveId = JSON.parse(getsessionStorageData);
     }

  ngOnInit(): void {
    this.getMemberName();
    this.getDistrict();
    this.defaultFilterForm();
    this.getViewMembers();
    this.searchFilter('false');
  }

  defaultFilterForm() {
    this.filterForm = this.fb.group({
      DistrictId: [0],
      TalukaId: [0],
      villageid: [0],
      BodyId: [0],
      memberStatus: ['' || this.activeInactiveId],
      deviceStatus: [''],
      searchText: ['']
    })
  }

  getDistrict() {
    this.spinner.show();
    this.callAPIService.setHttp('get', 'Web_GetDistrict_1_0_HaveMemberFilter?StateId=' + 1+'&UserId='+this.commonService.loggedInUserId(), false, false, false, 'ncpServiceForWeb');
    this.callAPIService.getHttp().subscribe((res: any) => {
      if (res.data == 0) {
        this.spinner.hide();
        this.allDistrict = res.data1;
      } else {
        this.toastrService.error("Data is not available 2");
      }
    }, (error: any) => {
      if (error.status == 500) {
        this.router.navigate(['../../500'], { relativeTo: this.route });
      }
    })
  }

  getTaluka(districtId: any) {
    this.spinner.show();
    this.callAPIService.setHttp('get', 'Web_GetTaluka_1_0?DistrictId=' + districtId, false, false, false, 'ncpServiceForWeb');
    this.callAPIService.getHttp().subscribe((res: any) => {
      if (res.data == 0) {
        this.spinner.hide();
        this.getTalkaByDistrict = res.data1;
      } else {
        //this.toastrService.error("Data is not available");
      }
    }, (error: any) => {
      if (error.status == 500) {
        this.router.navigate(['../../500'], { relativeTo: this.route });
      }
    })
  }

  getMemberName() {
    this.spinner.show();
    this.callAPIService.setHttp('get', 'Web_GetBodyOrgCellName_1_0_Committee?UserId=' + this.commonService.loggedInUserId(), false, false, false, 'ncpServiceForWeb'); // old API Web_GetBodyOrgCellName_1_0
    this.callAPIService.getHttp().subscribe((res: any) => {
      if (res.data == 0) {
        this.spinner.hide();
        this.memberNameArray = res.data1;
      } else {
        //this.toastrService.error("Data is not available");
      }
    }, (error: any) => {
      if (error.status == 500) {
        this.router.navigate(['../../500'], { relativeTo: this.route });
      }
    })
  }

  getVillageOrCity(talukaID: any) {
    this.callAPIService.setHttp('get', 'Web_GetVillage_1_0?talukaid=' + talukaID, false, false, false, 'ncpServiceForWeb');
    this.callAPIService.getHttp().subscribe((res: any) => {
      if (res.data == 0) {
        this.spinner.hide();
        this.resultVillageOrCity = res.data1;

      } else {
        this.toastrService.error("Data is not available1");
      }
    }, (error: any) => {
      if (error.status == 500) {
        this.router.navigate(['../../500'], { relativeTo: this.route });
      }
    })
  }

  ngOnDestroy() {
    sessionStorage.removeItem('activeInactiveId');
  }

  getViewMembers() {
    this.spinner.show();
    let formdata = this.filterForm.value;
    (formdata.DistrictId == undefined || formdata.DistrictId == null) ? formdata.DistrictId = 0 : formdata.DistrictId;
    (formdata.Talukaid == undefined || formdata.Talukaid == null) ? formdata.Talukaid = 0 : formdata.Talukaid;
    (formdata.villageid == undefined || formdata.villageid == null) ? formdata.villageid = 0 : formdata.villageid;
    (formdata.SearchText == undefined || formdata.SearchText == null) ? formdata.SearchText = '' : formdata.SearchText;
    (formdata.BodyId == undefined || formdata.BodyId == null) ? formdata.BodyId = 0 : formdata.BodyId;
    (formdata.memberStatus == undefined || formdata.memberStatus == null || formdata.memberStatus == '') ? formdata.memberStatus = 0 : formdata.memberStatus;
    (formdata.deviceStatus == undefined || formdata.deviceStatus == null || formdata.deviceStatus == '') ? formdata.deviceStatus = 0 : formdata.deviceStatus;
    // formdata.memberStatus == '' ? formdata.memberStatus = 0 : formdata.memberStatus;
    // formdata.deviceStatus == '' ? formdata.deviceStatus = 0 : formdata.deviceStatus;
    this.callAPIService.setHttp('get', 'Web_ExcecutiveMembers_Web_2_0?UserId=' + this.commonService.loggedInUserId() + '&DistrictId=' + formdata.DistrictId + '&Talukaid=' + formdata.Talukaid + '&villageid=0&SearchText=' + formdata.SearchText + '&PageNo=' + this.paginationNo + '&BodyId=' + formdata.BodyId 
    + '&statustypeId=' + formdata.memberStatus + '&DeviceTypeId=' + formdata.deviceStatus, false, false, false, 'ncpServiceForWeb');
    this.callAPIService.getHttp().subscribe((res: any) => {
      if (res.data == 0) {
        this.spinner.hide();
        this.resultAllExeMembers = res.data1;
        this.total = res.data2[0].TotalCount;
        this.memberCountData = res.data3[0];
      } else {
        this.spinner.hide();
        if (res.data == 1) {
          this.resultAllExeMembers = [];
          // //this.toastrService.error("Data is not available");
        } else {
          this.toastrService.error("Please try again something went wrong");
        }
      }
    }, (error: any) => {
      if (error.status == 500) {
        this.router.navigate(['../../500'], { relativeTo: this.route });
      }
    })
  }

  onClickPagintion(pageNo: number) {
    this.paginationNo = pageNo;
    this.getViewMembers()
  }

  filter(event: any) {
    this.paginationNo = 1;
    this.getViewMembers();
  }

//   clearFilter(flag: any) {
//     this.paginationNo = 1;
// console.log(this.filterForm.value)
//    // this.getViewMembers(this.filterForm.value)
//   }

  clearFilter(flag: any) {
    if (flag == 'committee') {
      this.filterForm.controls['BodyId'].setValue(0);
    } else if (flag == 'district') {
      this.filterForm.controls['DistrictId'].setValue(0);
    } else if (flag == 'search') {
      this.filterForm.controls['searchText'].setValue('');
    } else if (flag == 'MemberStatus') {
      this.filterForm.controls['memberStatus'].setValue('');
      sessionStorage.removeItem('activeInactiveId');
    } else if (flag == 'DeviceStatus') {
      this.filterForm.controls['deviceStatus'].setValue('');
    }
    this.paginationNo = 1;
    this.getViewMembers()
  }

  searchFilter(flag: any) {
    if (flag == 'true') {
      if (this.filterForm.value.searchText == "" || this.filterForm.value.searchText == null) {
        this.toastrService.error("Please search and try again");
        return
      }
    }
    this.subject
      .pipe(debounceTime(700))
      .subscribe(() => {
        this.filterForm.value.SearchText = this.filterForm.value.searchText;
        this.getViewMembers()
      }
      );
  }

  onKeyUpFilter() {
    this.subject.next();
  }

  redToMemberProfile(memberId: any, FullName: any) {
    let obj = { 'memberId': memberId, 'FullName': FullName }
    sessionStorage.setItem('memberId', JSON.stringify(obj));
    this.router.navigate(['../profile'], { relativeTo: this.route })
  }

  refresh() {
    this.activeInactiveId = '';
    this.defaultFilterForm();
    let obj = { DistrictId: 0, Talukaid: 0, villageid: 0, SearchText: '', BodyId: 0 }
    this.getViewMembers();
  }

  addEditMember(flag: any, id: any) {
    this.highlightedRow = id
    let obj = { "formStatus": flag, 'Id': id }
    const dialogRef = this.dialog.open(AddMemberComponent, {
      width: '1024px',
      data: obj
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result == 'Yes' || result == 'No') {
        this.getViewMembers();
      }
    });
  }

  blockUnblockUserModal(flag: any, id: any) {
    const dialogRef = this.dialog.open(UserBlockUnblockComponent, {
      width: '1024px',
      data: flag
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result == 'Yes') {
        //  this.filterForm.controls['BodyId'].setValue('');
        this.blockUnblockUser(flag, id);
      } else if (result == 'No') {
        //  this.filterForm.controls['BodyId'].setValue('');
        this.getViewMembers();
      }
    });
  }

  blockUnblockUser(blockStatus: any, memberId: number) {
    let checkBlockStatus!: number;
    blockStatus == 1 ? checkBlockStatus = 0 : checkBlockStatus = 1;
    this.spinner.show();
    this.callAPIService.setHttp('get', 'Web_BlockUser?MemberId=' + memberId + '&BlockStatus=' + checkBlockStatus + '&Createdby=' + this.commonService.loggedInUserId(), false, false, false, 'ncpServiceForWeb');
    this.callAPIService.getHttp().subscribe((res: any) => {
      if (res.data == 0) {
        this.spinner.hide();
        this.toastrService.success(res.data1[0].Msg);
        this.getViewMembers();
      } else {
        // //this.toastrService.error("Data is not available");
      }
    }, (error: any) => {
      if (error.status == 500) {
        this.router.navigate(['../../500'], { relativeTo: this.route });
      }
    })
  }
}
