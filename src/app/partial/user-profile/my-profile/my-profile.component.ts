import { Component, OnInit } from '@angular/core';
import { CallAPIService } from 'src/app/services/call-api.service';
import { NgxSpinnerService } from "ngx-spinner";
import { ToastrService } from 'ngx-toastr';
import { CommonService } from '../../../services/common.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-my-profile',
  templateUrl: './my-profile.component.html',
  styleUrls: ['./my-profile.component.css', '../../partial.component.css']
})
export class MyProfileComponent implements OnInit {
  public items: string[] = [];
  resProfileData: any;
  editProfileForm!: FormGroup;
  categoryArray = [{ id: 1, name: "Rural" }, { id: 0, name: "Urban" }];
  GenderArray = [{ id: 1, name: "Male" }, { id: 2, name: "Female" }, { id: 3, name: "Other" }];
  resultVillageOrCity: any;
  getTalkaByDistrict: any;
  allDistrict: any;
  globalDistrictId: any;
  submitted = false;
  setVillOrcityName = "VillageName";
  setVillOrCityId = "VillageId";
  villageCityLabel = "Village";
  selGender: any;
  editFlag: boolean = true;

  constructor(
    private callAPIService: CallAPIService,
    private spinner: NgxSpinnerService,
    private toastrService: ToastrService,
    private commonService: CommonService,
    private fb: FormBuilder,
  ) { }

  ngOnInit(): void {
    this.myProfileForm();
    this.getProfileData();
  }

  getProfileData() {
    this.spinner.show();
    this.callAPIService.setHttp('get', 'Web_GetUserprofile_1_0?UserId=' + this.commonService.loggedInUserId(), false, false, false, 'ncpServiceForWeb');
    this.callAPIService.getHttp().subscribe((res: any) => {
      if (res.data == 0) {
        this.spinner.hide();
        this.resProfileData = res.data1[0];

        this.profileFormPathValue(this.resProfileData);
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

  myProfileForm() {
    this.editProfileForm = this.fb.group({
      UserId: [this.commonService.loggedInUserId()],
      StateId: [1],
      DistrictId: ['', [Validators.required]],
      TalukaId: ['', [Validators.required]],
      VillageId: ['', [Validators.required]],
      FName: ['', [Validators.required]],
      MName: ['', [Validators.required]],
      LName: ['', [Validators.required]],
      IsRural: [],
      ConstituencyNo: [''],
      Gender: [''],
      EmailId: ['', [Validators.required, Validators.email]],
      ProfilePhoto: [''],
      Address: ['', [Validators.email]],
    })
  }

  profileFormPathValue(data: any) {
    this.selGender = data.Gender;
    this.getDistrict();
    // this.getTaluka(data.DistrictId)
    this.editProfileForm.patchValue({
      FName: data.FName,
      MName: data.MName,
      LName: data.LName,
      IsRural: data.IsRural,
      Gender: data.Gender,
      EmailId: data.Emailid,
      ProfilePhoto: data.ProfilePhoto,
      Address: data.Address,
      DistrictId: data.DistrictId,
      TalukaId: data.TalukaId,
      VillageId: data.VillageId,
    });
  }

  getDistrict() {
    this.spinner.show();
    this.callAPIService.setHttp('get', 'Web_GetDistrict_1_0?StateId=' + 1, false, false, false, 'ncpServiceForWeb');
    this.callAPIService.getHttp().subscribe((res: any) => {
      if (res.data == 0) {
        this.spinner.hide();
        this.allDistrict = res.data1;
        if (this.editFlag) {
          this.getTaluka(this.editProfileForm.value.DistrictId)
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
    this.callAPIService.setHttp('get', 'Web_GetTaluka_1_0?DistrictId=' + districtId, false, false, false, 'ncpServiceForWeb');
    this.callAPIService.getHttp().subscribe((res: any) => {
      if (res.data == 0) {
        this.spinner.hide();
        this.getTalkaByDistrict = res.data1;
        if (this.editFlag) {
          this.editProfileForm.patchValue({
            TalukaId: this.editProfileForm.value.TalukaId,
          })
          this.getVillageOrCity(this.editProfileForm.value.TalukaId, 'Village')
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
    // this.spinner.show();
    let appendString = "";
    selType == 'Village' ? appendString = 'Web_GetVillage_1_0?talukaid=' + talukaID : appendString = 'Web_GetCity_1_0?DistrictId=' + this.globalDistrictId;
    this.callAPIService.setHttp('get', appendString, false, false, false, 'ncpServiceForWeb');
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

  get f() { return this.editProfileForm.controls };

  updateProfile() {
    this.submitted = true;
    if (this.editProfileForm.invalid) {
      this.spinner.hide();
      return;
    }
    else {
      console.log(this.editProfileForm.value);
    }
  }

  onRadioChangeCategory(category: any) {
    if (category == "Rural") {
      this.villageCityLabel = "Village";
    } else {
      this.villageCityLabel = "City";
    }
  }

  districtClear(text: any) {
    if (text == 'district') {

    } else if (text == 'taluka') {

    } else if (text == 'village') {

    }
  }
}
