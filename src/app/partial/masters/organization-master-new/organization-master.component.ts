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
import { AddMemberComponent } from '../../dialogs/add-member/add-member.component';
import { AddDesignationComponent } from '../../dialogs/add-designation/add-designation.component';

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
  allotedDesignationArray = [{ id: 0, name: "All" }, { id: 2, name: "No" }, { id: 5, name: "1 To 5" }, { id: 10, name: "5 To 10" }, , { id: 11, name: "Above 10" }];
  defultCategory = "Rural";
  selCityFlag: boolean = false;
  selVillageFlag: boolean = true;
  resultVillageOrCity: any;
  villageCityLabel = "Village/Town";
  allStates: any;
  globalDistrictId: any;
  allLevels: any;
  setVillOrcityName = "VillageName";
  setVillOrCityId = "VillageId";
  submitted = false;
  addDesFormSubmitted = false;
  btnText = "Create Committee";
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
  deletebodyId!: number;
  heightedRow: any;
  getSessionData: any;
  getCommiteeDetails: any;
  checkUserlevel: any;
  resCommitteeByLevel: any;
  result: any;
  allDistrictByCommittee: any;

  constructor(private callAPIService: CallAPIService, private router: Router, private fb: FormBuilder,
    private toastrService: ToastrService, public commonService: CommonService, public dialog: MatDialog,
    private spinner: NgxSpinnerService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.checkUserlevel = this.commonService.getsessionStorageData();
    this.getSessionData = this.commonService.getsessionStorageData();
    this.defultFilterForm();
    this.getOrganizationList();
    this.customForm();
    this.getLevel();
    this.searchFilters('false');
    this.getDistrictByCommittee();
    this.getCommiteeDetails = this.commonService.getCommiteeInfo();
  }

  initCommittees() {
    this.getState();
    this.getDistrict();
    this.getDesignation();
    this.defaultDesignationForm();
  }

  selectLevel(levelId: any, flag: any) {
    this.globalLevelId = levelId;
    console.log(levelId);
    if (levelId == 2) {
      this.disableFlagDist = true;
      if (this.editLevalFlag == 'edit' && flag == 'select') { // DistrictId is availble then show city 
        this.orgMasterForm.controls["SubParentCommitteeId"].setValue("");
      }
    }
    else if (levelId == 3) {
      this.orgMasterForm.controls["SubParentCommitteeId"].setValue("");
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
      this.villageCityLabel = "Village/Town";
      if (this.editLevalFlag == 'edit' && flag == 'select') { // DistrictId is availble then show city 
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
      this.villageCityLabel = "City/District";
      if (this.editLevalFlag == 'edit' && flag == 'select') { // DistrictId is availble then show city 
        this.districtEvent(this.orgMasterForm.value.BodyLevelId, this.orgMasterForm.value.DistrictId);
      }

    }
    this.validationOncondition(levelId);
  }

  validationOncondition(levelId: any) {
    if (levelId == 2) {
      this.orgMasterForm.controls["StateId"].setValidators(Validators.required);
    } else if (levelId == 3) {
      this.orgMasterForm.controls["SubParentCommitteeId"].setValidators(Validators.required);
      this.orgMasterForm.controls["StateId"].setValidators(Validators.required);
      this.orgMasterForm.controls["DistrictId"].setValidators(Validators.required);
    } else if (levelId == 4) {
      this.orgMasterForm.controls["SubParentCommitteeId"].setValidators(Validators.required);
      this.orgMasterForm.controls["StateId"].setValidators(Validators.required);
      this.orgMasterForm.controls["DistrictId"].setValidators(Validators.required);
      this.orgMasterForm.controls["TalukaId"].setValidators(Validators.required);

    } else if (levelId == 5) {
      this.orgMasterForm.controls["SubParentCommitteeId"].setValidators(Validators.required);
      this.orgMasterForm.controls["StateId"].setValidators(Validators.required);
      this.orgMasterForm.controls["DistrictId"].setValidators(Validators.required);
      this.orgMasterForm.controls["TalukaId"].setValidators(Validators.required);
      this.orgMasterForm.controls["VillageId"].setValidators(Validators.required);

    } else if (levelId == 6) {
      this.orgMasterForm.controls["SubParentCommitteeId"].setValidators(Validators.required);
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
      this.orgMasterForm.controls["SubParentCommitteeId"].setValue("");
    } else if (flag == 'Taluka') {
      this.disableFlagDist = true;
      this.disableFlagTal = true;
      this.disableFlagVill = false;
      this.orgMasterForm.controls["TalukaId"].setValue("");
      this.orgMasterForm.controls["VillageId"].setValue("");
      this.orgMasterForm.controls["SubParentCommitteeId"].setValue("");
    } else if (flag == 'Village') {
      this.orgMasterForm.controls["VillageId"].setValidators(Validators.required);
      this.orgMasterForm.controls["VillageId"].setValue("");
      this.orgMasterForm.controls["SubParentCommitteeId"].setValue("");
    } else if (flag == 'SubParentCommitteeId') {
      this.orgMasterForm.controls["SubParentCommitteeId"].setValidators(Validators.required);
      this.orgMasterForm.controls["SubParentCommitteeId"].setValue("");
    }
    // this.updateValueAndValidityMF(globalLevelId)
  }

  updateValueAndValidityMF(levelId: any) {
    if (levelId == 2) {
      this.orgMasterForm.controls["StateId"].updateValueAndValidity();
    } else if (levelId == 3) {
      this.orgMasterForm.controls["SubParentCommitteeId"].updateValueAndValidity();
      this.orgMasterForm.controls["StateId"].updateValueAndValidity();
      this.orgMasterForm.controls["DistrictId"].updateValueAndValidity();
    } else if (levelId == 4) {
      this.orgMasterForm.controls["SubParentCommitteeId"].updateValueAndValidity();
      this.orgMasterForm.controls["StateId"].updateValueAndValidity();
      this.orgMasterForm.controls["DistrictId"].updateValueAndValidity();
      this.orgMasterForm.controls["TalukaId"].updateValueAndValidity();
    } else if (levelId == 5) {
      this.orgMasterForm.controls["SubParentCommitteeId"].updateValueAndValidity();
      this.orgMasterForm.controls["StateId"].updateValueAndValidity();
      this.orgMasterForm.controls["DistrictId"].updateValueAndValidity();
      this.orgMasterForm.controls["TalukaId"].updateValueAndValidity();
      this.orgMasterForm.controls["VillageId"].updateValueAndValidity();
    } else if (levelId == 6) {
      this.orgMasterForm.controls["SubParentCommitteeId"].updateValueAndValidity();
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
      this.orgMasterForm.controls["SubParentCommitteeId"].setValue("");
      this.orgMasterForm.controls['DistrictId'].clearValidators();
      this.orgMasterForm.controls["DistrictId"].updateValueAndValidity();
      this.orgMasterForm.controls['TalukaId'].clearValidators();
      this.orgMasterForm.controls["TalukaId"].updateValueAndValidity();
      this.orgMasterForm.controls['VillageId'].clearValidators();
      this.orgMasterForm.controls['VillageId'].updateValueAndValidity();
      this.orgMasterForm.controls['SubParentCommitteeId'].clearValidators();
      this.orgMasterForm.controls['SubParentCommitteeId'].updateValueAndValidity();
    } else if (levelId == 3) {
      this.orgMasterForm.controls["TalukaId"].setValue("");
      this.orgMasterForm.controls["VillageId"].setValue("");
      this.orgMasterForm.controls["SubParentCommitteeId"].setValue("");
      this.orgMasterForm.controls['TalukaId'].clearValidators();
      this.orgMasterForm.controls["TalukaId"].updateValueAndValidity();
      this.orgMasterForm.controls["SubParentCommitteeId"].updateValueAndValidity();
      this.orgMasterForm.controls['VillageId'].clearValidators();
      this.orgMasterForm.controls['VillageId'].updateValueAndValidity();
      this.orgMasterForm.controls['SubParentCommitteeId'].updateValueAndValidity();
    } else if (levelId == 4) {
      this.orgMasterForm.controls["VillageId"].setValue("");
      this.orgMasterForm.controls["SubParentCommitteeId"].setValue("");
      this.orgMasterForm.controls['VillageId'].clearValidators();
      this.orgMasterForm.controls['SubParentCommitteeId'].updateValueAndValidity();
      this.orgMasterForm.controls['VillageId'].updateValueAndValidity();
      this.orgMasterForm.controls['SubParentCommitteeId'].updateValueAndValidity();
    }
    // else if (levelId == 5 || levelId == 6) {
    //   this.orgMasterForm.controls["VillageId"].setValue(null);
    //   this.orgMasterForm.controls['VillageId'].clearValidators();
    //   this.orgMasterForm.controls['VillageId'].updateValueAndValidity();
    // } 
    else if (levelId == 6) {
      this.orgMasterForm.controls["TalukaId"].setValue("");
      this.orgMasterForm.controls["SubParentCommitteeId"].setValue("");
      this.orgMasterForm.controls['TalukaId'].clearValidators();
      this.orgMasterForm.controls['SubParentCommitteeId'].updateValueAndValidity();
      this.orgMasterForm.controls["TalukaId"].updateValueAndValidity();
      this.orgMasterForm.controls["SubParentCommitteeId"].updateValueAndValidity();
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
    this.orgMasterForm.controls["SubParentCommitteeId"].setValue("");
    this.submitted = false;
  }

  customForm() {
    this.orgMasterForm = this.fb.group({
      BodyOrgCellName: ['', [Validators.required, Validators.maxLength(100)]],
      StateId: ['', Validators.required],
      DistrictId: [],
      TalukaId: [''],
      VillageId: [''],
      IsRural: [1],
      BodyLevelId: ['', Validators.required],
      SubParentCommitteeId: [''],
      CreatedBy: [this.commonService.loggedInUserId()],
    })
  }

  defultFilterForm() {
    this.filterForm = this.fb.group({
      filterDistrict: [0],
      searchText: [''],
      AllotedDesignation: [],
      LevelId: [0],
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
    let data = '?UserId=' + this.commonService.loggedInUserId() + '&DistrictId=' + filterData.filterDistrict + '&Search=' + filterData.searchText + '&nopage=' + this.paginationNo + '&AllotedDesignation=' + filterData.AllotedDesignation + '&LevelId=' + 2; //filterData.LevelId
    this.callAPIService.setHttp('get', 'Web_GetOrganizationAssignedBody_1_0_Committee' + data, false, false, false, 'ncpServiceForWeb'); // old Web_GetOrganizationAssignedBody_1_0
    this.callAPIService.getHttp().subscribe((res: any) => {
      if (res.data == 0) {
        this.spinner.hide();
        this.organizationRes = res.data1;

        this.organizationRes.map((ele: any) => {
          if (ele.DesignationAssigned) {
            let DesigAss = ele.DesignationAssigned.split(',');
            ele.DesignationAssigned = DesigAss;
          }
        })


        // const updateMap: {
        //   [id: number]: {
        //     name: string;
        //     photo: string;
        //     designation: string;
        //     mobileNo: string;
        //       memberList:any,
        //   }
        // } =
        //  {
        //   358: {
        //     name: 'Mehboob Shaikh',
        //     photo: 'assets/images/dashboard-images/ncp-default.png',
        //     designation: 'अध्यक्ष',
        //     mobileNo: '9123456780',
        //    memberList:['assets/images/dashboard-images/ncp-default.png',
        //     'assets/images/executive-members/Mehbub-Shaikh.png',
        //     'assets/images/executive-members/Sakshna-Salgar.png',
        //   'assets/images/executive-members/Sunil-Gavhane.png'],
        //   },
        //   366: {
        //     name: 'Rohini Khadase',
        //     photo: 'assets/images/executive-members/rohini-khadase.png',
        //     designation: 'अध्यक्ष',
        //     mobileNo: '9876543210',
        //     memberList:['assets/images/executive-members/rohini-khadase.png'],
        //   },
        //   3: {
        //     name: 'Mehboob Shaikh',
        //     photo: 'assets/images/executive-members/Mehbub-Shaikh.png',
        //     designation: 'अध्यक्ष',
        //     mobileNo: '9123456780',
        //    memberList:['assets/images/executive-members/Mehbub-Shaikh.png',
        //     'https://ncpservice.ncpyouths.com//Images/ProfilePhoto/29062022062447674PM_22_IMG_20220629_182430.jpg'],
        //   },
        //   365: {
        //     name: 'Sakshna Salgar',
        //     photo: 'assets/images/executive-members/Sakshna-Salgar.png',
        //     designation: 'अध्यक्ष',
        //     mobileNo: '9988776655',
        //    memberList:['assets/images/executive-members/Sakshna-Salgar.png'],
        //   },
        //   367: {
        //     name: 'Sunil Gavhane',
        //     photo: 'assets/images/executive-members/Sunil-Gavhane.png',
        //     designation: 'अध्यक्ष',
        //     mobileNo: '9090909090',
        //     memberList:['assets/images/executive-members/Sunil-Gavhane.png'],
        //   }
        // };

        // this.organizationRes.forEach((ele: any) => {
        //   const update = updateMap[ele.Id];
        //   if (update) {
        //     ele.name = update.name;
        //     ele.photo = update.photo;
        //     ele.designation = update.designation;
        //     ele.mobileNo = update.mobileNo;
        //    ele.memberList = update.memberList;
        //   }
        // });

        this.organizationRes = [
          {
            "SrNo": 1,
            "Id": 358,
            "BodyOrgCellName": "Maharashtra NCP Pradesh Committee",
            "bodylevel": 2,
            "LevelName": "State",
            "Area": "Maharashtra",
            "StateName": "Maharashtra",
            "districtName": "",
            "TalukaName": "",
            "VillageName": "",
            "DesignationAssigned": [
              "President - (अध्यक्ष)",
              "Vice-President - (उपाध्यक्ष) ",
              "General Secretary - (सरचिटणीस)",
              "Secretary - (सचिव)",
              "Member - (सदस्य)"
            ],
            "AllottedDesignation": 0,
            "SubParentCommitteeId": 358,
            "LevelSort": 1,
            "name": "Sagar Patil",
            "photo": "assets/images/dashboard-images/ncp-default.png",
            "designation": "अध्यक्ष",
            "mobileNo": "9123456780",
            "memberList": [
              "assets/images/dashboard-images/ncp-default.png",
              "assets/images/executive-members/Mehbub-Shaikh.png",
              "assets/images/executive-members/Sakshna-Salgar.png",
              "assets/images/executive-members/Sunil-Gavhane.png"
            ]
          },
          {
            "SrNo": 2,
            "Id": 366,
            "BodyOrgCellName": "Maharashtra Pradesh Mahila Karykarani ",
            "bodylevel": 2,
            "LevelName": "State",
            "Area": "Maharashtra",
            "StateName": "Maharashtra",
            "districtName": "",
            "TalukaName": "",
            "VillageName": "",
            "DesignationAssigned": [
              "President - (अध्यक्ष)",
              "Vice-President - (उपाध्यक्ष) ",
              "General Secretary - (सरचिटणीस)",
              "Secretary - (सचिव)",
              "Member - (सदस्य)"
            ],
            "AllottedDesignation": 1,
            "SubParentCommitteeId": 358,
            "LevelSort": 1,
            "name": "Rohini Khadase",
            "photo": "assets/images/executive-members/rohini-khadase.png",
            "designation": "अध्यक्ष",
            "mobileNo": "9876543210",
            "memberList": [
              "assets/images/executive-members/rohini-khadase.png"
            ]
          },

          {
            "SrNo": 4,
            "Id": 3,
            "BodyOrgCellName": "Maharashtra Pradesh Yuvak Karykarani",
            "bodylevel": 2,
            "LevelName": "State",
            "Area": "Maharashtra",
            "StateName": "Maharashtra",
            "districtName": "",
            "TalukaName": "",
            "VillageName": "",
            "DesignationAssigned": [
              "President - (अध्यक्ष)",
              "Acting President - (कार्याध्यक्ष) ",
              "Vice-President - (उपाध्यक्ष) ",
              "General Secretary - (सरचिटणीस)",
              "Secretary - (सचिव)",
              "Member - (सदस्य)"
            ],
            "AllottedDesignation": 107,
            "SubParentCommitteeId": 3,
            "LevelSort": 1,
            "name": "Mehboob Shaikh",
            "photo": "assets/images/executive-members/Mehbub-Shaikh.png",
            "designation": "अध्यक्ष",
            "mobileNo": "9123456780",
            "memberList": [
              "assets/images/executive-members/Mehbub-Shaikh.png",
              "https://ncpservice.ncpyouths.com//Images/ProfilePhoto/29062022062447674PM_22_IMG_20220629_182430.jpg"
            ]
          },
          {
            "SrNo": 5,
            "Id": 365,
            "BodyOrgCellName": "Maharashtra Pradesh Yuvati Karykarani ",
            "bodylevel": 2,
            "LevelName": "State",
            "Area": "Maharashtra",
            "StateName": "Maharashtra",
            "districtName": "",
            "TalukaName": "",
            "VillageName": "",
            "DesignationAssigned": [
              "President - (अध्यक्ष)",
              "Vice-President - (उपाध्यक्ष) ",
              "General Secretary - (सरचिटणीस)",
              "Secretary - (सचिव)",
              "Member - (सदस्य)"
            ],
            "AllottedDesignation": 1,
            "SubParentCommitteeId": 358,
            "LevelSort": 1,
            "name": "Sakshna Salgar",
            "photo": "assets/images/executive-members/Sakshna-Salgar.png",
            "designation": "अध्यक्ष",
            "mobileNo": "9988776655",
            "memberList": [
              "assets/images/executive-members/Sakshna-Salgar.png"
            ]
          },
          {
            "SrNo": 3,
            "Id": 367,
            "BodyOrgCellName": "Maharashtra Pradesh Vidhyarti  Karykarani",
            "bodylevel": 2,
            "LevelName": "State",
            "Area": "Maharashtra",
            "StateName": "Maharashtra",
            "districtName": "",
            "TalukaName": "",
            "VillageName": "",
            "DesignationAssigned": [
              "President - (अध्यक्ष)",
              "Vice-President - (उपाध्यक्ष) ",
              "General Secretary - (सरचिटणीस)",
              "Secretary - (सचिव)",
              "Member - (सदस्य)"
            ],
            "AllottedDesignation": 1,
            "SubParentCommitteeId": 358,
            "LevelSort": 1,
            "name": "Sunil Gavhane",
            "photo": "assets/images/executive-members/Sunil-Gavhane.png",
            "designation": "अध्यक्ष",
            "mobileNo": "9090909090",
            "memberList": [
              "assets/images/executive-members/Sunil-Gavhane.png"
            ]
          }

        ]

        if (this.commonService.loggedInUserId() != 1) {
          this.organizationRes = this.organizationRes.filter((ele: any) => ele.Id !== 358);
        }


        console.log(this.organizationRes);

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
    //this.spinner.show();
    this.callAPIService.setHttp('get', 'Web_GetLevel_1_0_Committee?UserId=' + this.commonService.loggedInUserId(), false, false, false, 'ncpServiceForWeb'); // old API Web_GetLevel_1_0
    this.callAPIService.getHttp().subscribe((res: any) => {
      if (res.data == 0) {
        this.allLevels = res.data1;
        this.spinner.hide();
      } else {
        this.spinner.hide();
        // this.toastrService.error("Data is not available 1");
      }
    }, (error: any) => {
      if (error.status == 500) {
        this.spinner.hide();
        this.router.navigate(['../../500'], { relativeTo: this.route });
      }
    })
  }

  getCommitteeByLevel(bodyLevelId: any) {
    //this.spinner.show();
    this.callAPIService.setHttp('get', 'Web_GetBodyOrgCellName_1_0_Parent_Committee?UserId=' + this.commonService.loggedInUserId() + '&BodyLevelId=' + bodyLevelId, false, false, false, 'ncpServiceForWeb'); // old API Web_GetLevel_1_0
    this.callAPIService.getHttp().subscribe((res: any) => {
      if (res.data == 0) {
        this.resCommitteeByLevel = res.data1;
        if (this.btnText == "Update Committee") { // edit for city
          this.orgMasterForm.controls["SubParentCommitteeId"].setValue(this.selEditOrganization.SubParentCommitteeId)
          this.getDistrict();
        }
        this.spinner.hide();
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
    //this.spinner.show();
    this.callAPIService.setHttp('get', 'Web_GetState_1_0_Committee?UserId=' + this.commonService.loggedInUserId(), false, false, false, 'ncpServiceForWeb'); // old API Web_GetState_1_0 
    this.callAPIService.getHttp().subscribe((res: any) => {
      if (res.data == 0) {
        this.allStates = res.data1;
        this.spinner.hide();
      } else {
        //this.toastrService.error("Data is not available");
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
    //this.spinner.show();
    this.callAPIService.setHttp('get', 'Web_GetDistrict_1_0_Committee?StateId=' + 1 + '&UserId=' + this.commonService.loggedInUserId(), false, false, false, 'ncpServiceForWeb'); // old API Web_GetDistrict_1_0
    this.callAPIService.getHttp().subscribe((res: any) => {
      if (res.data == 0) {
        this.allDistrict = res.data1;
        this.globalDistrictId = this.selEditOrganization?.DistrictId;
        if (this.btnText == "Update Committee" && this.globalLevelId == 6) { // edit for city
          this.selCity();
        } else if (this.btnText == "Update Committee" && this.globalLevelId == 5 || this.btnText == "Update Committee" && this.globalLevelId == 4) { // edit for Village
          this.getTaluka(this.globalDistrictId)
        }
        this.spinner.hide();
      } else {
        this.spinner.hide();
        // this.toastrService.error("Data is not available 2");
      }
    }, (error: any) => {
      if (error.status == 500) {
        this.spinner.hide();
        this.router.navigate(['../../500'], { relativeTo: this.route });
      }
    })
  }

  getDistrictByCommittee() {
    //this.spinner.show();
    this.callAPIService.setHttp('get', 'Web_GetDistrict_1_0_CommitteeonMap?StateId=' + 1 + '&UserId=' + this.commonService.loggedInUserId(), false, false, false, 'ncpServiceForWeb'); // old API Web_GetDistrict_1_0
    this.callAPIService.getHttp().subscribe((res: any) => {
      if (res.data == 0) {
        this.allDistrictByCommittee = res.data1;
        this.spinner.hide();
      } else {
        this.spinner.hide();
        // this.toastrService.error("Data is not available 2");
      }
    }, (error: any) => {
      if (error.status == 500) {
        this.spinner.hide();
        this.router.navigate(['../../500'], { relativeTo: this.route });
      }
    })
  }

  getTaluka(districtId: any) {
    this.globalDistrictId = districtId;
    //this.spinner.show();
    this.callAPIService.setHttp('get', 'Web_GetTaluka_1_0_Committee?DistrictId=' + districtId + '&UserId=' + this.commonService.loggedInUserId(), false, false, false, 'ncpServiceForWeb'); //old API Web_GetTaluka_1_0
    this.callAPIService.getHttp().subscribe((res: any) => {
      if (res.data == 0) {
        this.getTalkaByDistrict = res.data1;
        if (this.btnText == "Update Committee" && this.globalLevelId == 5) { // edit for Village
          this.globalTalukaID = this.selEditOrganization.TalukaId;
          if (this.globalTalukaID != "") {
            this.orgMasterForm.patchValue({ TalukaId: this.selEditOrganization.TalukaId });
            this.selVillage();
          } else {
            this.orgMasterForm.controls["TalukaId"].setValue(null);
          }
        }
        if (this.btnText == "Update Committee" && this.globalLevelId == 4) {
          this.orgMasterForm.patchValue({ TalukaId: this.selEditOrganization.TalukaId });
        }
        this.spinner.hide();
      } else {
        this.spinner.hide();
        // //this.toastrService.error("Data is not available");
      }
    }, (error: any) => {
      if (error.status == 500) {
        this.router.navigate(['../../500'], { relativeTo: this.route });
      }
    })
  }

  getVillageOrCity(talukaID: any, selType: any) {
    //this.spinner.show();
    let appendString = "";
    selType == 'Village/Town' ? appendString = 'Web_GetVillage_1_0_Committee?talukaid=' + talukaID + '&UserId=' + this.commonService.loggedInUserId() : appendString = 'Web_GetCity_1_0_Committee?DistrictId=' + this.globalDistrictId + '&UserId=' + this.commonService.loggedInUserId(); //Web_GetVillage_1_0
    this.callAPIService.setHttp('get', appendString, false, false, false, 'ncpServiceForWeb');
    this.callAPIService.getHttp().subscribe((res: any) => {
      if (res.data == 0) {
        this.resultVillageOrCity = res.data1;
        if (this.btnText == "Update Committee") { // edit
          let VillageId: any;
          (this.selEditOrganization.BodyLevel != this.orgMasterForm.value.BodyLevelId) ? VillageId = this.orgMasterForm.value.VillageId : VillageId = this.selEditOrganization.VillageId;
          this.orgMasterForm.patchValue({ VillageId: VillageId });
        }
      } else {
        this.spinner.hide();
        // //this.tothis.spinner.hide();astrService.error("Data is not available");
      }
      this.spinner.hide();
    }, (error: any) => {
      if (error.status == 500) {
        this.spinner.hide();
        this.router.navigate(['../../500'], { relativeTo: this.route });
      }
    })
  }

  get f() { return this.orgMasterForm.controls };

  onSubmit() {
    this.submitted = true;
    if (this.orgMasterForm.invalid) {
      this.spinner.hide();
      return;
    }
    else if (this.orgMasterForm.value.BodyOrgCellName.trim() == '' || this.orgMasterForm.value.BodyOrgCellName == null || this.orgMasterForm.value.BodyOrgCellName == undefined) {
      this.toastrService.error("Committee Name can not contain space only");
      this.spinner.hide();
      return;
    }
    else {
      // //this.spinner.show();
      let fromData: any = new FormData();
      this.orgMasterForm.value.BodyLevelId == 6 ? this.orgMasterForm.value.IsRural = 0 : this.orgMasterForm.value.IsRural = 1;


      Object.keys(this.orgMasterForm.value).forEach((cr: any, ind: any) => {
        let value = Object.values(this.orgMasterForm.value)[ind] != null ? Object.values(this.orgMasterForm.value)[ind] : 0;
        fromData.append(cr, value)
      })
      // this.orgMasterForm.value.Id == null ? this.orgMasterForm.value.Id = 0 : this.orgMasterForm.value.Id = this.orgMasterForm.value.Id;
      let btnTextFlag: any;
      this.btnText == "Create Committee" ? btnTextFlag = 0 : btnTextFlag = this.HighlightRow;
      fromData.append('Id', btnTextFlag);

      this.callAPIService.setHttp('Post', 'Web_Insert_bodycellorgmaster_1_0_SubCommittee', false, fromData, false, 'ncpServiceForWeb');
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
          // //this.toastrService.error("Data is not available");
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
    this.paginationNo = 1;
    // this.orgMasterForm.reset({ IsRural: 1});
    this.customForm();
    this.getOrganizationList();
    this.selectLevelClear();
    this.btnText = "Create Committee";
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
    } else if (flag == 'level') {
      this.filterForm.controls['LevelId'].setValue(0);
    }
    this.paginationNo = 1;
    this.getOrganizationList();
  }

  editOrganization(BodyId: any) {
    this.clearForm();
    this.btnText = "Update Committee";
    //this.spinner.show();
    this.callAPIService.setHttp('get', 'Web_Getbodycellorgmaster_1_0?BodyId=' + BodyId, false, false, false, 'ncpServiceForWeb');
    this.callAPIService.getHttp().subscribe((res: any) => {
      if (res.data == 0) {
        this.spinner.hide();
        this.selEditOrganization = res.data1[0];
        this.HighlightRow = this.selEditOrganization.Id;
        this.editLevalFlag = "edit"
        this.selectLevel(this.selEditOrganization.BodyLevel, this.editLevalFlag);
        this.getCommitteeByLevel(this.selEditOrganization.BodyLevel);
        this.orgMasterForm.patchValue({
          BodyOrgCellName: this.selEditOrganization.BodyOrgCellName.trim(),
          StateId: this.selEditOrganization.StateId,
          DistrictId: this.selEditOrganization.DistrictId,
          IsRural: this.selEditOrganization.IsRural,
          BodyLevelId: this.selEditOrganization.BodyLevel,
          CreatedBy: this.commonService.loggedInUserId()
        })
      } else {
        // //this.toastrService.error("Data is not available");
      }
    }, (error: any) => {
      if (error.status == 500) {
        this.router.navigate(['../../500'], { relativeTo: this.route });
      }
    })
  }

  getDesignation() {
    //this.spinner.show();
    this.callAPIService.setHttp('get', 'Web_Getdesignationmaster_1_0', false, false, false, 'ncpServiceForWeb');
    this.callAPIService.getHttp().subscribe((res: any) => {
      if (res.data == 0) {
        this.spinner.hide();
        this.resultDesignation = res.data1;
        if (this.btnText == "Update Committee") { // edit
          this.orgMasterForm.patchValue({ VillageId: this.selEditOrganization.VillageId });
        }
      } else {
        // //this.toastrService.error("Data is not available");
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
    const dialogRef = this.dialog.open(AddDesignationComponent, {
      width: '1024px',
      data: { committeeName: BodyOrgCellName, committeeId: bodyId }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result == 'Yes' || result == 'No') {
        this.getOrganizationList();
      }
    });
    // this.desBodyId = bodyId;
    // this.getBodyAssignedDesignation();
    // this.AlreadyAssignedDesignations(this.desBodyId)
    // this.AddDesignationForm.patchValue({
    //   BodyId: BodyOrgCellName
    // })
  }

  AlreadyAssignedDesignations(desBodyId: any) {
    //this.spinner.show();
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
    //this.spinner.show();
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
          this.addDesignation = 'Add';
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
    this.heightedRow = data.SrNo;
    this.addDesignation = 'Edit';
    this.AddDesignationForm.patchValue({
      Id: data.Id,
      BodyId: this.AddDesignationForm.value.BodyId,
      DesignationId: data.DesignationId,
      IsMultiple: data.IsMultiple,
      CreatedBy: this.commonService.loggedInUserId(),
    })
    this.editRadioBtnClick = data.IsMultiple;
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

  redirectOrgDetails(bodyId: any, bodylevelId: any, BodyOrgCellName: any) {
    // if (officeBearers == "" || officeBearers == null) {
    //   this.toastrService.error("Data not found..");
    // } else {
    let obj = { bodyId: bodyId, BodyOrgCellName: BodyOrgCellName, bodylevelId: bodylevelId }
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

  // swingDesignation(event: CdkDragDrop<string[]>) {
  //   moveItemInArray(this.allBodyAssignedDesignation, event.previousIndex, event.currentIndex);
  //   let stringDesignation: any = 'oldChangeId=' + this.allBodyAssignedDesignation[event.previousIndex].Id + '&oldChangesSortNo=' + this.allBodyAssignedDesignation[event.previousIndex].SrNo
  //     + '&NewChangeId=' + this.allBodyAssignedDesignation[event.currentIndex].Id + '&NewChangesSortNo=' + this.allBodyAssignedDesignation[event.currentIndex].SrNo + '&Createdby=' + this.commonService.loggedInUserId();

  //   this.callAPIService.setHttp('get', 'Web_SetDesignationSort?' + stringDesignation, false, false, false, 'ncpServiceForWeb');
  //   this.callAPIService.getHttp().subscribe((res: any) => {
  //     if (res.data == 0) {
  //       this.spinner.hide();
  //       this.toastrService.success(res.data1[0].Msg);
  //       this.getBodyAssignedDesignation();
  //       this.AlreadyAssignedDesignations(this.desBodyId);
  //     } else {
  //       this.spinner.hide();
  //       this.allBodyAssignedDesignation = [];
  //     }
  //   }, (error: any) => {
  //     this.spinner.hide();
  //     if (error.status == 500) {
  //       this.router.navigate(['../../500'], { relativeTo: this.route });
  //     }
  //   })
  // }

  selCity() {
    //this.spinner.show();
    this.villageCityLabel = "City/District";
    if (this.globalDistrictId == undefined || this.globalDistrictId == "") {
      this.toastrService.error("Please select district");
      this.spinner.hide();
      return
    } else {
      this.disableFlagVill = false;
      this.getVillageOrCity(this.globalDistrictId, 'City/District');
      this.setVillOrcityName = "CityName";
      this.setVillOrCityId = "Id";
      this.spinner.hide();
    }
  }

  selVillage() {
    //this.spinner.show();
    if (this.globalDistrictId == undefined || this.globalDistrictId == "") {
      this.toastrService.error("Please select district");
      this.spinner.hide();
      return
    } else {
      this.disableFlagVill = false;
      this.globalTalukaID == undefined ? this.globalTalukaID = 0 : this.globalTalukaID;
      this.btnText == "Update Committee" ? this.getVillageOrCity(this.globalTalukaID, 'Village/Town') : '';
      this.setVillOrcityName = "VillageName";
      this.setVillOrCityId = "VillageId";
      this.spinner.hide();
    }
  }

  deleteCommitteeConfirmation(bodyId: any, allottedDesignation: any) {
    if (allottedDesignation == 0) {
      // let clickDeleteCommitteeModal = this.openDeleteCommitteeModal.nativeElement;
      // clickDeleteCommitteeModal.click();
      this.deletebodyId = bodyId;
      this.deleteConfirmModel();
    } else {
      this.toastrService.info('Designations are already assigned to this Committee');
    }
  }

  deleteConfirmModel() {
    const dialogRef = this.dialog.open(DeleteComponent);
    dialogRef.afterClosed().subscribe(result => {
      if (result == 'Yes') {
        this.deletecommittee();
      }
    });
  }

  deletecommittee() {
    //this.spinner.show();
    this.callAPIService.setHttp('get', 'Web_Delete_bodycellorgmaster_1_0?UserId=' + this.commonService.loggedInUserId() + '&BodyId=' + this.deletebodyId, false, false, false, 'ncpServiceForWeb');
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

  redTocommitteesOnMap() {
    let DistrictId: any;
    if (this.allDistrict?.length == 1) {
      DistrictId = this.allDistrict[0].DistrictId;
    } else {
      DistrictId = 0;
    }
    this.router.navigate(['../committees-on-map'], { relativeTo: this.route });
    sessionStorage.setItem('DistrictIdWorkThisWeek', JSON.stringify(DistrictId));

  }

  addMember() {
    const dialogRef = this.dialog.open(AddMemberComponent, {
      width: '1024px',
      data: this.result
    });
  }


}

