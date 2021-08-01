import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { CallAPIService } from 'src/app/services/call-api.service';
import { CommonService } from 'src/app/services/common.service';

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

  constructor(private callAPIService: CallAPIService, private router: Router, private fb: FormBuilder,
    private toastrService: ToastrService, private commonService: CommonService,
    private spinner: NgxSpinnerService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.getOrganizationList();
    this.customForm();
    this.getLevel();
    this.getState();
    this.getDistrict();
    this.getDesignation();
    this.defaultDesignationForm();
    this.defultFilterForm();
  }

  selectLevel(levelId: any) {
    if (levelId == 3) {
      this.validationOncondition(levelId)
      this.disableFlagDist = false;
      this.disableFlagTal = true;
      this.disableFlagVill = true;
    } else if (levelId == 4) {
      this.validationOncondition(levelId)
      this.disableFlagTal = false;
      this.disableFlagDist = false;
      this.disableFlagVill = true;
    } else if (levelId == 5) {
      this.validationOncondition(levelId)
      this.disableFlagVill = false;
      this.disableFlagTal = false;
      this.disableFlagDist = false
    } else if (levelId == 2) {
      this.validationOncondition(levelId);
    }
    else {
      this.selectLevelClear();
    }
  }

  validationOncondition(levelId: any) {
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
    } else {
      this.clearValidatorsMF(levelId);
      this.updateValueAndValidityMF(levelId);
    }
  }

  clearValidatorsMF(levelId: any) {
    // if (levelId == 5) {
    this.orgMasterForm.controls['DistrictId'].clearValidators();
    this.orgMasterForm.controls['TalukaId'].clearValidators();
    this.orgMasterForm.controls['VillageId'].clearValidators();
    // }
  }

  updateValueAndValidityMF(levelId: any) {
    // if(levelId == 5){
    this.orgMasterForm.controls["DistrictId"].updateValueAndValidity();
    this.orgMasterForm.controls["TalukaId"].updateValueAndValidity();
    this.orgMasterForm.controls["VillageId"].updateValueAndValidity();
    this.clearValidatorsMF(levelId);
    // }
  }

  selectLevelClear() {
    this.disableFlagVill = true;
    this.disableFlagTal = true;
    this.disableFlagDist = true
  }
  customForm() {
    this.orgMasterForm = this.fb.group({
      BodyOrgCellName: ['', Validators.required],
      StateId: ['', Validators.required],
      DistrictId: [''],
      TalukaId: [''],
      VillageId: [''],
      IsRural: [1, Validators.required],
      BodyLevelId: ['', Validators.required],
      CreatedBy: [this.commonService.loggedInUserId()],
    })
  }

  defultFilterForm() {
    this.filterForm = this.fb.group({
      filterDistrict: [''],
      searchText: ['']
    })
  }

  clearFilter() {
    this.paginationNo = 1;
    this.districtId = 0;
    this.searchFilter = "";
    this.filterForm.reset();
    this.getOrganizationList();
  }

  getOrganizationList() {
    this.spinner.show();
    let s = this.searchFilter == null ? '' : this.searchFilter;
    let data = '?UserId=' + this.commonService.loggedInUserId() + '&DistrictId=' + this.districtId + '&Search=' + s + '&nopage=' + this.paginationNo;
    this.callAPIService.setHttp('get', 'Web_GetOrganizationAssignedBody_1_0' + data, false, false, false, 'ncpServiceForWeb');
    this.callAPIService.getHttp().subscribe((res: any) => {
      if (res.data == 0) {
        this.spinner.hide();
        this.organizationRes = res.data1;
        this.total = res.data2[0].TotalCount;
      } else {
        this.spinner.hide();
        if (res.data == 1) {
          this.toastrService.error("Data is not available");
          this.organizationRes = [];
        } else {
          this.toastrService.error("Please try again something went wrong");
          this.organizationRes = [];
        }
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
        this.spinner.hide();
        if (res.data == 1) {
          this.toastrService.error("Data is not available 1");
        } else {
          this.toastrService.error("Please try again something went wrong");
        }
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
        this.spinner.hide();
        if (res.data == 1) {
          this.toastrService.error("Data is not available");
        } else {
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
        this.allDistrict = res.data1;
        if (this.btnText == "Update Organization" && this.selEditOrganization.DistrictId != 0 && this.selEditOrganization.IsRural == 1) { // edit
          this.getTaluka(this.selEditOrganization.DistrictId);
        } else {
          if (this.btnText == "Update Organization" && this.selEditOrganization.IsRural == 0) {
            console.log(this.selEditOrganization)
            this.globalDistrictId = this.selEditOrganization?.DistrictId;
            let selFlagForRadioChange: any = this.selEditOrganization.IsRural == 0 ? "Urban" : "Rural";

            this.onRadioChangeCategory(selFlagForRadioChange, true);
          }

        }
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
    this.spinner.show();
    this.globalDistrictId = districtId;
    this.callAPIService.setHttp('get', 'Web_GetTaluka_1_0?DistrictId=' + districtId, false, false, false, 'ncpServiceForWeb');
    this.callAPIService.getHttp().subscribe((res: any) => {
      if (res.data == 0) {
        this.spinner.hide();
        this.getTalkaByDistrict = res.data1;
        if (this.btnText == "Update Organization" && this.selEditOrganization.TalukaId != 0) { // edit
          this.orgMasterForm.patchValue({ TalukaId: this.selEditOrganization.TalukaId });
          let selFlagForRadioChange: any = this.selEditOrganization.IsRural == 0 ? "Urban" : "Rural";
          this.globalTalukaID = this.selEditOrganization.TalukaId
          this.onRadioChangeCategory(selFlagForRadioChange, true);
          // let selFlag: any = this.selEditOrganization.IsRural == 1 ? "Village" : "City";
          // this.getVillageOrCity(this.selEditOrganization.TalukaId, selFlag)
        }
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

  getVillageOrCity(talukaID: any, selType: any) {
    debugger;
    // this.spinner.show();
    let appendString = "";
    selType == 'Village' ? appendString = 'Web_GetVillage_1_0?talukaid=' + talukaID : appendString = 'Web_GetCity_1_0?DistrictId=' + this.globalDistrictId;
    this.callAPIService.setHttp('get', appendString, false, false, false, 'ncpServiceForWeb');
    this.callAPIService.getHttp().subscribe((res: any) => {
      if (res.data == 0) {
        this.spinner.hide();
        this.resultVillageOrCity = res.data1;
        console.log(this.resultVillageOrCity);
        if (this.btnText == "Update Organization") { // edit
          this.orgMasterForm.patchValue({ VillageId: this.selEditOrganization.VillageId });
        }
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


  onRadioChangeCategory(category: any, flag: any) {
    // debugger;
    if (category == "Rural") {
      this.villageCityLabel = "Village";
      if (this.globalDistrictId == undefined || this.globalDistrictId == "") {
        this.toastrService.error("Please select district");
        return
      } else {
        this.globalTalukaID == undefined ? this.globalTalukaID = 0 : this.globalTalukaID;
        this.btnText == "Update Organization" ? this.getVillageOrCity(this.globalTalukaID, 'Village') : '';
        this.setVillOrcityName = "VillageName";
        this.setVillOrCityId = "VillageId";
      }
    }
    else {
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
    // }
  }

  get f() { return this.orgMasterForm.controls };

  onSubmit() {
    // this.spinner.show();
    this.submitted = true;
    if (this.orgMasterForm.invalid) {
      this.spinner.hide();
      return;
    }
    else {
      let fromData: any = new FormData();

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
          // this.getOrganizationList();
          this.clearForm();
        } else {
          this.spinner.hide();
          if (res.data == 1) {
            this.toastrService.error("Data is not available");
          } else {
            this.spinner.hide();
            this.toastrService.error("Please try again something went wrong");
          }
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

  selDistrict(event: any) {
    this.districtId = event
    this.getOrganizationList();
  }

  districtAllowClear() {
    this.districtId = 0;
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
        this.getDistrict();
        this.globalDistrictId;
        this.selectLevel(this.selEditOrganization.BodyLevel)
        this.orgMasterForm.patchValue({
          BodyOrgCellName: this.selEditOrganization.BodyOrgCellName,
          StateId: this.selEditOrganization.StateId,
          DistrictId: this.selEditOrganization.DistrictId,
          IsRural: this.selEditOrganization.IsRural,
          BodyLevelId: this.selEditOrganization.BodyLevel,
          CreatedBy: this.commonService.loggedInUserId()
        })
      } else {
        this.spinner.hide();
        if (res.data == 1) {
          this.toastrService.error("Data is not available");
        } else {
          this.spinner.hide();
          this.toastrService.error("Please try again something went wrong");
        }
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
        this.spinner.hide();
        if (res.data == 1) {
          this.toastrService.error("Data is not available");
        } else {
          this.spinner.hide();
          this.toastrService.error("Please try again something went wrong");
        }
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
        this.spinner.hide();
        if (res.data == 1) {
          this.toastrService.error("Data is not available");
          this.allAssignedDesignations = [];
        } else {
          this.spinner.hide();
          this.toastrService.error("Please try again something went wrong");
        }
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
          this.spinner.hide();
          this.toastrService.success(res.data1[0].Msg);
          this.closeModalAddDes();
          this.spinner.hide();
          this.clearAddDesignationForm();
        } else {
          this.spinner.hide();
          if (res.data == 1) {
            this.toastrService.error("Data is not available");
          } else {
            this.spinner.hide();
            this.toastrService.error("Please try again something went wrong");
          }
        }
      })
    }
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
    this.getOrganizationList()
  }

  filter(searchText: any) {
    this.searchFilter = searchText;
    this.getOrganizationList();
  }

  redirectOrgDetails(bodyId: any) {
    localStorage.setItem('bodyId', bodyId)
    this.router.navigate(['organization-details'], { relativeTo: this.route })
  }
}

