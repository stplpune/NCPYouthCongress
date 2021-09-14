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
import { MatDialog } from '@angular/material/dialog';
import { DeleteComponent } from '../../dialogs/delete/delete.component';

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
  btnText = "Create  Committee";
  organizationRes: any;
  searchText: any;
  districtId: any = "";
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
  //@ViewChild('openDeleteCommitteeModal') openDeleteCommitteeModal: any;
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
  editLevalFlag: any;
  deletebodyId!:number;
  constructor(private callAPIService: CallAPIService, private router: Router, private fb: FormBuilder,
    private toastrService: ToastrService, private commonService: CommonService,public dialog: MatDialog,
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
    this.globalLevelId = levelId;
    if (levelId == 2) {
      this.disableFlagDist = true;
    }
    else if (levelId == 3) {
      this.disableFlagDist = false;
      this.disableFlagTal = true;
      this.disableFlagVill = true;
    }
    else if (levelId == 4) {
      this.disableFlagTal = false;
      this.disableFlagDist = false;
      this.disableFlagVill = true;
    }
    else if (levelId == 5) {
      this.orgMasterForm.controls["VillageId"].setValue("");
      this.disableFlagTal = false;
      this.disableFlagDist = false;
      this.disableFlagVill = false;
      this.setVillOrcityName = "VillageName";
      this.setVillOrCityId = "VillageId";
      this.villageCityLabel = "Village";
      if(this.editLevalFlag == 'edit'  && flag == 'select'){ // DistrictId is availble then show city 
        this.getTaluka(this.orgMasterForm.value.DistrictId);
      }
    }
    else if (levelId == 6) {
      this.orgMasterForm.controls["VillageId"].setValue("");
      this.disableFlagDist = false;
      this.disableFlagTal = true;
      this.disableFlagVill = false;
      this.setVillOrcityName = "CityName";
      this.setVillOrCityId = "Id";
      this.villageCityLabel = "City";
      if(this.editLevalFlag == 'edit' && flag == 'select'){ // DistrictId is availble then show city 
        this.districtEvent(this.orgMasterForm.value.BodyLevelId,this.orgMasterForm.value.DistrictId);
      }

    }
    this.validationOncondition(levelId);
  }

  validationOncondition(levelId: any) {
    if (levelId == 2) {
      this.orgMasterForm.controls["StateId"].setValidators(Validators.required);
    } else if (levelId == 3) {
      this.orgMasterForm.controls["StateId"].setValidators(Validators.required);
      this.orgMasterForm.controls["DistrictId"].setValidators(Validators.required);
    } else if (levelId == 4) {
      this.orgMasterForm.controls["StateId"].setValidators(Validators.required);
      this.orgMasterForm.controls["DistrictId"].setValidators(Validators.required);
      this.orgMasterForm.controls["TalukaId"].setValidators(Validators.required);
    } else if (levelId == 5) {
      this.orgMasterForm.controls["StateId"].setValidators(Validators.required);
      this.orgMasterForm.controls["DistrictId"].setValidators(Validators.required);
      this.orgMasterForm.controls["TalukaId"].setValidators(Validators.required);
      this.orgMasterForm.controls["VillageId"].setValidators(Validators.required);

    } else if (levelId == 6) {
      this.orgMasterForm.controls["StateId"].setValidators(Validators.required);
      this.orgMasterForm.controls["DistrictId"].setValidators(Validators.required);
      this.orgMasterForm.controls["VillageId"].setValidators(Validators.required);
    }
    this.updateValueAndValidityMF(levelId);
  }

  clearselOption(flag: any) { // on click select option close icon
    if (flag == 'State') {
      this.disableFlagDist = true;
      this.disableFlagTal = true;
      this.disableFlagVill = true;
      this.orgMasterForm.controls["StateId"].setValue("");
      this.orgMasterForm.controls["DistrictId"].setValue("");
      this.orgMasterForm.controls["TalukaId"].setValue("");
      this.orgMasterForm.controls["VillageId"].setValue("");
    } else if (flag == 'District') {
      this.disableFlagDist = true;
      this.disableFlagTal = true;
      this.disableFlagVill = true;
      this.orgMasterForm.controls["DistrictId"].setValue("");
      this.orgMasterForm.controls["TalukaId"].setValue("");
      this.orgMasterForm.controls["VillageId"].setValue("");
    } else if (flag == 'Taluka') {
      this.disableFlagDist = true;
      this.disableFlagTal = true;
      this.disableFlagVill = false;
      this.orgMasterForm.controls["TalukaId"].setValue("");
      this.orgMasterForm.controls["VillageId"].setValue("");
    } else if (flag == 'Village') {
      this.orgMasterForm.controls["VillageId"].setValidators(Validators.required);
      this.orgMasterForm.controls["VillageId"].setValue("");
    }
    // this.updateValueAndValidityMF(globalLevelId)
  }

  updateValueAndValidityMF(levelId: any) {
    if (levelId == 2) {
      this.orgMasterForm.controls["StateId"].updateValueAndValidity();
    } else if (levelId == 3) {
      this.orgMasterForm.controls["StateId"].updateValueAndValidity();
      this.orgMasterForm.controls["DistrictId"].updateValueAndValidity();
    } else if (levelId == 4) {
      this.orgMasterForm.controls["StateId"].updateValueAndValidity();
      this.orgMasterForm.controls["DistrictId"].updateValueAndValidity();
      this.orgMasterForm.controls["TalukaId"].updateValueAndValidity();
    } else if (levelId == 5) {
      this.orgMasterForm.controls["StateId"].updateValueAndValidity();
      this.orgMasterForm.controls["DistrictId"].updateValueAndValidity();
      this.orgMasterForm.controls["TalukaId"].updateValueAndValidity();
      this.orgMasterForm.controls["VillageId"].updateValueAndValidity();
    } else if (levelId == 6) {
      this.orgMasterForm.controls["StateId"].updateValueAndValidity();
      this.orgMasterForm.controls["DistrictId"].updateValueAndValidity();
      this.orgMasterForm.controls["TalukaId"].updateValueAndValidity();
      this.orgMasterForm.controls["VillageId"].updateValueAndValidity();
    }
    this.clearValidatorsMF(levelId);
  }

  clearValidatorsMF(levelId: any) {
    if (levelId == 2) {
      this.orgMasterForm.controls["DistrictId"].setValue("");
      this.orgMasterForm.controls["TalukaId"].setValue("");
      this.orgMasterForm.controls["VillageId"].setValue("");
      this.orgMasterForm.controls['DistrictId'].clearValidators();
      this.orgMasterForm.controls["DistrictId"].updateValueAndValidity();
      this.orgMasterForm.controls['TalukaId'].clearValidators();
      this.orgMasterForm.controls["TalukaId"].updateValueAndValidity();
      this.orgMasterForm.controls['VillageId'].clearValidators();
      this.orgMasterForm.controls['VillageId'].updateValueAndValidity();
    } else if (levelId == 3) {
      this.orgMasterForm.controls["TalukaId"].setValue("");
      this.orgMasterForm.controls["VillageId"].setValue("");
      this.orgMasterForm.controls['TalukaId'].clearValidators();
      this.orgMasterForm.controls["TalukaId"].updateValueAndValidity();
      this.orgMasterForm.controls['VillageId'].clearValidators();
      this.orgMasterForm.controls['VillageId'].updateValueAndValidity();
    } else if (levelId == 4) {
      this.orgMasterForm.controls["VillageId"].setValue("");
      this.orgMasterForm.controls['VillageId'].clearValidators();
      this.orgMasterForm.controls['VillageId'].updateValueAndValidity();
    }
    // else if (levelId == 5 || levelId == 6) {
    //   this.orgMasterForm.controls["VillageId"].setValue(null);
    //   this.orgMasterForm.controls['VillageId'].clearValidators();
    //   this.orgMasterForm.controls['VillageId'].updateValueAndValidity();
    // } 
    else if (levelId == 6) {
      this.orgMasterForm.controls["TalukaId"].setValue("");
      this.orgMasterForm.controls['TalukaId'].clearValidators();
      this.orgMasterForm.controls["TalukaId"].updateValueAndValidity();
    }
    //else if (levelId == 6) {
    //   this.orgMasterForm.controls["VillageId"].setValue(null);
    //   this.orgMasterForm.controls['VillageId'].clearValidators();
    //   this.orgMasterForm.controls['VillageId'].updateValueAndValidity();
    // }
  }

  selectLevelClear() {
    this.disableFlagDist = true;
    this.disableFlagTal = true;
    this.disableFlagVill = true;
    this.orgMasterForm.controls["StateId"].setValue("");
    this.orgMasterForm.controls["DistrictId"].setValue("");
    this.orgMasterForm.controls["TalukaId"].setValue("");
    this.orgMasterForm.controls["VillageId"].setValue("");
    this.submitted = false;
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

        this.organizationRes.map((ele: any) => {
          if (ele.DesignationAssigned) {
            let DesigAss = ele.DesignationAssigned.split(',') ;
            ele.DesignationAssigned = DesigAss;
          }
        })

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

  districtEvent(levelId: any, districtId: any) {
    if (levelId == 6) {
      this.globalDistrictId = districtId;
      this.selCity();
    }
  }

  getDistrict() {
    this.spinner.show();
    this.callAPIService.setHttp('get', 'Web_GetDistrict_1_0?StateId=' + 1, false, false, false, 'ncpServiceForWeb');
    this.callAPIService.getHttp().subscribe((res: any) => {
      if (res.data == 0) {
        this.spinner.hide();
        this.allDistrict = res.data1;
        this.globalDistrictId = this.selEditOrganization?.DistrictId;
        if (this.btnText == "Update Committee" && this.globalLevelId == 6) { // edit for city
          this.selCity();
        } else if (this.btnText == "Update Committee" && this.globalLevelId == 5 || this.btnText == "Update Committee" && this.globalLevelId == 4) { // edit for Village
          this.getTaluka(this.globalDistrictId)
        }
      } else {
        // this.toastrService.error("Data is not available 2");
      }
    }, (error: any) => {
      if (error.status == 500) {
        this.router.navigate(['../../500'], { relativeTo: this.route });
      }
    })
  }

  getTaluka(districtId: any) {
    this.globalDistrictId = districtId;
    this.spinner.show();
    this.callAPIService.setHttp('get', 'Web_GetTaluka_1_0?DistrictId=' + districtId, false, false, false, 'ncpServiceForWeb');
    this.callAPIService.getHttp().subscribe((res: any) => {
      if (res.data == 0) {
        this.spinner.hide();
        this.getTalkaByDistrict = res.data1;
        if (this.btnText == "Update Committee" && this.globalLevelId == 5) { // edit for Village
          this.globalTalukaID = this.selEditOrganization.TalukaId;
          if (this.globalTalukaID != "") {
            this.orgMasterForm.patchValue({ TalukaId: this.selEditOrganization.TalukaId});
            this.selVillage();
          } else {
            this.orgMasterForm.controls["TalukaId"].setValue(null);
          }
        }
        if (this.btnText == "Update Committee" && this.globalLevelId == 4) {
          this.orgMasterForm.patchValue({ TalukaId: this.selEditOrganization.TalukaId});
        }
      } else {
        // this.toastrService.error("Data is not available");
      }
    }, (error: any) => {
      if (error.status == 500) {
        this.router.navigate(['../../500'], { relativeTo: this.route });
      }
    })
  }

  getVillageOrCity(talukaID: any, selType: any) {
    let appendString = "";
    selType == 'Village' ? appendString = 'Web_GetVillage_1_0?talukaid=' + talukaID : appendString = 'Web_GetCity_1_0?DistrictId=' + this.globalDistrictId;
    this.callAPIService.setHttp('get', appendString, false, false, false, 'ncpServiceForWeb');
    this.callAPIService.getHttp().subscribe((res: any) => {
      if (res.data == 0) {
        this.spinner.hide();
        this.resultVillageOrCity = res.data1;
        if (this.btnText == "Update Committee") { // edit
          let VillageId:any;
          (this.selEditOrganization.BodyLevel != this.orgMasterForm.value.BodyLevelId) ? VillageId = this.orgMasterForm.value.VillageId : VillageId = this.selEditOrganization.VillageId;
          this.orgMasterForm.patchValue({ VillageId: VillageId});
        }
      } else {
        // this.toastrService.error("Data is not available");
      }
    }, (error: any) => {
      if (error.status == 500) {
        this.router.navigate(['../../500'], { relativeTo: this.route });
      }
    })
  }

  get f() { return this.orgMasterForm.controls };

  onSubmit() {
    this.spinner.show();
    this.submitted = true;
    if (this.orgMasterForm.invalid) {
      this.spinner.hide();
      return;
    }
    else {
      let fromData: any = new FormData();
      this.orgMasterForm.value.BodyLevelId == 6 ? this.orgMasterForm.value.IsRural = 0 : this.orgMasterForm.value.IsRural = 1;
      

      Object.keys(this.orgMasterForm.value).forEach((cr: any, ind: any) => {
        let value = Object.values(this.orgMasterForm.value)[ind] != null ? Object.values(this.orgMasterForm.value)[ind] : 0;
        fromData.append(cr, value)
      })
      // this.orgMasterForm.value.Id == null ? this.orgMasterForm.value.Id = 0 : this.orgMasterForm.value.Id = this.orgMasterForm.value.Id;
      let btnTextFlag:any;
      this.btnText == "Create  Committee" ? btnTextFlag =  0 : btnTextFlag =  this.HighlightRow;
      fromData.append('Id', btnTextFlag);

      this.callAPIService.setHttp('Post', 'Web_Insert_Bodycellorgmaster_1_0', false, fromData, false, 'ncpServiceForWeb');
      this.callAPIService.getHttp().subscribe((res: any) => {
        if (res.data == 0) {
          this.btnText = "Create  Committee";
          this.editLevalFlag = "";
          this.selectLevelClear();
          this.spinner.hide();
          this.toastrService.success(res.data1[0].Msg);
          this.getOrganizationList();
          this.clearForm();
        } else {
          // this.toastrService.error("Data is not available");
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
    this.selectLevelClear();
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
    this.btnText = "Update Committee";
    this.spinner.show();
    this.callAPIService.setHttp('get', 'Web_Getbodycellorgmaster_1_0?BodyId=' + BodyId, false, false, false, 'ncpServiceForWeb');
    this.callAPIService.getHttp().subscribe((res: any) => {
      if (res.data == 0) {
        this.spinner.hide();
        this.selEditOrganization = res.data1[0];
        this.HighlightRow = this.selEditOrganization.Id;
        this.editLevalFlag = "edit"
        this.selectLevel(this.selEditOrganization.BodyLevel, this.editLevalFlag);
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
        // this.toastrService.error("Data is not available");
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
        if (this.btnText == "Update Committee") { // edit
          this.orgMasterForm.patchValue({ VillageId: this.selEditOrganization.VillageId });
        }
      } else {
        // this.toastrService.error("Data is not available");
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
          this.submitted = false;
          this.clearAddDesignationForm();
          this.spinner.hide();
          this.toastrService.success(res.data1[0].Msg);
          // this.closeModalAddDes();
          this.getBodyAssignedDesignation();
          this.AlreadyAssignedDesignations(this.desBodyId);
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
    // if (officeBearers == "" || officeBearers == null) {
    //   this.toastrService.error("Data not found..");
    // } else {
      let obj = { bodyId: bodyId, BodyOrgCellName: BodyOrgCellName }
      sessionStorage.setItem('bodyId', JSON.stringify(obj))
      this.router.navigate(['details'], { relativeTo: this.route })
    //}
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
        this.getOrganizationList();
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
    this.villageCityLabel = "City";
    if (this.globalDistrictId == undefined || this.globalDistrictId == "") {
      this.toastrService.error("Please select district");
      return
    } else {
      this.disableFlagVill = false;
      this.getVillageOrCity(this.globalDistrictId, 'City');
      this.setVillOrcityName = "CityName";
      this.setVillOrCityId = "Id";
    }
  }

  selVillage() {
    if (this.globalDistrictId == undefined || this.globalDistrictId == "") {
      this.toastrService.error("Please select district");
      return
    } else {
      this.disableFlagVill = false;
      this.globalTalukaID == undefined ? this.globalTalukaID = 0 : this.globalTalukaID;
      this.btnText == "Update Committee" ? this.getVillageOrCity(this.globalTalukaID, 'Village') : '';
      this.setVillOrcityName = "VillageName";
      this.setVillOrCityId = "VillageId";
    }
  }

  deleteCommitteeConfirmation(bodyId:any,allottedDesignation:any){
    if(allottedDesignation == 0){
      // let clickDeleteCommitteeModal = this.openDeleteCommitteeModal.nativeElement;
      // clickDeleteCommitteeModal.click();
      this.deletebodyId = bodyId;
      this.deleteConfirmModel();
    }else{
      this.toastrService.info('Designations are already assigned to this Committee');
    }
  }

  deleteConfirmModel() {
    const dialogRef = this.dialog.open(DeleteComponent);
    dialogRef.afterClosed().subscribe(result => {
      if(result == 'Yes'){
        this.deletecommittee();
      }
    });
  }

  deletecommittee(){
    this.spinner.show();
    this.callAPIService.setHttp('get', 'Web_Delete_bodycellorgmaster_1_0?UserId='+this.commonService.loggedInUserId()+'&BodyId=' + this.deletebodyId, false, false, false, 'ncpServiceForWeb');
    this.callAPIService.getHttp().subscribe((res: any) => {
      if (res.data == 0) {
        this.spinner.hide();
        this.toastrService.success(res.data1[0].Msg)
      } else {
        this.spinner.hide();
      }
      this.getOrganizationList();
    }, (error: any) => {
      this.spinner.hide();
      if (error.status == 500) {
        this.router.navigate(['../../500'], { relativeTo: this.route });
      }
    })
  }
}

