import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { CallAPIService } from 'src/app/services/call-api.service';

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
  allStates:any;
  public items: string[] = [];

  constructor(private callAPIService: CallAPIService, private fb: FormBuilder, private toastrService: ToastrService) { }

  ngOnInit(): void {
    this.getState();
    this.getDistrict();
    this.customForm();
  }
  customForm() {
    this.orgMasterForm = this.fb.group({
      state: [''],
      district: [''],
      category: [],
      taluka: [],
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
    this.callAPIService.setHttp('get', 'Web_GetDistrict?StateId=' + 1, false, false, false, 'ncpServiceForWeb');
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
    this.callAPIService.setHttp('get', 'Web_GetTaluka?DistrictId=' + districtId, false, false, false, 'ncpservice');
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

  getVillageOrCity(talukaID: any) {

    this.callAPIService.setHttp('get', 'Web_GetVillage?talukaid=' + talukaID, false, false, false, 'ncpservice');
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
    category == "Rural" ? (this.villageCityLabel = "Village") : (this.villageCityLabel = "City");
  }

  onSubmit() {

  }
}