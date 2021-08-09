import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { CallAPIService } from 'src/app/services/call-api.service';
import { CommonService } from 'src/app/services/common.service';
import { debounceTime } from 'rxjs/operators';
import { Subject } from 'rxjs';

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
  memberCountData:any;

  viewMembersObj:any = { DistrictId: 0, Talukaid: 0, villageid: 0, SearchText:''}
  filterForm!: FormGroup;
  subject: Subject<any> = new Subject();

  constructor(private fb: FormBuilder, private callAPIService: CallAPIService,
    private spinner: NgxSpinnerService,
    private toastrService: ToastrService, private router: Router,
    private commonService: CommonService, public datepipe: DatePipe,) { }

  ngOnInit(): void {
    this.getViewMembers(this.viewMembersObj);
    this.getDistrict();
    this.defaultFilterForm();
    this.searchFilter('false');
  }

  defaultFilterForm() {
    this.filterForm = this.fb.group({
      DistrictId: [''],
      TalukaId: [''],
      VillageId: [''],
      searchText:['']
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
    this.viewMembersObj.DistrictId = districtId
    this.getViewMembers(this.viewMembersObj);

    this.spinner.show();
    this.callAPIService.setHttp('get', 'Web_GetTaluka_1_0?DistrictId=' + districtId, false, false, false, 'ncpServiceForWeb');
    this.callAPIService.getHttp().subscribe((res: any) => {
      if (res.data == 0) {
        this.spinner.hide();
        this.getTalkaByDistrict = res.data1;
        console.log(this.getTalkaByDistrict)
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
    this.viewMembersObj.Talukaid = talukaID
    this.getViewMembers(this.viewMembersObj);
    
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

  filterVillage(villageId: any){
    this.viewMembersObj.villageid = villageId
    this.getViewMembers(this.viewMembersObj);
  }

  getViewMembers(viewMembersObj: any) {
    (viewMembersObj.DistrictId == undefined || viewMembersObj.DistrictId  == null) ? viewMembersObj.DistrictId = 0 :   viewMembersObj.DistrictId;  
    (viewMembersObj.Talukaid == undefined || viewMembersObj.DistrictId  == null) ? viewMembersObj.Talukaid = 0 :   viewMembersObj.Talukaid;  
    (viewMembersObj.villageid == undefined || viewMembersObj.DistrictId  == null) ? viewMembersObj.villageid = 0 :   viewMembersObj.villageid;  
    this.spinner.show();
    this.callAPIService.setHttp('get', 'ViewMembers_Web_1_0?UserId=' + this.commonService.loggedInUserId() + '&DistrictId=' + viewMembersObj.DistrictId + '&Talukaid=' + viewMembersObj.Talukaid + '&villageid=' + viewMembersObj.villageid + '&SearchText=' + viewMembersObj.SearchText + '&PageNo=' + this.paginationNo, false, false, false, 'ncpServiceForWeb');
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
          // this.toastrService.error("Data is not available");
        } else {
          this.toastrService.error("Please try again something went wrong");
        }
      }
    })
  }

  onClickPagintion(pageNo: number) {
    console.log(pageNo);
    this.paginationNo = pageNo;
    this.getViewMembers(this.viewMembersObj)
  }

  districtClear(flag: any) {
    if (flag == 'district') {
      this.viewMembersObj = { DistrictId: 0, Talukaid: 0, villageid: 0, SearchText: '' }
      this.filterForm.reset();
    } else if (flag == 'taluka') {
      this.filterForm.reset({ DistrictId: this.viewMembersObj.DistrictId});
      this.viewMembersObj = { 'DistrictId': this.viewMembersObj.DistrictId, 'TalukaId': this.filterForm.value.TalukaId, 'VillageId': this.filterForm.value.VillageId, SearchText:'' }
    } 
    else if (flag == 'village') {
      this.filterForm.reset({
        VillageId: 0
      });
      this.viewMembersObj = { 'DistrictId': this.viewMembersObj.DistrictId, 'TalukaId': this.filterForm.value.TalukaId, 'VillageId': this.filterForm.value.VillageId }
    }else if (flag == 'search') {
      this.viewMembersObj.SearchText = "";
      this.filterForm.controls['searchText'].setValue('');
    }
    this.getViewMembers(this.viewMembersObj)
  }

  // searchFilter(){
  //   if(this.filterForm.value.searchText == "" || this.filterForm.value.searchText == null){
  //     this.toastrService.error("Please search and try again");
  //     return
  //   }
  //   this.viewMembersObj.SearchText = this.filterForm.value.searchText
  //   this.getViewMembers(this.viewMembersObj)
  // }

  searchFilter(flag:any) {
    if(flag == 'true'){
      if(this.filterForm.value.searchText == "" || this.filterForm.value.searchText == null){
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

  onKeyUpFilter(){
    this.subject.next();
  }


}
