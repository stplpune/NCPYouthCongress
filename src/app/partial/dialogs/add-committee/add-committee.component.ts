import { DatePipe } from '@angular/common';
import { Component, ElementRef, EventEmitter, Inject, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router, ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { CallAPIService } from 'src/app/services/call-api.service';
import { CommonService } from 'src/app/services/common.service';
import { AddDesignationComponent } from '../add-designation/add-designation.component';

@Component({
  selector: 'app-add-committee',
  templateUrl: './add-committee.component.html',
  styleUrls: ['./add-committee.component.css']
})
export class AddCommitteeComponent implements OnInit {

  addCommitteeForm!: FormGroup;
  submitted = false;
  villageCityLabel = "Village";
  allLevels: any;
  resCommitteeByLevel: any;
  allStates: any;
  allDistrict: any;
  allDistrictByCommittee: any;
  getTalkaByDistrict: any;
  resultVillageOrCity: any;
  globalDistrictId: any;
  setVillOrCityId = "VillageId";
  setVillOrcityName = "VillageName";
  disableFlagDist: boolean = true;
  disableFlagTal: boolean = true;
  disableFlagVill: boolean = true;
  redioBtnDisabled: boolean = true;
  globalLevelId: any;


  constructor(private callAPIService: CallAPIService, private router: Router, private fb: FormBuilder,
    private toastrService: ToastrService, private commonService: CommonService, public dialog: MatDialog,
    public dialogRef: MatDialogRef<AddCommitteeComponent>,
    private spinner: NgxSpinnerService, private route: ActivatedRoute) { }

    ngOnInit(): void {
      this.customForm();
      this.getLevel();
      this.getState();
      this.getDistrict();
      this.getDistrictByCommittee();
    }
    
  customForm() {
    this.addCommitteeForm = this.fb.group({
      BodyOrgCellName: ['', [Validators.required,Validators.maxLength(30)]],
      StateId: ['', Validators.required],
      DistrictId: [],
      TalukaId: [''],
      VillageId: [''],
      IsRural: [1],
      BodyLevelId: ['', Validators.required],
      SubParentCommitteeId:[''],
      CreatedBy: [this.commonService.loggedInUserId()],
    })
  }

  onSubmit(){

  }

  
  clearselOption(flag: any) { // on click select option close icon
    if (flag == 'State') {
      // this.disableFlagDist = true;
      // this.disableFlagTal = true;
      // this.disableFlagVill = true;
      this.addCommitteeForm.controls["StateId"].setValue("");
      this.addCommitteeForm.controls["DistrictId"].setValue("");
      this.addCommitteeForm.controls["TalukaId"].setValue("");
      this.addCommitteeForm.controls["VillageId"].setValue("");
    } else if (flag == 'District') {
      // this.disableFlagDist = true;
      // this.disableFlagTal = true;
      // this.disableFlagVill = true;
      this.addCommitteeForm.controls["DistrictId"].setValue("");
      this.addCommitteeForm.controls["TalukaId"].setValue("");
      this.addCommitteeForm.controls["VillageId"].setValue("");
      this.addCommitteeForm.controls["SubParentCommitteeId"].setValue("");
    } else if (flag == 'Taluka') {
      // this.disableFlagDist = true;
      // this.disableFlagTal = true;
      // this.disableFlagVill = false;
      this.addCommitteeForm.controls["TalukaId"].setValue("");
      this.addCommitteeForm.controls["VillageId"].setValue("");
      this.addCommitteeForm.controls["SubParentCommitteeId"].setValue("");
    } else if (flag == 'Village') {
      this.addCommitteeForm.controls["VillageId"].setValidators(Validators.required);
      this.addCommitteeForm.controls["VillageId"].setValue("");
      this.addCommitteeForm.controls["SubParentCommitteeId"].setValue("");
    }else if (flag == 'SubParentCommitteeId') {
      this.addCommitteeForm.controls["SubParentCommitteeId"].setValidators(Validators.required);
      this.addCommitteeForm.controls["SubParentCommitteeId"].setValue("");
    }
    // this.updateValueAndValidityMF(globalLevelId)
  }

  selectLevelClear() {
    // this.disableFlagDist = true;
    // this.disableFlagTal = true;
    // this.disableFlagVill = true;
    this.addCommitteeForm.controls["StateId"].setValue("");
    this.addCommitteeForm.controls["DistrictId"].setValue("");
    this.addCommitteeForm.controls["TalukaId"].setValue("");
    this.addCommitteeForm.controls["VillageId"].setValue("");
    this.addCommitteeForm.controls["SubParentCommitteeId"].setValue("");
    this.submitted = false;
  }

  clearForm() {
   // this.HighlightRow = null;
    this.submitted = false;
    // this.paginationNo = 1;
    // this.orgMasterForm.reset({ IsRural: 1});
    this.customForm();
    //this.getOrganizationList();
    this.selectLevelClear();
  }



  getLevel() {
    //this.spinner.show();
    this.callAPIService.setHttp('get', 'Web_GetLevel_1_0_Committee?UserId='+this.commonService.loggedInUserId(), false, false, false, 'ncpServiceForWeb'); // old API Web_GetLevel_1_0
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

  getCommitteeByLevel(bodyLevelId:any) {
    //this.spinner.show();
    this.callAPIService.setHttp('get', 'Web_GetBodyOrgCellName_1_0_Parent_Committee?UserId='+this.commonService.loggedInUserId()+'&BodyLevelId='+bodyLevelId, false, false, false, 'ncpServiceForWeb'); // old API Web_GetLevel_1_0
    this.callAPIService.getHttp().subscribe((res: any) => {
      if (res.data == 0) {
        this.resCommitteeByLevel = res.data1;
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
    this.callAPIService.setHttp('get', 'Web_GetState_1_0_Committee?UserId='+this.commonService.loggedInUserId(), false, false, false, 'ncpServiceForWeb'); // old API Web_GetState_1_0 
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
      // this.selCity();
    }
  }

  getDistrict() {
    //this.spinner.show();
    this.callAPIService.setHttp('get', 'Web_GetDistrict_1_0_Committee?StateId=' + 1 +'&UserId='+this.commonService.loggedInUserId(), false, false, false, 'ncpServiceForWeb'); // old API Web_GetDistrict_1_0
    this.callAPIService.getHttp().subscribe((res: any) => {
      if (res.data == 0) {
        this.allDistrict = res.data1;
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
    this.callAPIService.setHttp('get', 'Web_GetDistrict_1_0_CommitteeonMap?StateId=' + 1 +'&UserId='+this.commonService.loggedInUserId(), false, false, false, 'ncpServiceForWeb'); // old API Web_GetDistrict_1_0
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
    // this.globalDistrictId = districtId;
    //this.spinner.show();
    this.callAPIService.setHttp('get', 'Web_GetTaluka_1_0_Committee?DistrictId=' + districtId+'&UserId='+this.commonService.loggedInUserId(), false, false, false, 'ncpServiceForWeb'); //old API Web_GetTaluka_1_0
    this.callAPIService.getHttp().subscribe((res: any) => {
      if (res.data == 0) {
        this.getTalkaByDistrict = res.data1;
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
    selType == 'Village' ? appendString = 'Web_GetVillage_1_0_Committee?talukaid=' + talukaID+'&UserId='+this.commonService.loggedInUserId() : appendString = 'Web_GetCity_1_0_Committee?DistrictId=' + this.globalDistrictId+'&UserId='+this.commonService.loggedInUserId(); //Web_GetVillage_1_0
    this.callAPIService.setHttp('get', appendString, false, false, false, 'ncpServiceForWeb');
    this.callAPIService.getHttp().subscribe((res: any) => {
      if (res.data == 0) {
        this.resultVillageOrCity = res.data1;
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

  onNoClick(): void {
    this.dialogRef.close();
  }
  get f() { return this.addCommitteeForm.controls };



}
