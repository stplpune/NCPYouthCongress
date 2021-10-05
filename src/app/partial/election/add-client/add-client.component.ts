import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { CallAPIService } from 'src/app/services/call-api.service';
import { CommonService } from 'src/app/services/common.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { DeleteComponent } from '../../dialogs/delete/delete.component';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
@Component({
  selector: 'app-add-client',
  templateUrl: './add-client.component.html',
  styleUrls: ['./add-client.component.css', '../../partial.component.css']
})
export class AddClientComponent implements OnInit {

  addClientForm!: FormGroup;
  submitted = false;
  paginationNo: number = 1;
  pageSize: number = 10;
  total: any;
  btnText = 'Assign Booths';
  filterForm!: FormGroup;
  subject: Subject<any> = new Subject();
  searchFilter = "";
  HighlightRow: any;
  resultVillage: any;
  allDistrict: any;
  getTalkaByDistrict: any;
  villageDisabled!:boolean;
  editFlag: boolean = true;
  clientId: any;

  constructor(
    private spinner: NgxSpinnerService,
    private callAPIService: CallAPIService,
    private toastrService: ToastrService,
    private fb: FormBuilder,
    private commonService: CommonService,
    private router: Router,
    private route: ActivatedRoute,
    public dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    this.defaultAddClientForm();
    this.defaultFilterForm();
    this.getDistrict();
    this.searchFilters('false');
  }

  defaultAddClientForm() {
    this.addClientForm = this.fb.group({
      Id: [0],
      clientName: ['', Validators.required],
      address: ['', Validators.required],
      landlineNo:  ['', [Validators.required, Validators.pattern("^((\\+91-?)|0)?[0-9]{8}$")]],  
      contactNo1: ['', [Validators.required, Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")]],  
      contactNo2: [''],
      emailID: ['', [Validators.required, Validators.email]],
      DistrictId: ['', Validators.required],
      TalukaId: ['', Validators.required],
      VillageId: ['', Validators.required],
      // clientPartyId: [''],
    })
  }

  get f() { return this.addClientForm.controls };

  defaultFilterForm() {
    this.filterForm = this.fb.group({
      ElectionNameId: [0],
      Search: [''],
    })
  }

  getDistrict() {
    this.spinner.show();
    this.callAPIService.setHttp('get', 'Web_GetDistrict_1_0?StateId=' + 1, false, false, false, 'ncpServiceForWeb');
    this.callAPIService.getHttp().subscribe((res: any) => {
      if (res.data == 0) {
        this.spinner.hide();
        this.allDistrict = res.data1;
        if (this.editFlag && this.addClientForm.value.IsRural == 0) {
          this.getVillage(this.addClientForm.value.DistrictId)
        }else  if (this.editFlag && this.addClientForm.value.IsRural == 1) {
          this.getTaluka(this.addClientForm.value.DistrictId)
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
    (districtId == null || districtId == "") ? districtId = 0 : districtId = districtId;
    this.callAPIService.setHttp('get', 'Web_GetTaluka_1_0?DistrictId=' + districtId, false, false, false, 'ncpServiceForWeb');
    this.callAPIService.getHttp().subscribe((res: any) => {
      if (res.data == 0) {
        this.spinner.hide();
        this.getTalkaByDistrict = res.data1;
        if (this.editFlag) {
          this.addClientForm.patchValue({
            TalukaId: this.addClientForm.value.TalukaId,
          });
          let selValueCityOrVillage: any = "";
          this.addClientForm.value.IsRural == 1 ? (selValueCityOrVillage = "Village") : (selValueCityOrVillage = "City");
          if (this.addClientForm.value.TalukaId) {
            this.getVillage(this.addClientForm.value.TalukaId)
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

  getVillage(talukaID: any) {
    this.villageDisabled = false;
    this.spinner.show();
  this.callAPIService.setHttp('get', 'Web_GetVillage_1_0?talukaid=' + talukaID, false, false, false, 'ncpServiceForWeb');
    this.callAPIService.getHttp().subscribe((res: any) => {
      if (res.data == 0) {
        this.spinner.hide();
        this.resultVillage = res.data1;
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

  districtClear(text: any) {
    if (text == 'district') {
      this.addClientForm.controls['DistrictId'].setValue(''), this.addClientForm.controls['TalukaId'].setValue(''), this.addClientForm.controls['VillageId'].setValue('');
      this.villageDisabled = true;
    } else if (text == 'taluka') {
      this.addClientForm.controls['TalukaId'].setValue(''), this.addClientForm.controls['VillageId'].setValue('');

    } else if (text == 'village') {
      this.addClientForm.controls['VillageId'].setValue('');
    }
  }


   onSubmitAddClient() {
    this.submitted = true;
    console.log(this.addClientForm.value)
  //   let formData = this.createElectionForm.value;
  //   if (this.createElectionForm.invalid) {
  //     this.spinner.hide();
  //     return;
  //   }
  //   else if (formData.ElectionName.trim() == '' || formData.ElectionName ==  null || formData.ElectionName == undefined) {
  //     this.toastrService.error("Election  Name can not contain space");
  //     return;
  //   }
  //   else if (formData.IsSubElectionApplicable == 0 && this.addSubElectionArray.length == 0) {
  //     this.toastrService.error("Please Add Sub Election");
  //   }
  //   else {
  //     this.spinner.show();
  //     if (formData.IsSubElectionApplicable == 0) {
  //       this.addSubElectionArray.map((ele: any) => {
  //         delete ele['Id'];
  //         return ele;
  //       })
  //       this.subEleArray = JSON.stringify(this.addSubElectionArray);
  //     } else {
  //       this.subEleArray = "";
  //     }

  //     let id;
  //     formData.Id == "" || formData.Id == null ? id = 0 : id = formData.Id;
  //     let obj = id + '&ElectionName=' + formData.ElectionName + '&ElectionTypeId=' + formData.ElectionTypeId + '&IsSubElectionApplicable=' + formData.IsSubElectionApplicable +
  //       '&IsAsemblyBoothListApplicable=' + formData.IsAsemblyBoothListApplicable + '&CreatedBy=' + this.commonService.loggedInUserId() + '&StrSubElectionId=' + this.subEleArray;
  //     this.callAPIService.setHttp('get', 'Web_Insert_ElectionMaster?Id=' + obj, false, false, false, 'ncpServiceForWeb');
  //     this.callAPIService.getHttp().subscribe((res: any) => {
  //       if (res.data == 0) {
  //         this.addSubElectionArray = [];
  //         this.toastrService.success(res.data1[0].Msg);
  //         this.getElectionMaster();
  //         this.spinner.hide();
  //         this.defaultProgramForm();
  //         this.getsubElection() 
  //         this.submitted = false;
  //         this.subElectionDivHide = false;
  //         this.btnText = 'Create Election';
  //       } else {
  //         //  this.toastrService.error("Data is not available");
  //       }
  //     }, (error: any) => {
  //       if (error.status == 500) {
  //         this.router.navigate(['../500'], { relativeTo: this.route });
  //       }
  //     })
  //   }
   }

  clearForm() {
    this.submitted = false;
    this.btnText = 'Assign Booths'
    this.defaultAddClientForm();
  }

  delConfirmAssBothEle(clientId: any) {
    this.clientId = clientId;
    this.deleteConfirmModel();
  }

  deleteConfirmModel() {
    const dialogRef = this.dialog.open(DeleteComponent);
    dialogRef.afterClosed().subscribe(result => {
      if (result == 'Yes') {
        this.deleteClientData();
      }
    });
  }

  deleteClientData() {
    this.callAPIService.setHttp('get', 'Web_Insert_Election_DeleteBoothToElection?HeaderId=' + this.clientId + '&CreatedBy=' + this.commonService.loggedInUserId(), false, false, false, 'ncpServiceForWeb');
    this.callAPIService.getHttp().subscribe((res: any) => {
      if (res.data == 0) {
        this.toastrService.success(res.data1[0].Msg);
        //this.getAssignedBoothToElection();
      } else {
        this.spinner.hide();
      }
    }, (error: any) => {
      this.spinner.hide();
      if (error.status == 500) {
        this.router.navigate(['../500'], { relativeTo: this.route });
      }
    })
  }

  onClickPagintion(pageNo: number) {
    this.paginationNo = pageNo;
    //this.getAssignedBoothToElection();
  }

  clearFilter(flag: any) {
    if (flag == 'electionType') {
      this.filterForm.controls['ElectionNameId'].setValue(0);
    } else if (flag == 'search') {
      this.filterForm.controls['Search'].setValue('');
    }
    this.paginationNo = 1;
    //this.getAssignedBoothToElection();
  }

  filterData() {
    this.paginationNo = 1;
    //this.getAssignedBoothToElection();
  }

  onKeyUpFilter() {
    this.subject.next();
  }

  searchFilters(flag: any) {
    if (flag == 'true') {
      if (this.filterForm.value.Search == "" || this.filterForm.value.Search == null) {
        this.toastrService.error("Please search and try again");
        return
      }
    }
    this.subject
      .pipe(debounceTime(700))
      .subscribe(() => {
        this.searchFilter = this.filterForm.value.Search;
        this.paginationNo = 1;
        //this.getAssignedBoothToElection();
      }
      );
  }

}
