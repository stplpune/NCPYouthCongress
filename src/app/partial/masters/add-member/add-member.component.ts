import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { CallAPIService } from 'src/app/services/call-api.service';
import { CommonService } from 'src/app/services/common.service';
import { debounceTime } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-add-member',
  templateUrl: './add-member.component.html',
  styleUrls: ['./add-member.component.css', '../../partial.component.css']
})
export class AddMemberComponent implements OnInit {
  editProfileForm!: FormGroup;
  categoryArray = [{ id: 1, name: "Rural" }, { id: 0, name: "Urban" }];
  GenderArray = [{ id: 1, name: "Male" }, { id: 2, name: "Female" }, { id: 3, name: "Other" }];
  selGender: any;
  getImgExt: any;
  imgName: any;
  ImgUrl: any;
  isShowMenu: boolean = false;
  @Output() onShowMenu: EventEmitter<any> = new EventEmitter();
  editFlag: boolean = true;
  userName = this.commonService.loggedInUserName();
  submitted = false;
  resultVillageOrCity: any;
  allDistrict: any;
  getTalkaByDistrict: any;
  profilePhotoChange: any;
  @ViewChild('myInput') myInputVariable!: ElementRef;
  selectedFile: any;
  resProfileData: any;
  showingUserName: any;
  showingMobileNo: any;
  villageCityLabel = "Village";
  setVillOrCityId: any;
  setVillOrcityName: any;
  globalVillageOrCityId: any;
  disabledEditForm: boolean = true;
  defaultModalHIde: boolean = false;
  defaultModalHIdeCP: boolean = false;
  changePasswordForm: any;
  submittedChangePassword = false;
  show_button: Boolean = false;
  show_eye: Boolean = false;
  show_button1: Boolean = false;
  show_eye1: Boolean = false;
  show_button2: Boolean = false;
  show_eye2: Boolean = false;
  villOrcityDisabled: boolean = false;
  @ViewChild('fileInput') fileInput!: ElementRef;
  villageDisabled!: boolean;
  filterForm!: FormGroup;
  paginationNo: number = 1;
  pageSize: number = 10;
  defaultCloseBtn: boolean = false;
  resAllUsers: any;
  total: any;
  subject: Subject<any> = new Subject();
  searchFilter = "";
  profileFlag = "Create";
  highlightedRow: any;

  constructor(private router: Router,
    private route: ActivatedRoute,
    private callAPIService: CallAPIService,
    private spinner: NgxSpinnerService,
    private toastrService: ToastrService,
    private commonService: CommonService,
    private fb: FormBuilder,
  ) { }

  ngOnInit(): void {
    this.myProfileForm();
    this.defaultFilterForm();
    this.getAllUsers();
    this.getDistrictByFilter();
    this.searchFilters('false');
  }

  myProfileForm() {
    this.editProfileForm = this.fb.group({
      Name: [''],
      UserId: [],
      StateId: [1],
      DistrictId: [0],
      TalukaId: [''],
      MobileNo: ['', [Validators.required, Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")]],
      VillageId: [''],
      FName: ['', [Validators.required, Validators.pattern(/^\S*$/)]],
      MName: ['', [Validators.required, Validators.pattern(/^\S*$/)]],
      LName: ['', [Validators.required, Validators.pattern(/^\S*$/)]],
      IsRural: [1],
      ConstituencyNo: [''],
      Gender: [''],
      EmailId: ['',  [Validators.email]],
      Address: [''],
      CreatedBy: [this.commonService.loggedInUserId()]
    })
  }

  profileFormPathValue(data: any) {
    this.profileFlag = 'Update';
    this.highlightedRow = data.Id
    this.selGender = data.Gender;
    data.IsRural == 1 ? (this.setVillOrcityName = "VillageName", this.setVillOrCityId = "VillageId", this.villageCityLabel = "Village") : (this.setVillOrcityName = "CityName", this.setVillOrCityId = "Id", this.villageCityLabel = "City");
    this.getDistrict();
    this.ImgUrl = data.ProfilePhoto;
    this.editProfileForm.patchValue({
      UserId: data.Id,
      FName: data.FName,
      MName: data.MName,
      MobileNo: data.MobileNo,
      LName: data.LName,
      IsRural: data.IsRural,
      Gender: data.Gender,
      EmailId: data.EmailId,
      Address: data.Address,
      DistrictId: data.DistrictId,
      TalukaId: data.TalukaId,
      VillageId: data.VillageId
    });
  }

  clearForm() {
    this.submitted = false;
    this.profileFlag = 'Create'
    this.myProfileForm();
    this.removePhoto();
  }

  getDistrict() {
    this.spinner.show();
    this.callAPIService.setHttp('get', 'Web_GetDistrict_1_0?StateId=' + 1, false, false, false, 'ncpServiceForWeb');
    this.callAPIService.getHttp().subscribe((res: any) => {
      if (res.data == 0) {
        this.spinner.hide();
        this.allDistrict = res.data1;
        if (this.editFlag && this.editProfileForm.value.IsRural == 0) {
          this.getVillageOrCity(this.editProfileForm.value.DistrictId, 'City')
        } else if (this.editFlag && this.editProfileForm.value.IsRural == 1) {
          this.getTaluka(this.editProfileForm.value.DistrictId, false);
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

  getTaluka(districtId: any, flag: any) {
    if (districtId == "") { return };
    if (this.editProfileForm.value.IsRural == 0) {
      this.getVillageOrCity(this.editProfileForm.value.DistrictId, 'City')
      return
    }
    this.spinner.show();
    (districtId == null || districtId == "") ? districtId = 0 : districtId = districtId;
    this.callAPIService.setHttp('get', 'Web_GetTaluka_1_0?DistrictId=' + districtId, false, false, false, 'ncpServiceForWeb');
    this.callAPIService.getHttp().subscribe((res: any) => {
      if (res.data == 0) {

        this.spinner.hide();
        this.getTalkaByDistrict = res.data1;
        if (this.editFlag) {
          this.editProfileForm.patchValue({
            TalukaId: this.editProfileForm.value.TalukaId,
          });
          if (flag == 'select') {
            this.editProfileForm.controls['VillageId'].setValue('');
          }
          let selValueCityOrVillage: any = "";
          this.editProfileForm.value.IsRural == 1 ? (selValueCityOrVillage = "Village") : (selValueCityOrVillage = "City");
          if (this.editProfileForm.value.TalukaId) {
            this.getVillageOrCity(this.editProfileForm.value.TalukaId, selValueCityOrVillage)
          }
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
    if (talukaID == "") { return };

    if(this.villageCityLabel == "Village"){
      this.villageCityLabel = "Village", this.setVillOrCityId = "VillageId", this.setVillOrcityName = "VillageName";
    }else{
      this.villageCityLabel = "City", this.setVillOrcityName = "CityName", this.setVillOrCityId = "Id";
    }
    this.villageDisabled = false;
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
    // this.addValiditonTaluka(this.editProfileForm.value.IsRural)
    this.submitted = true;

    if (this.editProfileForm.invalid) {
      this.spinner.hide();
      return;
    }
    else {
      this.editProfileForm.value['Name'] = this.editProfileForm.value.FName + " " + this.editProfileForm.value.MName + " " + this.editProfileForm.value.LName
      if (this.editProfileForm.value.IsRural == 0) {
        this.editProfileForm.value.TalukaId = "";
      }

      let fromData = new FormData();
      let FullName = this.editProfileForm.value.FName + " " + this.editProfileForm.value.MName + " " + this.editProfileForm.value.LName;
      this.editProfileForm.value.Name = FullName;
      Object.keys(this.editProfileForm.value).forEach((cr: any, ind: any) => {
        let value: any = Object.values(this.editProfileForm.value)[ind] != null ? Object.values(this.editProfileForm.value)[ind] : 0;
        fromData.append(cr, value)
      });
      fromData.append('ProfilePhoto', this.selectedFile == undefined ? '' : this.selectedFile);
      if (this.profilePhotoChange != 2) {
        this.selectedFile ? this.profilePhotoChange = 1 : this.profilePhotoChange = 0;
      }

      fromData.append('IsPhotoChange', this.profilePhotoChange);

      this.callAPIService.setHttp('Post', 'Web_Insert_User_1_0', false, fromData, false, 'ncpServiceForWeb');
      this.callAPIService.getHttp().subscribe((res: any) => {
        if (res.data == 0) {
          this.disabledEditForm = true;
          this.profilePhotoChange = null;
          this.submitted = false;
          this.resetFile();
          this.spinner.hide();
          let result = res.data1[0];
          if(result.Msg == "Mobile No allready exists"){
            this.toastrService.error("Mobile No allready exist");
          }else if(result.Msg == "Data Saved Successfully" || result.Msg == "Profile Updated Successfully"){
            this.myProfileForm();
            this.toastrService.success(result.Msg);
          }
          this.getAllUsers();
          this.ImgUrl = "";
          this.highlightedRow="";
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

  getProfileData(id: any) {
    this.spinner.show();
    this.callAPIService.setHttp('get', 'Web_GetUserDetails?Id=' + id, false, false, false, 'ncpServiceForWeb');
    this.callAPIService.getHttp().subscribe((res: any) => {
      if (res.data == 0) {
        this.spinner.hide();
        this.resProfileData = res.data1[0];
        console.log(this.resProfileData);
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

  resetFile() {
    this.profileFlag = "Create";
    this.myInputVariable.nativeElement.value = '';
  }

  onRadioChangeCategory(category: any) {
    if (category == "Rural") {
      this.villageDisabled = true;
      this.villageCityLabel = "Village", this.setVillOrCityId = "VillageId", this.setVillOrcityName = "VillageName";
      this.getTaluka(this.editProfileForm.value.DistrictId, false);
      this.editProfileForm.controls['VillageId'].setValue(this.globalVillageOrCityId);
    } else {
      this.globalVillageOrCityId = this.editProfileForm.value.VillageId;
      this.villageCityLabel = "City", this.setVillOrcityName = "CityName", this.setVillOrCityId = "Id";
      this.getVillageOrCity(this.editProfileForm.value.DistrictId, 'City',);
      this.editProfileForm.controls['VillageId'].setValue(null);
    }
  }

  districtClear(text: any) {
    if (text == 'district') {
      this.editProfileForm.controls['DistrictId'].setValue(''), this.editProfileForm.controls['TalukaId'].setValue(''), this.editProfileForm.controls['VillageId'].setValue('');
      this.villageDisabled = true;
    } else if (text == 'taluka') {
      this.editProfileForm.controls['TalukaId'].setValue(''), this.editProfileForm.controls['VillageId'].setValue('');

    } else if (text == 'village') {
      this.editProfileForm.controls['VillageId'].setValue('');
    }
  }

  choosePhoto() {
    this.profilePhotoChange = 1;
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

  removePhoto() {
    this.selectedFile = "";
    this.fileInput.nativeElement.value = '';
    this.profilePhotoChange = 2;
    this.ImgUrl = null;
  }

  addValiditonTaluka(IsRural: any) {
    if (IsRural == 1) {
      this.editProfileForm.controls["TalukaId"].setValidators(Validators.required);
      this.editProfileForm.controls["TalukaId"].updateValueAndValidity();
      this.editProfileForm.controls['TalukaId'].clearValidators();
    } else {
      this.editProfileForm.controls["TalukaId"].clearValidators();
      this.editProfileForm.controls["TalukaId"].updateValueAndValidity();
    }
  }

  // filter and table contant 

  getDistrictByFilter() {
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

  getTalukaByFilter() {
    this.callAPIService.setHttp('get', 'Web_GetTaluka_1_0?DistrictId=' + this.filterForm.value.f_DistrictId, false, false, false, 'ncpServiceForWeb');
    this.callAPIService.getHttp().subscribe((res: any) => {
      if (res.data == 0) {
        this.spinner.hide();
        this.getTalkaByDistrict = res.data1;
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

  defaultFilterForm() {
    this.filterForm = this.fb.group({
      f_DistrictId: [0],
      f_TalukaId: [0],
      f_search: [''],
    })
  }

  getAllUsers() {
    this.spinner.show();
    let formData = this.filterForm.value;
    let obj: any = 'DistrictId=' + formData.f_DistrictId + '&UserId=' + this.commonService.loggedInUserId() + '&Search=' + formData.f_search + '&nopage=' + this.paginationNo + '&TalukaId=' + formData.f_TalukaId;
    this.callAPIService.setHttp('get', 'Web_get_User?' + obj, false, false, false, 'ncpServiceForWeb');
    this.callAPIService.getHttp().subscribe((res: any) => {
      if (res.data == 0) {
        this.spinner.hide();
        this.resAllUsers = res.data1;
        this.total = res.data2[0].TotalCount;
      } else {
        this.spinner.hide();
        if (res.data == 1) {
          this.resAllUsers = [];
        } else {
          this.toastrService.error("Please try again something went wrong");
        }
      }
    })
  }

  onClickPagintion(pageNo: number) {
    this.paginationNo = pageNo;
    this.getAllUsers();
  }

  filterData() {
    this.paginationNo = 1;
    this.getAllUsers();
  }

  onKeyUpFilter() {
    this.subject.next();
  }

  searchFilters(flag: any) {
    if (flag == 'true') {
      if (this.filterForm.value.f_search == "" || this.filterForm.value.f_search == null) {
        this.toastrService.error("Please search and try again");
        return
      }
    }
    this.subject
      .pipe(debounceTime(700))
      .subscribe(() => {
        this.searchFilter = this.filterForm.value.f_search;
        this.paginationNo = 1;
        this.getAllUsers();
      }
      );
  }

  clearFilter(flag: any) {
    if (flag == 'f_DistrictId') {
      this.filterForm.controls['f_DistrictId'].setValue(0);
      this.defaultFilterForm();
    } else if (flag == 'f_TalukaId') {
      this.filterForm.controls['f_TalukaId'].setValue(0);
    } else if (flag == 'f_search') {
      this.filterForm.controls['f_search'].setValue('');
    }
    this.paginationNo = 1;
    this.getAllUsers();
  }


  redToMemberProfile(memberId: any, FullName: any) {
    let obj = { 'memberId': memberId, 'FullName': FullName }
    sessionStorage.setItem('memberId', JSON.stringify(obj));
    this.router.navigate(['../profile'], { relativeTo: this.route })
  }
}
