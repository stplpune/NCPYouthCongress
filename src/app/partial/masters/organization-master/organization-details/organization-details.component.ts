import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { CallAPIService } from 'src/app/services/call-api.service';

@Component({
  selector: 'app-organization-details',
  templateUrl: './organization-details.component.html',
  styleUrls: ['./organization-details.component.css', '../../../partial.component.css']
})
export class OrganizationDetailsComponent implements OnInit {
  bodyMember!: FormGroup;
  globalDistrictId: any;
  allDistrict: any;
  resAllMember: any;
  getTalkaByDistrict: any;
  resultVillageOrCity: any;
  submitted:boolean = false;
  items: string[] = [];
  villageCityLabel = "Village";
  setVillOrCityId = "VillageId";
  setVillOrcityName = "VillageName";
  bodyMemberDetails:any;

  constructor(private fb: FormBuilder, private callAPIService: CallAPIService, private spinner: NgxSpinnerService, 
    private toastrService: ToastrService, private router:Router) { }

  ngOnInit(): void {
    this.defaultBodyMemForm();
    this.getAllBodyMember(localStorage.getItem('bodyId'));
  }

  defaultBodyMemForm() {
    this.bodyMember = this.fb.group({
      bodyId:['',Validators.required]
    })
  }

  get f() { return this.bodyMember.controls };

  onSubmit() {
    // this.spinner.show();
    this.submitted = true;
    if (this.bodyMember.invalid) {
      this.spinner.hide();
      return;
    }
    else {

    }
  
  }

  getAllBodyMember(id:any) {
    this.spinner.show();
    this.callAPIService.setHttp('get', 'Web_GetBodyMemberList_1_0?BodyId='+id, false, false, false, 'ncpServiceForWeb');
    this.callAPIService.getHttp().subscribe((res: any) => {
      if (res.data == 0) {
        this.spinner.hide();
        this.resAllMember = res.data1;
      } else {
        this.spinner.hide();
        if (res.data == 1) {
          this.toastrService.error("Body member is not available");
        } else {
          this.toastrService.error("Please try again something went wrong");
        }
      }
    })
  }

  getBodyMemberDetails(id:any) {
    this.spinner.show();
    this.callAPIService.setHttp('get', 'Web_GetMemberDetails_1_0?MemberId='+id, false, false, false, 'ncpServiceForWeb');
    this.callAPIService.getHttp().subscribe((res: any) => {
      if (res.data == 0) {
        this.spinner.hide();
        this.bodyMemberDetails = res.data1[0];
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

  

  ngOnDestroy() {
    localStorage.removeItem('bodyId');
  }

}
