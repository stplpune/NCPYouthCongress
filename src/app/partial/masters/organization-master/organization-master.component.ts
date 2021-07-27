import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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
  categoryArray = ["Rural", "Urban"];
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
  btnText = "Create Organization";

  public items: string[] = [];

  constructor(private callAPIService: CallAPIService, private fb: FormBuilder,
    private toastrService: ToastrService, private commonService: CommonService) { }

  ngOnInit(): void {
    this.customForm();
    this.getLevel();
    this.getState();
    this.getDistrict();

  }
  customForm() {
    this.orgMasterForm = this.fb.group({
      BodyOrgCellName: ['', Validators.required],
      StateId: ['', Validators.required],
      DistrictId: ['', Validators.required],
      TalukaId: ['', Validators.required],
      VillageId: ['', Validators.required],
      IsRural: [1, Validators.required],
      BodyLevelId: ['', Validators.required],
      CreatedBy: [this.commonService.loggedInUserId()],
    })
  }

  getLevel() {
    this.callAPIService.setHttp('get', 'Web_GetLevel_1_0', false, false, false, 'ncpServiceForWeb');
    this.callAPIService.getHttp().subscribe((res: any) => {
      if (res.data == 0) {
        this.allLevels = res.data1;
      } else {
        if (res.data == 1) {
          this.toastrService.error("Data is not available");
        } else {
          this.toastrService.error("Please try again something went wrong");
        }
      }
    })
  }

  getState() {
    this.callAPIService.setHttp('get', 'Web_GetState_1_0', false, false, false, 'ncpServiceForWeb');
    this.callAPIService.getHttp().subscribe((res: any) => {
      if (res.data == 0) {
        this.allStates = res.data1;
      } else {
        if (res.data == 1) {
          this.toastrService.error("Data is not available");
        } else {
          this.toastrService.error("Please try again something went wrong");
        }
      }
    })
  }

  getDistrict() {
    this.callAPIService.setHttp('get', 'Web_GetDistrict_1_0?StateId=' + 1, false, false, false, 'ncpServiceForWeb');
    this.callAPIService.getHttp().subscribe((res: any) => {
      if (res.data == 0) {
        this.allDistrict = res.data1;
      } else {
        if (res.data == 1) {
          this.toastrService.error("Data is not available");
        } else {
          this.toastrService.error("Please try again something went wrong");
        }
      }
    })
  }

  getTaluka(districtId: any) {
    this.globalDistrictId = districtId;
    this.callAPIService.setHttp('get', 'Web_GetTaluka_1_0?DistrictId=' + districtId, false, false, false, 'ncpServiceForWeb');
    this.callAPIService.getHttp().subscribe((res: any) => {
      if (res.data == 0) {
        this.getTalkaByDistrict = res.data1;
      } else {
        if (res.data == 1) {
          this.toastrService.error("Data is not available");
        } else {
          this.toastrService.error("Please try again something went wrong");
        }
      }
    })
  }

  getVillageOrCity(talukaID: any, selType: any) {
    let appendString = "";
    selType == 'Village' ? appendString = 'Web_GetVillage_1_0?talukaid=' + talukaID : appendString = 'Web_GetCity_1_0?DistrictId=' + this.globalDistrictId;
    this.callAPIService.setHttp('get', appendString, false, false, false, 'ncpServiceForWeb');
    this.callAPIService.getHttp().subscribe((res: any) => {
      if (res.data == 0) {
        this.resultVillageOrCity = res.data1;
      } else {
        if (res.data == 1) {
          this.toastrService.error("Data is not available");
        } else {
          this.toastrService.error("Please try again something went wrong");
        }
      }
    })
  }


  onRadioChangeCategory(category: any) {
    if (category == "Rural") {
      this.villageCityLabel = "Village";
      this.getVillageOrCity(this.globalDistrictId, 'Village');
      this.setVillOrcityName = "VillageName";
      this.setVillOrCityId = "VillageId";
    }
    else {
      this.villageCityLabel = "City";
      this.getVillageOrCity(false, 'City');
      this.setVillOrcityName = "CityName";
      this.setVillOrCityId = "Id";
    }
  }

  get f() { return this.orgMasterForm.controls };

  onSubmit() {
    this.submitted = true;
    if (this.orgMasterForm.invalid) {
      // this.spinner.hide();
      return;
    }
    else {
      let fromData: any = new FormData();
      let villageOrCity =  this.villageCityLabel == "Village" ? 1 : 0;
      let btnTextFlag =  this.btnText == "Create Organization" ? 0 : '';

      Object.keys(this.orgMasterForm.value).forEach((cr: any, ind: any) => {
        if (cr != 'IsRural') {
          fromData.append(cr, Object.values(this.orgMasterForm.value)[ind])
        }
      })
      fromData.append('Id', btnTextFlag);
      fromData.append('IsRural', villageOrCity);

      this.callAPIService.setHttp('Post', 'Web_Insert_Bodycellorgmaster_1_0', false, fromData, false, 'ncpServiceForWeb');
      this.callAPIService.getHttp().subscribe((res: any) => {
        if (res.data == 0) {
          this.toastrService.success(res.data1[0].Msg);
          this.clearForm();
        } else {
          if (res.data == 1) {
            this.toastrService.error("Data is not available");
          } else {
            this.toastrService.error("Please try again something went wrong");
          }
        }

      })
    }
  }

  clearForm() {
    this.submitted = false;
    this.orgMasterForm.reset({
      IsRural: this.defultCategory
    });
  }
}