import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router, ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { CallAPIService } from 'src/app/services/call-api.service';
import { CommonService } from 'src/app/services/common.service';
import { DeleteComponent } from '../../dialogs/delete/delete.component';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-create-constituency',
  templateUrl: './create-constituency.component.html',
  styleUrls: ['./create-constituency.component.css', '../../partial.component.css']
})
export class CreateConstituencyComponent implements OnInit {
  defaultNoMembers = 0;
  submitted: boolean = false;
  electionTypeArray: any;
  addconstituencyArray: any[] = [];
  allembers = [{ id: 0, name: "Single" }, { id: 1, name: "Multiple" }];
  subConstituencyArray = [{ id: 1, name: "Yes" }, { id: 0, name: "No" }];
  constituencyDetailsArray: any;
  createConstituencyForm!: FormGroup;
  filterForm!: FormGroup;
  noOfMembersDiv: boolean = false;
  subConstituencyDivHide: boolean = false;
  electionName: any;
  constituencyArray: any;
  subConsArray: any;
  addSubConstituencyArray: any = [];
  subConstituencyTableDiv: boolean = false;
  index: any;
  subject: Subject<any> = new Subject();
  searchFilter: any;
  paginationNo: number = 1;
  pageSize: number = 10;
  constituencynName: any;
  constId: any;
  total: any;
  btnText = "Create Constituency";
  highlightedRow:any;
  

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
    this.defaultConstituencyForm();
    this.getElection();
    this.defaultFilterForm();
    this.getConstituency();
    this.searchFilters('false');
  }

  defaultConstituencyForm() {
    this.createConstituencyForm = this.fb.group({
      Id: [0],
      ElectionId: ['', Validators.required],
      ConstituencyName: ['', Validators.required],
      Members: [0],
      NoofMembers: [''],
      IsSubConstituencyApplicable: [0],
      StrSubElectionId: [''],
      subEleName: [''],
      subEleConstName: [''],
    })
  }

  defaultFilterForm() {
    this.filterForm = this.fb.group({
      ElectionNameId: [0],
      Search: [''],
    })
  }

  get f() { return this.createConstituencyForm.controls };

  getElection() {
    this.spinner.show();
    this.callAPIService.setHttp('get', 'Web_GetElection?UserId=' + this.commonService.loggedInUserId(), false, false, false, 'ncpServiceForWeb');
    this.callAPIService.getHttp().subscribe((res: any) => {
      if (res.data == 0) {
        this.spinner.hide();
        this.electionName = res.data1;
      } else {
        this.spinner.hide();
        this.electionName = [];
        // this.toastrService.error("Data is not available");
      }
    }, (error: any) => {
      this.spinner.hide();
      if (error.status == 500) {
        this.router.navigate(['../500'], { relativeTo: this.route });
      }
    })
  }

  getConstituency() {
    let data = this.filterForm.value;
    this.spinner.show();
    this.callAPIService.setHttp('get', 'Web_Election_GetConstituency?ElectionId=' + data.ElectionNameId + '&UserId=' + this.commonService.loggedInUserId() + '&Search=' + data.Search + '&nopage=' + this.paginationNo, false, false, false, 'ncpServiceForWeb');
    this.callAPIService.getHttp().subscribe((res: any) => {
      if (res.data == 0) {
        this.spinner.hide();
        this.constituencynName = res.data1;
        this.total = res.data2[0].TotalCount;
      } else {
        this.spinner.hide();
        this.constituencynName = [];
        // this.toastrService.error("Data is not available");
      }
    }, (error: any) => {
      this.spinner.hide();
      if (error.status == 500) {
        this.router.navigate(['../500'], { relativeTo: this.route });
      }
    })
  }



  onSubmit() {
    this.validationNoofMembers();
    let formData = this.createConstituencyForm.value;
    debugger;
    if (this.createConstituencyForm.value.IsSubConstituencyApplicable == 1 && this.addSubConstituencyArray.length == 0) {
      this.validationSubElectionForm();
    }

    this.submitted = true;
    if (this.createConstituencyForm.invalid) {
      this.spinner.hide();
      return;
    }
    else if (formData.IsSubConstituencyApplicable == 1) {
      if (this.addSubConstituencyArray.length == 0) {
        this.toastrService.error("Please Add Sub Constituency");
        return;
      }
    }

    if (formData.IsSubConstituencyApplicable == 1) {
      this.addSubConstituencyArray.map((ele: any) => {
        delete ele['ConstituencyName'];
        delete ele['SubElection'];
        return ele;
      })
      this.subConsArray = JSON.stringify(this.addSubConstituencyArray);
    } else {
      this.subConsArray = "";
    }
    debugger;
    this.spinner.show();
    let id;
    let NoofMembers;
    formData.Id == "" || formData.Id == null ? id = 0 : id = formData.Id;
    // formData.NoofMembers == "" || formData.NoofMembers == null ? NoofMembers = 1 : NoofMembers = formData.NoofMembers;
    formData.Members == 0 ? NoofMembers = 1 : NoofMembers = formData.NoofMembers;
    this.subConsArray ? this.subConsArray : this.subConsArray = "";
    let obj = id + '&ElectionId=' + formData.ElectionId + '&ConstituencyName=' + formData.ConstituencyName + '&Members=' + formData.Members +
      '&NoofMembers=' + NoofMembers + '&IsSubConstituencyApplicable=' + formData.IsSubConstituencyApplicable + '&CreatedBy=' + this.commonService.loggedInUserId() + '&StrSubElectionId=' + this.subConsArray;
    this.callAPIService.setHttp('get', 'Web_Insert_ElectionConstituency?Id=' + obj, false, false, false, 'ncpServiceForWeb');
    this.callAPIService.getHttp().subscribe((res: any) => {
      if (res.data == 0) {
        this.spinner.hide();
        this.toastrService.success(res.data1[0].Msg);
        this.btnText = "Create Constituency";
        this.resetConstituencyName();
        this.getConstituency();
      } else {
        this.spinner.hide();
        //  this.toastrService.error("Data is not available");
      }
    }, (error: any) => {
      this.spinner.hide();
      if (error.status == 500) {
        this.router.navigate(['../500'], { relativeTo: this.route });
      }
    });
  }

  patchCreateConstituency(data: any) {
    this.highlightedRow = data.Id;
    this.btnText = 'Update Constituency';
    data.Members == 1 ? this.noOfMembersDiv = true : this.noOfMembersDiv = false;
    data.IsSubConstituencyApplicable == 1 ? (this.subConstituencyDivHide = true, this.subConstituencyTableDiv = true) : (this.subConstituencyDivHide = false, this.subConstituencyTableDiv = false);
    this.createConstituencyForm.patchValue({
      Id: data.Id,
      ElectionId: data.ElectionId,
      ConstituencyName: data.ConstituencyName,
      Members: data.Members,
      NoofMembers: data.NoofMembers,
      IsSubConstituencyApplicable: data.IsSubConstituencyApplicable,
    });
  }

  resetConstituencyName() {
    this.submitted = false;
    this.defaultConstituencyForm();
    this.addSubConstituencyArray = [];
    this.subConsTableHideShowOnArray();
    this.subConstituencyDivHide = false;
    this.noOfMembersDiv = false;
    this.btnText = 'Create Constituency';
  }

  GetConstituencyName(ElectionId: any) {
    this.spinner.show();
    this.callAPIService.setHttp('get', 'Web_Election_Get_ConstituencyName?UserId=' + this.commonService.loggedInUserId() + '&ElectionId=' + ElectionId, false, false, false, 'ncpServiceForWeb');
    this.callAPIService.getHttp().subscribe((res: any) => {
      if (res.data == 0) {
        this.spinner.hide();
        this.constituencyArray = res.data1;
        console.log(this.constituencyArray);
      } else {
        this.spinner.hide();
        this.constituencyArray = [];
        this.toastrService.error("Constituency Name is not available");
      }
    }, (error: any) => {
      this.spinner.hide();
      if (error.status == 500) {
        this.router.navigate(['../500'], { relativeTo: this.route });
      }
    })
  }

  editConstituency(masterId: any) {//Edit api
    // this.spinner.show();
    this.callAPIService.setHttp('get', 'Web_Election_Get_ConstituencyDetails?ConstituencyId=' + masterId, false, false, false, 'ncpServiceForWeb');
    this.callAPIService.getHttp().subscribe((res: any) => {
      if (res.data == 0) {
        this.spinner.hide();
        this.constituencyDetailsArray = res.data1[0];
        this.addSubConstituencyArray = res.data2;
        this.patchCreateConstituency(this.constituencyDetailsArray);
      } else {
        this.spinner.hide();
        this.toastrService.error("Data is not available");
      }
    }, (error: any) => {
      this.spinner.hide();
      if (error.status == 500) {
        this.router.navigate(['../500'], { relativeTo: this.route });
      }
    })
  }

  subConstituencyRadiobtn(subEleId: any) {
    if (subEleId == 1) {
      this.subConstituencyDivHide = true;
      this.subConstituencyTableDiv = true;
      this.addSubConstituencyArray = [];
    } else {
      this.addSubConstituencyArray = [];
      this.subConstituencyTableDiv = false;
      this.subConstituencyDivHide = false;
    }

  }

  addSubConstituency() {
    if (this.createConstituencyForm.value.ElectionId != this.createConstituencyForm.value.subEleName) {
      let electionNameByEleId;
      let subElectionNameBySubEleId;

      this.electionName.find((ele: any) => { // find election name by ele id
        if (this.createConstituencyForm.value.subEleName == ele.Id) {
          electionNameByEleId = ele.ElectionName;
        }
      });

      this.constituencyArray.find((ele: any) => { // find sub election name by sub ele id
        if (this.createConstituencyForm.value.subEleConstName == ele.id) {
          subElectionNameBySubEleId = ele.ConstituencyName;
        }
      });
      this.addSubConstituencyArray.push({ 'SubElectionId': this.createConstituencyForm.value.subEleName, 'SubConstituencyId': this.createConstituencyForm.value.subEleConstName, 'SubElection': electionNameByEleId, 'ConstituencyName': subElectionNameBySubEleId });
      this.createConstituencyForm.controls.subEleName.reset();
      this.createConstituencyForm.controls.subEleConstName.reset();
      this.subConsTableHideShowOnArray();
    }
    else {
      this.toastrService.error("Election Name & Sub Election Name should be Different");
    }
  }

  selMembers(id: any) {
    id == 1 ? this.noOfMembersDiv = true : this.noOfMembersDiv = false;
  }

  validationNoofMembers() {
    if (this.createConstituencyForm.value.Members == 1) {
      this.createConstituencyForm.controls["NoofMembers"].setValidators(Validators.required);
      this.createConstituencyForm.controls["NoofMembers"].updateValueAndValidity();
      this.createConstituencyForm.controls["NoofMembers"].clearValidators();
    }
    else {
      this.createConstituencyForm.controls["NoofMembers"].clearValidators();
      this.createConstituencyForm.controls["NoofMembers"].updateValueAndValidity();
    }
  }

  validationSubElectionForm() {
    if (this.createConstituencyForm.value.IsSubConstituencyApplicable == 1) {
      this.createConstituencyForm.controls["subEleName"].setValidators(Validators.required);
      this.createConstituencyForm.controls["subEleConstName"].setValidators(Validators.required);
      this.createConstituencyForm.controls["subEleName"].updateValueAndValidity();
      this.createConstituencyForm.controls["subEleConstName"].updateValueAndValidity();
      this.createConstituencyForm.controls["subEleName"].clearValidators();
      this.createConstituencyForm.controls["subEleConstName"].clearValidators();
    }
    else {
      this.createConstituencyForm.controls["subEleName"].clearValidators();
      this.createConstituencyForm.controls["subEleName"].updateValueAndValidity();
      this.createConstituencyForm.controls["subEleConstName"].clearValidators();
      this.createConstituencyForm.controls["subEleConstName"].updateValueAndValidity();
    }
  }

  delConfirmation(index: any) { //subElection data remove
    this.index = index;
    this.deleteConfirmModel('subElectionDelFlag');
  }

  deleteConfirmModel(flag: any) {
    const dialogRef = this.dialog.open(DeleteComponent);
    dialogRef.afterClosed().subscribe(result => {
      if (result == 'Yes') {
        if (flag == 'electionMasterDelFlag') {
          this.deleteElectionMasterData();

        } else {
          this.addSubConstituencyArray.splice(this.index, 1);
          this.subConsTableHideShowOnArray();
        }
      }
    });
  }

  delConfirmEleMaster(event: any) { //Election Master data remove
    this.constId = event;
    this.deleteConfirmModel('electionMasterDelFlag');
  }

  subConsTableHideShowOnArray() {
    this.addSubConstituencyArray.length != 0 ? this.subConstituencyTableDiv = true : this.subConstituencyTableDiv = false; // hide div on array
  }

  deleteElectionMasterData() {
    this.callAPIService.setHttp('get', 'Web_Election_Delete_Constituency?ConstituencyId=' + this.constId + '&CreatedBy=' + this.commonService.loggedInUserId(), false, false, false, 'ncpServiceForWeb');
    this.callAPIService.getHttp().subscribe((res: any) => {
      if (res.data == 0) {
        this.toastrService.success(res.data1[0].Msg);
        this.resetConstituencyName();
        this.getConstituency();
      } else {
        this.toastrService.error('Something went wrong please try again');
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
    this.getConstituency();
  }


  // filter form 

  filterData() {
    this.paginationNo = 1;
    this.getConstituency();
  }

  clearFilter(flag: any) {
    if (flag == 'electionName') {
      this.filterForm.controls['ElectionNameId'].setValue(0);
    } else if (flag == 'search') {
      this.filterForm.controls['Search'].setValue('');
    }
    this.paginationNo = 1;
    this.getConstituency();
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
        this.getConstituency();
      }
      );
  }
}

