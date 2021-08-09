import { Component, OnInit, ViewChild } from '@angular/core';
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
  setVillOrcityName: any;
  setVillOrCityId: any;
  villageCityLabel: any;
  selGender: any;
  editFlag: boolean = true;
  getImgExt: any;
  imgName: any;
  ImgUrl: any;
  selectedFile!: File;
  globalVillageOrCityId: any;
  @ViewChild('closeModal') closeModal: any;

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
      FName: ['', [Validators.required, Validators.pattern(/^\S*$/)]],
      MName: ['', [Validators.required, Validators.pattern(/^\S*$/)]],
      LName: ['', [Validators.required, Validators.pattern(/^\S*$/)]],
      IsRural: [],
      ConstituencyNo: [''],
      Gender: [''],
      EmailId: ['', [Validators.required, Validators.email]],
      Address: [''],
    })
  }

  updateProfileDate(){
    this.profileFormPathValue(this.resProfileData);
  }

  profileFormPathValue(data: any) {
    this.selGender = data.Gender;
    data.IsRural == 1 ? (this.setVillOrcityName = "VillageName", this.setVillOrCityId = "VillageId", this.villageCityLabel = "Village") : (this.setVillOrcityName = "CityName", this.setVillOrCityId = "Id", this.villageCityLabel = "City");
    this.getDistrict();
    this.ImgUrl = data.ProfilePhoto;
    this.editProfileForm.patchValue({
      FName: data.FName,
      MName: data.MName,
      LName: data.LName,
      IsRural: data.IsRural,
      Gender: data.Gender,
      EmailId: data.Emailid,
      Address: data.Address,
      DistrictId: data.DistrictId,
      TalukaId: data.TalukaId,
      VillageId: data.VillageId
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
          });
          let selValueCityOrVillage: any = "";
          this.editProfileForm.value.IsRural == 1 ? (selValueCityOrVillage = "Village") : (selValueCityOrVillage = "City");
          this.getVillageOrCity(this.editProfileForm.value.TalukaId, selValueCityOrVillage)
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
    this.spinner.show();
    let appendString = "";
    selType == 'Village' ? appendString = 'Web_GetVillage_1_0?talukaid=' + talukaID : appendString = 'Web_GetCity_1_0?DistrictId=' + this.editProfileForm.value.DistrictId;
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

      this.editProfileForm.value['Name'] = this.editProfileForm.value.FName + " " + this.editProfileForm.value.MName + " " + this.editProfileForm.value.LName
      let fromData = new FormData();
      Object.keys(this.editProfileForm.value).forEach((cr: any, ind: any) => {
        let value: any = Object.values(this.editProfileForm.value)[ind] != null ? Object.values(this.editProfileForm.value)[ind] : 0;
        fromData.append(cr, value)
      });
      let profilePhoto:any = this.editProfileForm.value.ProfilePhoto ? '' : this.selectedFile;
      fromData.append('ProfilePhoto', profilePhoto);
      let profilePhotoChange:any; 
      this.selectedFile ?  profilePhotoChange = 1 : profilePhotoChange = 0;

      fromData.append('IsPhotoChange', profilePhotoChange);
      
      this.callAPIService.setHttp('Post', 'Web_Update_UserProfile_1_0', false, fromData, false, 'ncpServiceForWeb');
      this.callAPIService.getHttp().subscribe((res: any) => {
        if (res.data == 0) {
          this.submitted = false;
          let modalClosed = this.closeModal.nativeElement;
          modalClosed.click();
          this.spinner.hide();
          let result = res.data1[0];
          this.toastrService.success(result.Msg);
          this.getProfileData();
        } else {
          this.spinner.hide();
          if (res.data == 1) {
          } else {
            this.toastrService.error("Please try again something went wrong");
          }
        }
      })
    }
  }

  onRadioChangeCategory(category: any) {
    if (category == "Rural") {
      this.villageCityLabel = "Village", this.setVillOrCityId = "VillageId", this.setVillOrcityName = "VillageName"
      this.getTaluka(this.editProfileForm.value.DistrictId);
      this.editProfileForm.controls['VillageId'].setValue(this.globalVillageOrCityId);
    } else {
      this.globalVillageOrCityId = this.editProfileForm.value.VillageId;
      this.villageCityLabel = "City", this.setVillOrcityName = "CityName", this.setVillOrCityId = "Id";
      this.editProfileForm.controls['VillageId'].setValue(null);
    }
    this.getDistrict()
  }

  districtClear(text: any) {
    if (text == 'district') {
      this.editProfileForm.controls['DistrictId'].setValue(null), this.editProfileForm.controls['TalukaId'].setValue(null), this.editProfileForm.controls['VillageId'].setValue(null);

    } else if (text == 'taluka') {
      this.editProfileForm.controls['TalukaId'].setValue(null), this.editProfileForm.controls['VillageId'].setValue(null);

    } else if (text == 'village') {
      this.editProfileForm.controls['VillageId'].setValue(null);
    }
  }

  choosePhoto() {
    let clickPhoto: any = document.getElementById('my_file')
    clickPhoto.click();
  }

  readUrl(event: any) {
    let selResult = event.target.value.split('.');
    this.getImgExt = selResult.pop();
    this.getImgExt.toLowerCase();
    if (this.getImgExt == "png" || this.getImgExt == "jpg" || this.getImgExt == "jpeg") {
      this.selectedFile = <File>event.target.files[0];
      if (event.target.files && event.target.files[0]) {
        var reader = new FileReader();
        reader.onload = (event: any) => {
          this.ImgUrl = event.target.result;
        }
        reader.readAsDataURL(event.target.files[0]);
        this.imgName = event.target.files[0].name;
      }
    }
    else {
      this.toastrService.error("Profile image allowed only jpg or png format");
    }
  }
}
