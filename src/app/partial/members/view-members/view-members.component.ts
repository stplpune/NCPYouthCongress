import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { CallAPIService } from 'src/app/services/call-api.service';
import { CommonService } from 'src/app/services/common.service';
import { debounceTime } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { AddMemberComponent } from '../../dialogs/add-member/add-member.component';
import { MatDialog } from '@angular/material/dialog';
import { UserBlockUnblockComponent } from '../../dialogs/user-block-unblock/user-block-unblock.component';

@Component({
  selector: 'app-view-members',
  templateUrl: './view-members.component.html',
  styleUrls: ['./view-members.component.css', '../../partial.component.css']
})
export class ViewMembersComponent implements OnInit {
  public items: string[] = [];
  allDistrict: any;
  getTalkaByDistrict: any;
  resultVillageOrCity: any;
  resultAllViewMembers: any;
  paginationNo: number = 1;
  total: any;
  pageSize: number = 10;
  memberCountData: any;
  highlightedRow:number = 0;

  // viewMembersObj: any = { DistrictId: 0, Talukaid: 0, villageid: 0, SearchText: '' }
  filterForm!: FormGroup;
  subject: Subject<any> = new Subject();

  memberStatusArray = [{ id: 0, name: "All" } ,{ id: 1, name: "Active" }, { id: 2, name: "Non Active" }];
  DeviceVersionArray = [{ id: 0, name: "All" } ,{ id: 1, name: "New" }, { id: 2, name: "Old" }];
  DeviceAppArray = [{ id: 0, name: "All" },{ id: 1, name: "Android" }, { id: 2, name: "iOS" } , { id: 3, name: "No Device" }];

  constructor(private fb: FormBuilder, private callAPIService: CallAPIService,
    private spinner: NgxSpinnerService,
    private toastrService: ToastrService, private router: Router,
    private commonService: CommonService, public datepipe: DatePipe,
    private route: ActivatedRoute, public dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    this.defaultFilterForm();
    this.getDistrict();
    this.getViewMembers();
    this.searchFilter('false');
  }

  defaultFilterForm() {
    this.filterForm = this.fb.group({
      DistrictId: [0],
      TalukaId: [0],
      VillageId: [0],
      searchText: [''],
      memberStatus: [''],
      deviceStatus: [''],
      deviceVersion: ['']
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

  // getTaluka(districtId: any) {
  //   this.viewMembersObj.DistrictId = districtId;
  //   this.getViewMembers(this.viewMembersObj);

  //   this.spinner.show();
  //   this.callAPIService.setHttp('get', 'Web_GetTaluka_1_0?DistrictId=' + districtId, false, false, false, 'ncpServiceForWeb');
  //   this.callAPIService.getHttp().subscribe((res: any) => {
  //     if (res.data == 0) {
  //       this.spinner.hide();
  //       this.getTalkaByDistrict = res.data1;
  //     } else {
  //       //this.toastrService.error("Data is not available");
  //     }
  //   }, (error: any) => {
  //     if (error.status == 500) {
  //       this.router.navigate(['../../500'], { relativeTo: this.route });
  //     }
  //   })
  // }

  // getVillageOrCity(talukaID: any) {
  //   this.viewMembersObj.Talukaid = talukaID;
  //   this.getViewMembers(this.viewMembersObj);

  //   this.callAPIService.setHttp('get', 'Web_GetVillage_1_0?talukaid=' + talukaID, false, false, false, 'ncpServiceForWeb');
  //   this.callAPIService.getHttp().subscribe((res: any) => {
  //     if (res.data == 0) {
  //       this.spinner.hide();
  //       this.resultVillageOrCity = res.data1;

  //     } else {
  //       this.toastrService.error("Data is not available1");
  //     }
  //   }, (error: any) => {
  //     if (error.status == 500) {
  //       this.router.navigate(['../../500'], { relativeTo: this.route });
  //     }
  //   })
  // }

  filter() {
    this.paginationNo = 1;
    this.getViewMembers();
  }

  cardFilterData(status:any,flag:any){
    if(status == "memStatusFlag"){
      this.filterForm.controls['memberStatus'].setValue(flag);
      this.getViewMembers();
    }else 
    if(status =='diviceFlag'){
      this.filterForm.controls['deviceStatus'].setValue(flag);
      this.getViewMembers();
    }
  }

  getViewMembers() {
    this.spinner.show();
    let formdata = this.filterForm.value;
    (formdata.DistrictId == undefined || formdata.DistrictId == null) ? formdata.DistrictId = 0 : formdata.DistrictId;
    (formdata.Talukaid == undefined || formdata.Talukaid == null) ? formdata.Talukaid = 0 : formdata.Talukaid;
    (formdata.villageid == undefined || formdata.villageid == null) ? formdata.villageid = 0 : formdata.villageid;
    (formdata.SearchText == undefined || formdata.SearchText == null) ? formdata.SearchText = '' : formdata.SearchText;
    (formdata.memberStatus == undefined || formdata.memberStatus == null || formdata.memberStatus == '') ? formdata.memberStatus = 0 : formdata.memberStatus;
    (formdata.deviceVersion == undefined || formdata.deviceVersion == null || formdata.deviceVersion == '') ? formdata.deviceVersion = 0 : formdata.deviceVersion;
    (formdata.deviceStatus == undefined || formdata.deviceStatus == null || formdata.deviceStatus == '') ? formdata.deviceStatus = 0 : formdata.deviceStatus;
    this.callAPIService.setHttp('get', 'ViewMembers_Web_2_0?UserId=' + this.commonService.loggedInUserId() + '&DistrictId=' + formdata.DistrictId + '&Talukaid=' + formdata.Talukaid + '&villageid=' + formdata.villageid + '&SearchText=' + formdata.SearchText + '&PageNo=' + this.paginationNo 
    + '&StatustypeId=' + formdata.memberStatus + '&DeviceTypeId=' + formdata.deviceStatus + '&Version_Status=' + formdata.deviceVersion, false, false, false, 'ncpServiceForWeb');
    this.callAPIService.getHttp().subscribe((res: any) => {
      if (res.data == 0) {
        this.spinner.hide();
        this.resultAllViewMembers = res.data1;
        this.total = res.data2[0].TotalCount;
        this.memberCountData = res.data3[0];

      } else {
        this.spinner.hide();
        if (res.data == 1) {
          this.resultAllViewMembers = [];
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
    this.getViewMembers();
  }

  // districtClear(flag: any) {
  //   if (flag == 'district') {
  //     this.viewMembersObj = { DistrictId: 0, Talukaid: 0, villageid: 0, SearchText: '' }
  //     this.filterForm.reset();
  //   } else if (flag == 'taluka') {
  //     this.filterForm.reset({ DistrictId: this.viewMembersObj.DistrictId });
  //     this.viewMembersObj = { 'DistrictId': this.viewMembersObj.DistrictId, 'TalukaId': this.filterForm.value.TalukaId, 'VillageId': this.filterForm.value.VillageId, SearchText: '' }
  //   }
  //   else if (flag == 'village') {
  //     this.filterForm.reset({
  //       VillageId: 0
  //     });
  //     this.viewMembersObj = { 'DistrictId': this.viewMembersObj.DistrictId, 'TalukaId': this.filterForm.value.TalukaId, 'VillageId': this.filterForm.value.VillageId }
  //   } else if (flag == 'search') {
  //     this.viewMembersObj.SearchText = "";
  //     this.filterForm.controls['searchText'].setValue('');
  //   }
  //   this.getViewMembers(this.viewMembersObj);
  // }

  clearFilter(flag: any) {
  if (flag == 'district') {
      this.filterForm.controls['DistrictId'].setValue(0);
    } else if (flag == 'search') {
      this.filterForm.controls['searchText'].setValue('');
    } else if (flag == 'MemberStatus') {
      this.filterForm.controls['memberStatus'].setValue('');
    } else if (flag == 'DeviceStatus') {
      this.filterForm.controls['deviceStatus'].setValue('');
    } else if (flag == 'DeviceVersion') {
      this.filterForm.controls['deviceVersion'].setValue('');
    }
    this.paginationNo = 1;
    this.getViewMembers();
  }

  addEditMember(flag:any,id:any) {
    this.highlightedRow = id
    let obj = {"formStatus":flag, 'Id':id}
    const dialogRef = this.dialog.open(AddMemberComponent, {
      width: '1024px',
      data: obj
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result == 'Yes' || result == 'No') {
        //let obj = { DistrictId: 0, Talukaid: 0, villageid: 0, SearchText: '' }
        this.getViewMembers();
      }
    });
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
        this.getViewMembers();
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

  blockUnblockUserModal(flag:any,id:any) {
    const dialogRef = this.dialog.open(UserBlockUnblockComponent, {
      width: '1024px',
      data:flag
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result == 'Yes') {
        this.blockUnblockUser(flag,id);
      }else if (result == 'No'){
        //let obj = { DistrictId: 0, Talukaid: 0, villageid: 0, SearchText: '', BodyId: 0 }
        this.getViewMembers();
      }
    });
  }

  blockUnblockUser(blockStatus:any,memberId:number) {
    let checkBlockStatus!:number;
    blockStatus == 1 ? checkBlockStatus = 0 : checkBlockStatus = 1;
    this.spinner.show();
    this.callAPIService.setHttp('get', 'Web_BlockUser?MemberId=' + memberId + '&BlockStatus=' + checkBlockStatus + '&Createdby=' + this.commonService.loggedInUserId(), false, false, false, 'ncpServiceForWeb');
    this.callAPIService.getHttp().subscribe((res: any) => {
      if (res.data == 0) {
        this.spinner.hide();
        this.toastrService.success(res.data1[0].Msg);
        // let obj = { DistrictId: 0, Talukaid: 0, villageid: 0, SearchText: '', BodyId: 0 }
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
