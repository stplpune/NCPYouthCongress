import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { debounceTime } from 'rxjs/operators';
import { CallAPIService } from 'src/app/services/call-api.service';
import { CommonService } from 'src/app/services/common.service';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-organization-master',
  templateUrl: './organization-master.component.html',
  styleUrls: ['./organization-master.component.css', '../../partial.component.css']
})
export class OrganizationMasterComponent implements OnInit {
  allDistrict: any;
  getTalkaByDistrict: any;
  orgMasterForm!: FormGroup;
  AddDesignationForm!: FormGroup;
  filterForm!: FormGroup;
  categoryArray = [{ id: 1, name: "Rural" }, { id: 0, name: "Urban" }];
  IsMultiple = [{ id: 1, name: "Yes" }, { id: 0, name: "No" }];
  allotedDesignationArray = [{ id: 0, name: "All" }, { id: 1, name: "Yes" }, { id: 2, name: "No" }];
  defultCategory = "Rural";
  selCityFlag: boolean = false;
  selVillageFlag: boolean = true;
  resultVillageOrCity: any;
  villageCityLabel = "Village";
  allStates: any;
  globalDistrictId: any;
  allLevels: any;
  setVillOrcityName = "VillageName";
  setVillOrCityId = "VillageId";
  submitted = false;
  addDesFormSubmitted = false;
  btnText = "Create Organization";
  organizationRes: any;
  searchText: any;
  districtId: number = 0;
  allowClearFlag: boolean = true;
  selEditOrganization: any;
  items: string[] = [];
  HighlightRow: any;
  resultDesignation: any;
  BodyOrgCellName: any;
  total: any;
  paginationNo: number = 1;
  pageSize: number = 10;
  searchFilter = "";
  @ViewChild('closeModalAddDesignation') closeModalAddDesignation: any;
  desBodyId: any;
  allAssignedDesignations: any;
  modalDeafult = false;
  globalTalukaID: any;
  disableFlagDist: boolean = true;
  disableFlagTal: boolean = true;
  disableFlagVill: boolean = true;
  redioBtnDisabled: boolean = true;
  addDesignation = "Assign";
  selectObj: any;
  editRadioBtnClick: any;
  subject: Subject<any> = new Subject();
  globalLevelId: any;
  allBodyAssignedDesignation: any;
  globalselLevelFlag!: string;

  constructor(private callAPIService: CallAPIService, private router: Router, private fb: FormBuilder,
    private toastrService: ToastrService, private commonService: CommonService,
    private spinner: NgxSpinnerService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.defultFilterForm();
    this.getOrganizationList();
    this.customForm();
    this.getLevel();
    this.getState();
    this.getDistrict();
    this.getDesignation();
    this.defaultDesignationForm();
    this.searchFilters('false');
  }

  selectLevel(levelId: any, flag: any) {
    debugger;
    this.globalselLevelFlag = flag;
    this.globalLevelId = levelId;
    if (levelId == 3) {
      this.validationOncondition(levelId)
      this.disableFlagDist = false;
      this.disableFlagTal = true;
      this.disableFlagVill = true;
      if (this.btnText == "Update Organization" && flag == 'select') {
        this.orgMasterForm.controls["VillageId"].setValue(null);
        this.orgMasterForm.controls["TalukaId"].setValue(null);
        this.getTaluka(this.globalDistrictId);
      }
    } else if (levelId == 4) {
      this.validationOncondition(levelId)
      this.disableFlagTal = false;
      this.disableFlagDist = false;
      this.disableFlagVill = true;
      if (this.btnText == "Update Organization" && flag == 'select') {
        this.orgMasterForm.controls["VillageId"].setValue(null);
        this.getTaluka(this.globalDistrictId);
      }
    } else if (levelId == 5) {
      this.validationOncondition(levelId);
      this.disableFlagTal = false;
      this.disableFlagDist = false;
      this.setVillOrcityName = "VillageName";
      this.setVillOrCityId = "VillageId";
      this.villageCityLabel = "Village";
      if (this.btnText == "Update Organization" && flag == 'select') {
        this.orgMasterForm.controls["VillageId"].setValue(null);
        this.orgMasterForm.controls["TalukaId"].setValue(null);
        this.getTaluka(this.globalDistrictId);
      }
    } else if (levelId == 2) {
      this.validationOncondition(levelId);
      this.disableFlagDist = true;
      this.disableFlagVill = true;
      this.disableFlagTal = true;
      if (this.btnText == "Update Organization" && flag == 'select') {
        this.orgMasterForm.controls["VillageId"].setValue(null);
        this.orgMasterForm.controls["TalukaId"].setValue(null);
        this.getTaluka(this.globalDistrictId);
      }
    } else if (levelId == 6) {
      this.validationOncondition(levelId);
      this.disableFlagDist = false;
      this.disableFlagVill = false;
      this.disableFlagTal = true;
      this.setVillOrcityName = "CityName";
      this.setVillOrCityId = "Id";
      this.villageCityLabel = "City";
      debugger
      if (this.btnText == "Update Organization" && flag == 'edit') {
        this.orgMasterForm.controls["VillageId"].setValue(null);
      }
      if (this.btnText == "Update Organization" && flag == 'select') {
        this.orgMasterForm.controls["VillageId"].setValue(null);
        // this.orgMasterForm.controls["DistrictId"].setValue(null);
        // this.orgMasterForm.controls["TalukaId"].setValue(null);
        this.getVillageOrCity(this.globalDistrictId, 'city');
      }
    }
    else {

      this.selectLevelClear();
    }
  }



  validationOncondition(levelId: any) {
    debugger;
    if (levelId == 5) {
      this.orgMasterForm.controls["DistrictId"].setValidators(Validators.required);
      this.orgMasterForm.controls["TalukaId"].setValidators(Validators.required);
      this.orgMasterForm.controls["VillageId"].setValidators(Validators.required);
      this.updateValueAndValidityMF(levelId);
    } else if (levelId == 4) {
      this.orgMasterForm.controls["DistrictId"].setValidators(Validators.required);
      this.orgMasterForm.controls["TalukaId"].setValidators(Validators.required);
      this.updateValueAndValidityMF(levelId);
    } else if (levelId == 3) {
      this.orgMasterForm.controls["DistrictId"].setValidators(Validators.required);
      this.updateValueAndValidityMF(levelId);
    } else if (levelId == 6) {
      this.orgMasterForm.controls["DistrictId"].setValidators(Validators.required);
      // this.orgMasterForm.controls["VillageId"].setValidators(Validators.required);
      this.updateValueAndValidityMF(levelId);
    } else if (levelId == 2) {
      this.orgMasterForm.controls["DistrictId"].setValidators(Validators.required);
      this.updateValueAndValidityMF(levelId);
    } else {
      this.clearValidatorsMF(levelId);
      this.updateValueAndValidityMF(levelId);
    }
  }

  clearValidatorsMF(levelId: any) {
    debugger;
    if (levelId == 5 || levelId == 6) {
      this.orgMasterForm.controls['DistrictId'].clearValidators();
      this.orgMasterForm.controls['TalukaId'].clearValidators();
      this.orgMasterForm.controls['VillageId'].clearValidators();
    }
  }

  clearselOption(flag: any, globalLevelId: any) {
    debugger;
    if (flag == 'State') {
      // if(flag == 'State' && this.globalLevelId == 6){
      //   this.orgMasterForm.controls["DistrictId"].setValidators(Validators.required);
      //   this.orgMasterForm.controls["VillageId"].setValue(null);
      // }else{
      this.orgMasterForm.controls["DistrictId"].setValidators(Validators.required);
      this.orgMasterForm.controls["TalukaId"].setValidators(Validators.required);
      this.orgMasterForm.controls["VillageId"].setValidators(Validators.required);
      this.orgMasterForm.controls["DistrictId"].setValue(null);
      this.orgMasterForm.controls["TalukaId"].setValue(null);
      this.orgMasterForm.controls["VillageId"].setValue(null);
      // }
      this.redioBtnDisabled = true;
      this.disableFlagVill = true;

    } else if (flag == 'District') {
      this.orgMasterForm.controls["DistrictId"].setValidators(Validators.required);
      this.orgMasterForm.controls["TalukaId"].setValidators(Validators.required);
      this.orgMasterForm.controls["VillageId"].setValidators(Validators.required);
      this.orgMasterForm.controls["DistrictId"].setValue(null);
      this.orgMasterForm.controls["TalukaId"].setValue(null);
      this.orgMasterForm.controls["VillageId"].setValue(null);
      // this.clickRuralRadioBtnClick();
      this.redioBtnDisabled = true;
      this.disableFlagVill = true;

    } else if (flag == 'Taluka') {
      this.orgMasterForm.controls["TalukaId"].setValidators(Validators.required);
      this.orgMasterForm.controls["VillageId"].setValidators(Validators.required);
      this.orgMasterForm.controls["TalukaId"].setValue(null);
      this.orgMasterForm.controls["VillageId"].setValue(null);
    } else if (flag == 'Village'  && this.globalLevelId != 6) {
      this.orgMasterForm.controls["VillageId"].setValidators(Validators.required);
      this.orgMasterForm.controls["VillageId"].setValue(null);
    } else if (flag == 'Village' && this.globalLevelId == 6) {
      // this.orgMasterForm.controls["TalukaId"].setValue(null);
      this.orgMasterForm.controls["VillageId"].setValidators(Validators.required);
      this.orgMasterForm.controls["VillageId"].setValue(null);
    }

    this.updateValueAndValidityMF(globalLevelId);

  }

  updateValueAndValidityMF(levelId: any) {
    debugger;
    if (levelId == 5) {
      this.orgMasterForm.controls["DistrictId"].updateValueAndValidity();
      this.orgMasterForm.controls["TalukaId"].updateValueAndValidity();
      this.orgMasterForm.controls["VillageId"].updateValueAndValidity();
    } else if (levelId == 6) {
      this.orgMasterForm.controls["DistrictId"].updateValueAndValidity();
      // this.orgMasterForm.controls["TalukaId"].updateValueAndValidity();
      this.orgMasterForm.controls["VillageId"].updateValueAndValidity();
    } else if (levelId == 2) {
      this.orgMasterForm.controls["StateId"].updateValueAndValidity();
    } else if (levelId == 3) {
      this.orgMasterForm.controls["StateId"].updateValueAndValidity();
      this.orgMasterForm.controls["DistrictId"].updateValueAndValidity();
    }
    // this.submitted = false;

    // this.clearValidatorsMF(levelId);
    // }
  }

  selectLevelClear() {
    this.disableFlagVill = true;
    this.disableFlagTal = true;
    this.disableFlagDist = true;
    this.orgMasterForm.controls["StateId"].setValue(null);
    this.orgMasterForm.controls["DistrictId"].setValue(null);
    this.orgMasterForm.controls["TalukaId"].setValue(null);
    this.orgMasterForm.controls["VillageId"].setValue(null);
    this.redioBtnDisabled = true;
    // this.clickRuralRadioBtnClick();
  }

  customForm() {
    this.orgMasterForm = this.fb.group({
      BodyOrgCellName: ['', Validators.required],
      StateId: ['', Validators.required],
      DistrictId: [''],
      TalukaId: [''],
      VillageId: [''],
      IsRural: [1],
      BodyLevelId: ['', Validators.required],
      CreatedBy: [this.commonService.loggedInUserId()],
    })
  }

  defultFilterForm() {
    this.filterForm = this.fb.group({
      filterDistrict: [0],
      searchText: [''],
      AllotedDesignation: [],
    })
  }

  clearSearchFilter() {
    this.filterForm.controls['searchText'].setValue('');
    this.districtId = this.districtId;
    this.searchFilter = "";
    this.getOrganizationList();
  }
  getOrganizationList() {
    this.spinner.show();
    let filterData = this.filterForm.value;
    (filterData.AllotedDesignation == null || filterData.AllotedDesignation == "") ? filterData.AllotedDesignation = 0 : filterData.AllotedDesignation = filterData.AllotedDesignation
    let data = '?UserId=' + this.commonService.loggedInUserId() + '&DistrictId=' + filterData.filterDistrict + '&Search=' + filterData.searchText + '&nopage=' + this.paginationNo + '&AllotedDesignation=' + filterData.AllotedDesignation;
    this.callAPIService.setHttp('get', 'Web_GetOrganizationAssignedBody_1_0' + data, false, false, false, 'ncpServiceForWeb');
    this.callAPIService.getHttp().subscribe((res: any) => {
      if (res.data == 0) {
        this.spinner.hide();
        this.organizationRes = res.data1;
        this.total = res.data2[0].TotalCount;
      } else {
        this.spinner.hide();
        if (res.data == 1) {
          this.organizationRes = [];
        } else {
          this.toastrService.error("Please try again something went wrong");
          this.organizationRes = [];
        }
      }
    }, (error: any) => {
      if (error.status == 500) {
        this.router.navigate(['../../500'], { relativeTo: this.route });
      }
    })
  }

  getLevel() {
    this.spinner.show();
    this.callAPIService.setHttp('get', 'Web_GetLevel_1_0', false, false, false, 'ncpServiceForWeb');
    this.callAPIService.getHttp().subscribe((res: any) => {
      if (res.data == 0) {
        this.spinner.hide();
        this.allLevels = res.data1;
      } else {
        // this.toastrService.error("Data is not available 1");
      }
    }, (error: any) => {
      if (error.status == 500) {
        this.router.navigate(['../../500'], { relativeTo: this.route });
      }
    })
  }

  getState() {
    this.spinner.show();
    this.callAPIService.setHttp('get', 'Web_GetState_1_0', false, false, false, 'ncpServiceForWeb');
    this.callAPIService.getHttp().subscribe((res: any) => {
      if (res.data == 0) {
        this.spinner.hide();
        this.allStates = res.data1;
      } else {
        this.toastrService.error("Data is not available");
      }
    }, (error: any) => {
      if (error.status == 500) {
        this.router.navigate(['../../500'], { relativeTo: this.route });
      }
    })
  }

  getDistrict() {
    this.spinner.show();
    this.callAPIService.setHttp('get', 'Web_GetDistrict_1_0?StateId=' + 1, false, false, false, 'ncpServiceForWeb');
    this.callAPIService.getHttp().subscribe((res: any) => {
      if (res.data == 0) {
        this.spinner.hide();
        this.allDistrict = res.data1;
        debugger;
        this.globalDistrictId = this.selEditOrganization?.DistrictId;
        if (this.btnText == "Update Organization" && this.selEditOrganization.IsRural == 0) { // edit
          if (this.selEditOrganization.BodyLevel == 6) {
            this.orgMasterForm.controls["VillageId"].setValue(null);
            this.selCity();
          }

        } else {
          if (this.btnText == "Update Organization" && this.selEditOrganization.IsRural == 1) {
            this.getTaluka(this.globalDistrictId);
          }
        }

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
    this.globalDistrictId = districtId;
    if (this.btnText == "Update Organization" && this.selEditOrganization.IsRural == 1) {
      this.getVillageOrCity(districtId, 'City');
    }

    this.spinner.show();
    this.globalDistrictId = districtId;
    this.callAPIService.setHttp('get', 'Web_GetTaluka_1_0?DistrictId=' + districtId, false, false, false, 'ncpServiceForWeb');
    this.callAPIService.getHttp().subscribe((res: any) => {
      if (res.data == 0) {
        this.spinner.hide();
        this.getTalkaByDistrict = res.data1;
        debugger;
        if (this.btnText == "Update Organization") {
          if (this.selEditOrganization.IsRural == 1) {
            this.globalTalukaID = this.selEditOrganization.TalukaId;
            this.orgMasterForm.patchValue({ TalukaId: this.selEditOrganization.TalukaId });
            this.selVillage();
          }
          // else {
          //   this.globalTalukaID = this.selEditOrganization.TalukaId;
          //   this.selCity();
          // }
        } // edit only 
      } else {
        this.toastrService.error("Data is not available");
      }
    }, (error: any) => {
      if (error.status == 500) {
        this.router.navigate(['../../500'], { relativeTo: this.route });
      }
    })
  }

  getVillageOrCity(talukaID: any, selType: any) {
    debugger;
    (this.globalLevelId == 5 || this.globalLevelId == 6) ? this.disableFlagVill = false : this.disableFlagVill = true; // village flag disabled
    let appendString = "";
    selType == 'Village' ? appendString = 'Web_GetVillage_1_0?talukaid=' + talukaID : appendString = 'Web_GetCity_1_0?DistrictId=' + this.globalDistrictId;
    this.callAPIService.setHttp('get', appendString, false, false, false, 'ncpServiceForWeb');
    this.callAPIService.getHttp().subscribe((res: any) => {
      if (res.data == 0) {
        this.spinner.hide();
        this.resultVillageOrCity = res.data1;
        if (this.btnText == "Update Organization") { // edit
          this.orgMasterForm.patchValue({ VillageId: this.selEditOrganization.VillageId });
        }
      } else {
        this.toastrService.error("Data is not available");
      }
    }, (error: any) => {
      if (error.status == 500) {
        this.router.navigate(['../../500'], { relativeTo: this.route });
      }
    })
  }

  get f() { return this.orgMasterForm.controls };

  onSubmit() {
    debugger;
    this.spinner.show();
    this.submitted = true;
    if (this.orgMasterForm.invalid) {
      this.spinner.hide();
      return;
    }
    else {
      let fromData: any = new FormData();
      console.log(this.orgMasterForm.value);
      this.orgMasterForm.value.BodyLevelId == 6 ? this.orgMasterForm.value.IsRural = 0 : this.orgMasterForm.value.IsRural = 1;
      Object.keys(this.orgMasterForm.value).forEach((cr: any, ind: any) => {
        let value = Object.values(this.orgMasterForm.value)[ind] != null ? Object.values(this.orgMasterForm.value)[ind] : 0;
        fromData.append(cr, value)
      })
      let btnTextFlag = this.btnText == "Create Organization" ? 0 : this.HighlightRow;
      fromData.append('Id', btnTextFlag);

      this.callAPIService.setHttp('Post', 'Web_Insert_Bodycellorgmaster_1_0', false, fromData, false, 'ncpServiceForWeb');
      this.callAPIService.getHttp().subscribe((res: any) => {
        if (res.data == 0) {
          this.spinner.hide();
          this.toastrService.success(res.data1[0].Msg);
          this.getOrganizationList();
          this.clearForm();
        } else {
          this.toastrService.error("Data is not available");
        }
      }, (error: any) => {
        if (error.status == 500) {
          this.router.navigate(['../../500'], { relativeTo: this.route });
        }
      })
    }
  }


  clearForm() {
    this.HighlightRow = null;
    this.submitted = false;
    this.orgMasterForm.reset({
      IsRural: 1
    });
    this.getOrganizationList();
  }


  filterData() {
    this.paginationNo = 1;
    this.getOrganizationList();
  }

  clearFilter(flag: any) {
    if (flag == 'district') {
      this.filterForm.controls['filterDistrict'].setValue(0);
    } else if (flag == 'search') {
      this.filterForm.controls['searchText'].setValue('');
    } else if (flag == 'member') {
      this.filterForm.controls['AllotedDesignation'].setValue('');
    }
    this.paginationNo = 1;
    this.getOrganizationList();
  }

  editOrganization(BodyId: any) {
    this.clearForm();
    this.btnText = "Update Organization";
    this.spinner.show();
    this.callAPIService.setHttp('get', 'Web_Getbodycellorgmaster_1_0?BodyId=' + BodyId, false, false, false, 'ncpServiceForWeb');
    this.callAPIService.getHttp().subscribe((res: any) => {
      if (res.data == 0) {
        this.spinner.hide();
        this.selEditOrganization = res.data1[0];
        console.log(this.selEditOrganization);
        this.HighlightRow = this.selEditOrganization.Id;
        this.selectLevel(this.selEditOrganization.BodyLevel, 'edit');
        this.getDistrict();
        this.orgMasterForm.patchValue({
          BodyOrgCellName: this.selEditOrganization.BodyOrgCellName,
          StateId: this.selEditOrganization.StateId,
          DistrictId: this.selEditOrganization.DistrictId,
          IsRural: this.selEditOrganization.IsRural,
          BodyLevelId: this.selEditOrganization.BodyLevel,
          CreatedBy: this.commonService.loggedInUserId()
        })
      } else {
        this.toastrService.error("Data is not available");
      }
    }, (error: any) => {
      if (error.status == 500) {
        this.router.navigate(['../../500'], { relativeTo: this.route });
      }
    })
  }

  getDesignation() {
    this.spinner.show();
    this.callAPIService.setHttp('get', 'Web_Getdesignationmaster_1_0', false, false, false, 'ncpServiceForWeb');
    this.callAPIService.getHttp().subscribe((res: any) => {
      if (res.data == 0) {
        this.spinner.hide();
        this.resultDesignation = res.data1;
        if (this.btnText == "Update Organization") { // edit
          this.orgMasterForm.patchValue({ VillageId: this.selEditOrganization.VillageId });
        }
      } else {
        this.toastrService.error("Data is not available");
      }
    }, (error: any) => {
      if (error.status == 500) {
        this.router.navigate(['../../500'], { relativeTo: this.route });
      }
    })
  }

  defaultDesignationForm() {
    this.AddDesignationForm = this.fb.group({
      Id: [0],
      BodyId: [],
      DesignationId: ['', Validators.required],
      IsMultiple: ['', Validators.required],
      CreatedBy: [this.commonService.loggedInUserId()],
    })
  }

  AddDesignation(BodyOrgCellName: any, bodyId: any) {
    this.desBodyId = bodyId;
    this.getBodyAssignedDesignation();
    this.AlreadyAssignedDesignations(this.desBodyId)
    this.AddDesignationForm.patchValue({
      BodyId: BodyOrgCellName
    })
  }

  AlreadyAssignedDesignations(desBodyId: any) {
    this.spinner.show();
    this.modalDeafult = true
    this.callAPIService.setHttp('get', 'Web_GetAssignedDesignation_1_0?BodyId=' + desBodyId, false, false, false, 'ncpServiceForWeb');
    this.callAPIService.getHttp().subscribe((res: any) => {
      if (res.data == 0) {
        this.spinner.hide();
        this.allAssignedDesignations = res.data1;
      } else {
        // this.toastrService.error("Designations is  not available");
        this.allAssignedDesignations = [];
      }
    }, (error: any) => {
      if (error.status == 500) {
        this.router.navigate(['../../500'], { relativeTo: this.route });
      }
    })
  }

  get d() { return this.AddDesignationForm.controls };

  submitDesignationForm() {
    this.spinner.show();
    this.addDesFormSubmitted = true;
    if (this.AddDesignationForm.invalid) {
      this.spinner.hide();
      return;
    }
    else {
      let fromData: any = new FormData();
      this.AddDesignationForm.value['BodyId'] = this.desBodyId;
      Object.keys(this.AddDesignationForm.value).forEach((cr: any, ind: any) => {
        fromData.append(cr, Object.values(this.AddDesignationForm.value)[ind])
      })
      this.callAPIService.setHttp('Post', 'Web_Insert_postmaster_1_0', false, fromData, false, 'ncpServiceForWeb');
      this.callAPIService.getHttp().subscribe((res: any) => {
        if (res.data == 0) {
          this.clearAddDesignationForm();
          this.spinner.hide();
          this.toastrService.success(res.data1[0].Msg);
          this.closeModalAddDes();
          this.spinner.hide();

          this.getOrganizationList();
        } else {
          this.toastrService.error("Members is not available");
        }
      }, (error: any) => {
        if (error.status == 500) {
          this.router.navigate(['../../500'], { relativeTo: this.route });
        }
      })
    }
  }

  editDesignationForm(data: any) {
    this.editRadioBtnClick = data.IsMultiple;
    this.addDesignation = 'Edit';
    this.AddDesignationForm.patchValue({
      Id: data.Id,
      BodyId: this.AddDesignationForm.value.BodyId,
      DesignationId: data.DesignationId,
      IsMultiple: data.IsMultiple,
      CreatedBy: this.commonService.loggedInUserId(),
    })
    console.log(this.AddDesignationForm.value);
  }

  clearAddDesignationForm() {
    this.addDesFormSubmitted = false;
    this.AddDesignationForm.patchValue({
      IsMultiple: '',
      DesignationId: '',
    });
  }

  closeModalAddDes() {
    let closeModal: any = this.closeModalAddDesignation.nativeElement;
    closeModal.click();
  }

  onClickPagintion(pageNo: number) {
    // this.clearForm();
    this.paginationNo = pageNo;
    this.getOrganizationList();
  }

  filter(searchText: any) {
    this.searchFilter = searchText;
    this.getOrganizationList();
  }

  redirectOrgDetails(bodyId: any, officeBearers: any, BodyOrgCellName: any) {
    if (officeBearers == "" || officeBearers == null) {
      this.toastrService.error("Data not found..");
    } else {
      let obj = { bodyId: bodyId, BodyOrgCellName: BodyOrgCellName }
      localStorage.setItem('bodyId', JSON.stringify(obj))
      this.router.navigate(['details'], { relativeTo: this.route })
    }
  }

  onKeyUpFilter() {
    this.subject.next();
  }

  searchFilters(flag: any) {
    if (flag == 'true') {
      if (this.filterForm.value.searchText == "" || this.filterForm.value.searchText == null) {
        this.toastrService.error("Please search and try again");
        return
      }
    }
    this.subject
      .pipe(debounceTime(700))
      .subscribe(() => {
        this.searchFilter = this.filterForm.value.searchText;
        this.paginationNo = 1;
        this.getOrganizationList()
      }
      );
  }

  getBodyAssignedDesignation() {
    this.callAPIService.setHttp('get', 'Web_GetAssigned_Post_1_0?BodyId=' + this.desBodyId, false, false, false, 'ncpServiceForWeb');
    this.callAPIService.getHttp().subscribe((res: any) => {
      if (res.data == 0) {
        this.spinner.hide();
        this.allBodyAssignedDesignation = res.data1;
      } else {
        this.spinner.hide();
        // this.toastrService.error("Designations is  not available");
        this.allBodyAssignedDesignation = [];
      }
    }, (error: any) => {
      this.spinner.hide();
      if (error.status == 500) {
        this.router.navigate(['../../500'], { relativeTo: this.route });
      }
    })
  }


  swingDesignation(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.allBodyAssignedDesignation, event.previousIndex, event.currentIndex);
    let stringDesignation: any = 'oldChangeId=' + this.allBodyAssignedDesignation[event.previousIndex].Id + '&oldChangesSortNo=' + this.allBodyAssignedDesignation[event.previousIndex].SrNo
      + '&NewChangeId=' + this.allBodyAssignedDesignation[event.currentIndex].Id + '&NewChangesSortNo=' + this.allBodyAssignedDesignation[event.currentIndex].SrNo + '&Createdby=' + this.commonService.loggedInUserId();

    this.callAPIService.setHttp('get', 'Web_SetDesignationSort?' + stringDesignation, false, false, false, 'ncpServiceForWeb');
    this.callAPIService.getHttp().subscribe((res: any) => {
      if (res.data == 0) {
        this.spinner.hide();
        this.toastrService.success(res.data1[0].Msg);
        this.getBodyAssignedDesignation();
        this.AlreadyAssignedDesignations(this.desBodyId);
      } else {
        this.spinner.hide();
        // this.toastrService.error("Designations is  not available");
        this.allBodyAssignedDesignation = [];
      }
    }, (error: any) => {
      this.spinner.hide();
      if (error.status == 500) {
        this.router.navigate(['../../500'], { relativeTo: this.route });
      }
    })
  }

  selCity() {
    debugger;
    this.villageCityLabel = "City";
    if (this.globalDistrictId == undefined || this.globalDistrictId == "") {
      this.toastrService.error("Please select district");
      return
    } else {
      this.getVillageOrCity(this.globalDistrictId, 'City');
      this.setVillOrcityName = "CityName";
      this.setVillOrCityId = "Id";
    }
  }

  selVillage() {
    debugger;
    if (this.globalDistrictId == undefined || this.globalDistrictId == "") {
      this.toastrService.error("Please select district");
      return
    } else {
      this.disableFlagVill = true;
      this.globalTalukaID == undefined ? this.globalTalukaID = 0 : this.globalTalukaID;
      this.btnText == "Update Organization" ? this.getVillageOrCity(this.globalTalukaID, 'Village') : '';
      this.setVillOrcityName = "VillageName";
      this.setVillOrCityId = "VillageId";
    }
  }
}

