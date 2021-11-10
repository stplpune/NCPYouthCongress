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
  viewMembersObj: any = { DistrictId: 0, Talukaid: 0, villageid: 0, SearchText: '', BodyId: 0 }
  clearMemberObj: any = { DistrictId: 0, Talukaid: 0, villageid: 0, SearchText: '', BodyId: 0 }
  filterForm!: FormGroup;
  memberNameArray: any;
  memberCountData: any;
  subject: Subject<any> = new Subject();
  result: any;
  highlightedRow:number = 0;

  constructor(private fb: FormBuilder, private callAPIService: CallAPIService,
    private spinner: NgxSpinnerService, public dialog: MatDialog,
    private toastrService: ToastrService, private router: Router, private route: ActivatedRoute,
    private commonService: CommonService, public datepipe: DatePipe,) { }

  ngOnInit(): void {
    this.getMemberName();
    this.getViewMembers(this.viewMembersObj);
    this.getDistrict();
    this.defaultFilterForm();
    this.searchFilter('false');
  }

  defaultFilterForm() {
    this.filterForm = this.fb.group({
      DistrictId: [''],
      TalukaId: [''],
      BodyId: [''],
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
        this.toastrService.error("Data is not available 2");
      }
    }, (error: any) => {
      if (error.status == 500) {
        this.router.navigate(['../../500'], { relativeTo: this.route });
      }
    })
  }

  getTaluka(districtId: any) {
    this.viewMembersObj.DistrictId = districtId
    this.getViewMembers(this.viewMembersObj);

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
    this.viewMembersObj.Talukaid = talukaID
    this.getViewMembers(this.viewMembersObj);

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

  filterVillage(villageId: any) {
    this.viewMembersObj.villageid = villageId
    this.getViewMembers(this.viewMembersObj);
  }

  getViewMembers(viewMembersObj: any) {
    (viewMembersObj.DistrictId == undefined || viewMembersObj.DistrictId == null) ? viewMembersObj.DistrictId = 0 : viewMembersObj.DistrictId;
    (viewMembersObj.Talukaid == undefined || viewMembersObj.DistrictId == null) ? viewMembersObj.Talukaid = 0 : viewMembersObj.Talukaid;
    (viewMembersObj.villageid == undefined || viewMembersObj.DistrictId == null) ? viewMembersObj.villageid = 0 : viewMembersObj.villageid;
    this.spinner.show();
    this.callAPIService.setHttp('get', 'ExcecutiveMembers_Web_1_0?UserId=' + this.commonService.loggedInUserId() + '&DistrictId=' + viewMembersObj.DistrictId + '&Talukaid=' + viewMembersObj.Talukaid + '&villageid=0&SearchText=' + viewMembersObj.SearchText + '&PageNo=' + this.paginationNo + '&BodyId=' + viewMembersObj.BodyId, false, false, false, 'ncpServiceForWeb');
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
    this.getViewMembers(this.viewMembersObj)
  }

  committee(event: any) {
    this.viewMembersObj = { BodyId: event, DistrictId: 0, Talukaid: 0, villageid: 0, SearchText: '' }
    this.getViewMembers(this.viewMembersObj);
  }

  clearFilter(flag: any) {
    if (flag == 'committee') {
      this.viewMembersObj = { BodyId: 0, DistrictId: 0, Talukaid: 0, villageid: 0, SearchText: '' }
      this.filterForm.reset();
    }
    else if (flag == 'district') {
      this.viewMembersObj = { BodyId: this.viewMembersObj.BodyId, DistrictId: 0, Talukaid: 0, villageid: 0, SearchText: '', }
      this.filterForm.reset({
        BodyId: this.viewMembersObj.BodyId,
        DistrictId: 0,
        Talukaid: 0,
        VillageId: 0
      });
    } else if (flag == 'taluka') {
      this.filterForm.reset({
        BodyId: this.viewMembersObj.BodyId,
        DistrictId: this.viewMembersObj.DistrictId
      });
      this.viewMembersObj = { BodyId: this.viewMembersObj.BodyId, 'DistrictId': this.viewMembersObj.DistrictId, 'TalukaId': this.filterForm.value.TalukaId, 'VillageId': this.filterForm.value.VillageId, SearchText: '' }
    }
    // else if (flag == 'village') {
    //   this.filterForm.reset({
    //     VillageId: 0
    //   });
    //   this.viewMembersObj = {BodyId:this.viewMembersObj.BodyId, 'DistrictId': this.viewMembersObj.DistrictId, 'TalukaId': this.filterForm.value.TalukaId, 'VillageId': this.filterForm.value.VillageId }
    // } 
    else if (flag == 'search') {
      this.viewMembersObj.SearchText = "";
      this.filterForm.controls['searchText'].setValue('');
    }
    this.getViewMembers(this.viewMembersObj)
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
        this.viewMembersObj.SearchText = this.filterForm.value.searchText;
        this.getViewMembers(this.viewMembersObj)
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
    this.defaultFilterForm();
    let obj = { DistrictId: 0, Talukaid: 0, villageid: 0, SearchText: '', BodyId: 0 }
    this.getViewMembers(obj);
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
        this.getViewMembers(this.clearMemberObj);
      }
    });
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
        this.getViewMembers(this.clearMemberObj);
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
        this.getViewMembers(this.clearMemberObj);
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
