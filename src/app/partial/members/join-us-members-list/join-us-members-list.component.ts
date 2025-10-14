import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { NgxSelectModule } from 'ngx-select-ex';
import { NgxSpinnerService } from 'ngx-spinner';
import { ActivatedRoute, Router } from '@angular/router';
// import { PdfDownloadHandlerService } from 'src/app/core/services/pdf-download-handler.service';
import { NgxPaginationModule } from 'ngx-pagination';
// import { MemberUpdateComponent } from 'src/app/shared/components/member-update/member-update.component';
import { MatDialog } from '@angular/material/dialog';
import { CallAPIService } from 'src/app/services/call-api.service';
import { ConfigService } from 'src/app/services/config.service';
import { ValidatorService } from 'src/app/services/validator.service';

@Component({
  selector: 'app-join-us-members-list',
  templateUrl: './join-us-members-list.component.html',
  styleUrls: ['./join-us-members-list.component.css']
})
export class JoinUsMembersListComponent {

filterForm: FormGroup | any;
  stateArray: any;
  districtArray: any;
  // talukaArray: any;
  talukaArray: any = [{ "id": 3996, "name": "Man","mName": "माण", "code": 4259},{"id": 3272, "name": "Khatav","mName": "खटाव","code": 4260}];
  villageArray: any;
  nagarPalikaArray: any;
  genderArray = [{ id: '', name: "All Gender" }, { id: 1, name: "Male" }, { id: 2, name: "Female" }, { id: 3, name: "Other" }];
  ruralUrbanArray = [{ id: '', name: "All Rural/Urban" }, { id: '1', name: "Rural" }, { id: '0', name: "Urban" }];
  pageSize = 10;
  pageNo = 1;
  getTotalCount: any;
  membersListArray: any;
  appliedFilters: any = {};
  selMemberObject:any;

  constructor(
    private fb: FormBuilder,
    private apiService: CallAPIService,
    private spinner: NgxSpinnerService,
    private router: Router,
    private route: ActivatedRoute,
    private config: ConfigService,
    public validation: ValidatorService,
    // private excelService: PdfDownloadHandlerService,
    private dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    this.defaultForm();
    this.getState(); // Load states first
    this.bindFilterData({stateId:27,districtId: 494});

    this.route.queryParams.subscribe(params => { // Check if URL has query params and bind them
      if (Object.keys(params).length) {
        this.bindFilterData(params);
      } else {
        this.appliedFilters = { ...this.filterForm.getRawValue() }; // set first Time  
        this.getMembersList(); // Fetch default table data if no params
      }
    });
  }

  get f() { return this.filterForm.controls }
  defaultForm() {
    this.filterForm = this.fb.group({
      genderId: [''],
      stateId: [27],
      districtId: [494],
      talukaId: [''],
      villageId: [''],
      nagarPalikaId: [''],
      ruralUrbanId: [''],
      searchText: [''],
      IsMannkhatav_web: [true]
    })
  }

  bindFilterData(params: any) {
    this.filterForm.patchValue({
      // genderId: +params.genderId || '',
      stateId: +params.stateId || '',
      districtId: +params.districtId || '',
      IsMannkhatav_web: true
      // talukaId: +params.talukaId || '',
      // villageId: +params.villageId || '',
      // nagarPalikaId: +params.nagarPalikaId || '',
      // ruralUrbanId: params.ruralUrbanId,
      // searchText: params.searchText || ''
    });

    this.appliedFilters = { ...this.filterForm.getRawValue() }; // set first Time  

    if (params.stateId) {
      this.getDistrict(() => {
        if (params.districtId) {
          if (this.filterForm.getRawValue().ruralUrbanId == 1) {
            // this.getTaluka(() => {
              if (params.talukaId) {
                this.getVillage(() => {
                  this.getMembersList(); // Fetch members after binding data
                });
              } else {
                this.getMembersList();
              }
            // });
          } else {
            this.getUrbanCity(() => {
              this.getMembersList();
            });
          }
        } else {
          this.getMembersList();
        }
      });
    } else {
      this.getMembersList();
    }
  }

  getState() {
    this.apiService.setHttp('get', 'api/CommonDropdown/GetState?CountryId=' + this.config.countryId, false, false, false, 'shisankalpOrg');
    this.apiService.getHttp().subscribe((res: any) => {
      if (res.responseData != null && res.statusCode == "200") {
        this.stateArray = res.responseData;
        this.stateArray.unshift({ code: '', name: 'All State' });
      } else { this.stateArray = []; }
    }, (error: any) => {
      this.router.navigate(['../500'], { relativeTo: this.route });
    })
  }

  getDistrict(callback?: Function) {
    let stateId = this.f['stateId'].value;
    if (!stateId) {
      callback?.();
      return;
    }
    this.apiService.setHttp('get', `api/CommonDropdown/GetDistrict?StateCode=${stateId}`, false, false, false, 'shisankalpOrg');
    this.apiService.getHttp().subscribe((res: any) => {
      this.districtArray = res.responseData || [];
      this.districtArray?.length ? this.districtArray.unshift({ code: '', name: 'All District' }) : '';
      callback?.();
    });
  }

  // getTaluka(callback?: Function) {
  //   let districtId = this.f['districtId'].value;
  //   if (!districtId) {
  //     callback?.();
  //     return;
  //   }
  //   this.apiService.setHttp('get', `api/CommonDropdown/GetTaluka?DistrictCode=${districtId}`, false, false, false, 'shisankalpOrg');
  //   this.apiService.getHttp().subscribe((res: any) => {
  //     this.talukaArray = res.responseData || [];
  //     this.talukaArray?.length ? this.talukaArray.unshift({ code: '', name: 'All Taluka' }) : '';
  //     callback?.();
  //   });
  // }

  getVillage(callback?: Function) {
    let talukaId = this.f['talukaId'].value;
    if (!talukaId) {
      callback?.();
      return;
    }
    this.apiService.setHttp('get', `api/CommonDropdown/GetVillage?TalukaCode=${talukaId}`, false, false, false, 'shisankalpOrg');
    this.apiService.getHttp().subscribe((res: any) => {
      this.villageArray = res.responseData || [];
      this.villageArray?.length ? this.villageArray.unshift({ code: '', name: 'All Village' }) : '';
      callback?.();
    });
  }

  getUrbanCity(callback?: Function) {
    let districtId = this.f['districtId'].value;
    if (!districtId) {
      callback?.();
      return;
    }
    this.apiService.setHttp('get', `api/CommonDropdown/GetUrbanBody?DistrictCode=${districtId}`, false, false, false, 'shisankalpOrg');
    this.apiService.getHttp().subscribe((res: any) => {
      this.nagarPalikaArray = res.responseData || [];
      if (this.nagarPalikaArray?.length > 0) {
        this.nagarPalikaArray = this.nagarPalikaArray.filter((item: any) => item.code == 276417 || item.code == 276416 || item.code == 251589); // filter only satara district Cities man & khatav =>  Dahiwadi, vaduj, mhaswad
        this.nagarPalikaArray?.length ? this.nagarPalikaArray.unshift({ code: '', name: 'All City' }) : '';
      }
      callback?.();
    });
  }

  clearSelect(flag: any) {
    if (flag == 'state') {
      this.f["districtId"].setValue('');
      this.f["talukaId"].setValue('');
      this.f["villageId"].setValue('');
      this.f["nagarPalikaId"].setValue('');
      this.getDistrict();
    } else if (flag == 'district') {
      this.f["talukaId"].setValue('');
      this.f["villageId"].setValue('');
      this.f["nagarPalikaId"].setValue('');
      this.f['ruralUrbanId'].value == 1 ? '' : this.getUrbanCity();
      // this.f['ruralUrbanId'].value == 1 ? this.getTaluka() : this.getUrbanCity();
    } else if (flag == 'taluka') {
      this.f["villageId"].setValue('');
      this.getVillage();
    } else if (flag == 'ruralUrban') {
      this.f['ruralUrbanId'].value == 1 ? '': (this.f["districtId"].value ? this.getUrbanCity() : '')
            // this.f['ruralUrbanId'].value == 1 ? (this.f["districtId"].value ? this.getTaluka() : '') : (this.f["districtId"].value ? this.getUrbanCity() : '')
      this.f["talukaId"].setValue('');
      this.f["villageId"].setValue('');
      this.f["nagarPalikaId"].setValue('');
    }
  }

  getQueryParams(flag?: any): string {
    let params: any = {
      genderId: this.appliedFilters.genderId,
      stateCode: this.appliedFilters.stateId,
      districtCode: this.appliedFilters.districtId,
      talukaCode: this.appliedFilters.talukaId,
      townCode: this.appliedFilters.villageId,
      searchText: this.appliedFilters.searchText?.trim(),
      urbanCityCode: this.appliedFilters.nagarPalikaId,
      IsRural: this.appliedFilters.ruralUrbanId,
      IsMannkhatav_web: true
    };

    if (flag != 'download') {
      params.pageNumber = this.pageNo;
      params.pageSize = this.pageSize;
    }

    return Object.entries(params)
      .filter(([_, value]) => value !== null && value !== undefined && value !== '')
      .map(([key, value]) => `${key}=${encodeURIComponent(String(value))}`)
      .join('&');
  }

  getMembersList() {
    const queryString = this.getQueryParams(); // include pagination only if not downloading
    this.spinner.show();
    this.apiService.setHttp('get', `Member/GetManKhatavMemberList?${queryString}`, false, false, false, 'shisankalpOrg');
    this.apiService.getHttp().subscribe((res: any) => {
      this.spinner.hide();
      this.membersListArray = res.statusCode == "200" ? res.responseData1.data : [];
      this.getTotalCount = res.statusCode == "200" ? res.responseData1.totalPages * this.pageSize : 0;
    }, () => {
         this.membersListArray = [];
      this.spinner.hide();
    });
  }

  searchClick() {
    this.appliedFilters = { ...this.filterForm.getRawValue() }; // Apply filters
    this.pageNo = 1;
    this.getMembersList();
  }

  clearFilter() {
    this.defaultForm();
    this.appliedFilters = {stateId:27,districtId: 494,IsMannkhatav_web: true}; // Clear filters
    this.pageNo = 1;
    this.getMembersList();
  }

  onClickPagintion(pageNo: number) {
    this.pageNo = pageNo;
    this.getMembersList();
  }

  callApidownloadExcel() {
    const queryString: any = this.getQueryParams('download'); // include pagination only if not downloading
    this.spinner.show();
    this.apiService.setHttp('get', `api/ListOfMember/GetMembers?${queryString}`, false, false, false, 'shisankalpOrg');
    this.apiService.getHttp().subscribe((res: any) => {
      this.spinner.hide();
      let data = res.statusCode == "200" ? res.responseData1 : [];
      data?.map((ele: any, i: any) => {
        ele['srNo'] = i + 1;
        ele['gender'] = ele?.genderId == 1 ? 'Male' : ele?.genderId == 2 ? 'Female' : 'Other';
        ele['isRuralUrbanName'] = ele?.isRural == 1 ? 'Rural' : ele?.isRural == 0 ? 'Urban' : '';
        ele['townName'] = ele?.isRural == 1 ? ele?.townName : ele?.urbanbodyName;
      })
      this.onDownloadExcel(data);
    }, () => {
      this.spinner.hide();
    });
  }

  async onDownloadExcel(array: any) {

    let stateName = this.stateArray?.find((x: any) => x.code == this.appliedFilters.stateId)?.name;
    let districtName = this.districtArray?.find((x: any) => x.code == this.appliedFilters.districtId)?.name;
    let talukaName = this.talukaArray?.find((x: any) => x.code == this.appliedFilters.talukaId)?.name;
    let villageName = this.villageArray?.find((x: any) => x.code == this.appliedFilters.villageId)?.name;
    let nagarPanchytName = this.nagarPalikaArray?.find((x: any) => x.code == this.appliedFilters.nagarPalikaId)?.name;
    let gender = this.appliedFilters.genderId == 1 ? 'Male' : this.appliedFilters.genderId == 2 ? 'Female' : this.appliedFilters.genderId == 3 ? 'Other' : '';
    let ruralUrbanName = this.appliedFilters.ruralUrbanId == '1' ? 'Rural' : this.appliedFilters.ruralUrbanId == '0' ? 'Urban' : '';

    let header = ['Sr.No.', 'Full Name', 'Mobile No.', 'State', 'District', 'Taluka', 'Village / City', 'Gender', 'Area Type', 'Joining Date', 'Address', 'Opinion / Feedback / Suggestions'];
    let columnKey = ['srNo', 'name', 'mobileNo', 'stateName', 'districtName', 'subDistrictName', 'townName', 'gender', 'isRuralUrbanName', 'memberRegistrationDate', 'address', 'remark'];
    let widthArray = [8, 25, 15, 15, 15, 15, 30, 10, 10, 15, 50, 100];

    let headerObj: string[] = [];
    if (stateName) headerObj.push('State: ' + stateName);
    if (districtName) headerObj.push('District: ' + districtName);
    if (talukaName) headerObj.push('Taluka: ' + talukaName);
    if (villageName) headerObj.push('Village: ' + villageName);
    if (nagarPanchytName) headerObj.push('City (NP / MNP): ' + nagarPanchytName);
    if (gender) headerObj.push('Gender: ' + gender);
    if (ruralUrbanName) headerObj.push('Area Type: ' + ruralUrbanName);
    if (this.appliedFilters.searchText) headerObj.push('Search Text: ' + this.appliedFilters.searchText);

    // this.excelService.generateExcel(array, headerObj, 'Member List', header, columnKey, widthArray);

  }

  viewMemberDetails(memberObj: any) {
this.selMemberObject = memberObj;
  }

  // addUpdateMember(id?: any) {
  //   let obj = { flag: id ? 'update' : 'add', 'Id': id }
  //   const dialogRef = this.dialog.open(MemberUpdateComponent, {
  //     width: '1024px',
  //     data: obj,
  //     disableClose: true
  //   });
  //   dialogRef.afterClosed().subscribe(result => {
  //     if (result == 'Yes') {
  //       this.getMembersList();
  //     }
  //   });
  // }

}

