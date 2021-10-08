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
  selector: 'app-assign-elections',
  templateUrl: './assign-elections.component.html',
  styleUrls: ['./assign-elections.component.css', '../../partial.component.css']
})
export class AssignElectionsComponent implements OnInit {

  getClientName: any;
  assignElectionForm!: FormGroup;
  submitted = false;
  paginationNo: number = 1;
  pageSize: number = 10;
  total: any;
  btnText = 'Assign Booths';
  filterForm!: FormGroup;
  subject: Subject<any> = new Subject();
  searchFilter = "";
  HighlightRow: any;
  assElectionId: any;
  electionNameArray: any;
  constituencyNameArray: any;
  ConstituencyId: any;
  highlightedRow: any;
  subConsArray: any;
  addSubConstituencyArray: any = [];
  index: any;
  subConstituencyTableDiv: boolean = false;

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
    this.defaultAssElectionForm();
    this.defaultFilterForm();
    this.searchFilters('false');
    this.getClient();
    this.getElection();
  }

  defaultAssElectionForm() {
    this.assignElectionForm = this.fb.group({
      Id: [0],
      ClientId: ['', Validators.required],
      ElectionId: [''],
      strConstituency: [''],
      Createdby: [this.commonService.loggedInUserId()],
    })
  }

  get f() { return this.assignElectionForm.controls };

  defaultFilterForm() {
    this.filterForm = this.fb.group({
      clientId: [0],
      ElectionId: [0],
      id2: [0],
      Search: [''],
    })
  }


  onSubmitAssElection() {
    debugger;
    // this.validationNoofMembers();
    let formData = this.assignElectionForm.value;
    // if (this.assignElectionForm.value.IsSubConstituencyApplicable == 1 && this.addSubConstituencyArray.length == 0) {
    //   this.validationSubElectionForm();
    // }
    this.submitted = true;
    if (this.assignElectionForm.invalid) {
      this.spinner.hide();
      return;
    }

    if (formData.IsSubConstituencyApplicable == 1) {
      this.addSubConstituencyArray.map((ele: any) => {
        delete ele['selConstituencyName'];
        delete ele['selElectionName'];
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
    // this.subConsArray ? this.subConsArray : this.subConsArray = "";
    let obj = id + '&ElectionId=' + formData.ElectionId + '&ConstituencyName=' + formData.ConstituencyName + '&Members=' + formData.Members +
      '&NoofMembers=' + NoofMembers + '&IsSubConstituencyApplicable=' + formData.IsSubConstituencyApplicable + '&CreatedBy=' + this.commonService.loggedInUserId() + '&StrSubElectionId=' + this.subConsArray;
    this.callAPIService.setHttp('get', 'Web_Insert_Assign_Constituency_to_Client?Id=' + obj, false, false, false, 'ncpServiceForWeb');
    this.callAPIService.getHttp().subscribe((res: any) => {
      if (res.data == 0) {
        this.spinner.hide();
        this.toastrService.success(res.data1[0].Msg);
        this.btnText = "Create Constituency";
        // this.resetConstituencyName();
        // this.getConstituency();
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

  getElection() {
    this.spinner.show();
    this.callAPIService.setHttp('get', 'Web_GetElection?UserId=' + this.commonService.loggedInUserId(), false, false, false, 'ncpServiceForWeb');
    this.callAPIService.getHttp().subscribe((res: any) => {
      if (res.data == 0) {
        this.spinner.hide();
        this.electionNameArray = res.data1;
      } else {
        this.spinner.hide();
        this.electionNameArray = [];
      }
    }, (error: any) => {
      this.spinner.hide();
      if (error.status == 500) {
        this.router.navigate(['../500'], { relativeTo: this.route });
      }
    })
  }

  getClient() {
    this.spinner.show();
    this.callAPIService.setHttp('get', 'Web_Get_Client_ddl?UserId=' + this.commonService.loggedInUserId(), false, false, false, 'ncpServiceForWeb');
    this.callAPIService.getHttp().subscribe((res: any) => {
      if (res.data == 0) {
        this.spinner.hide();
        this.getClientName = res.data1;
      } else {
        this.spinner.hide();
        this.electionNameArray = [];
      }
    }, (error: any) => {
      this.spinner.hide();
      if (error.status == 500) {
        this.router.navigate(['../500'], { relativeTo: this.route });
      }
    })
  }

  GetConstituencyName(ElectionId: any) {
    this.spinner.show();
    this.callAPIService.setHttp('get', 'Web_Election_Get_ConstituencyName?UserId=' + this.commonService.loggedInUserId() + '&ElectionId=' + ElectionId, false, false, false, 'ncpServiceForWeb');
    this.callAPIService.getHttp().subscribe((res: any) => {
      if (res.data == 0) {
        this.assignElectionForm.controls['strConstituency'].setValue(this.ConstituencyId);
        this.spinner.hide();
        this.constituencyNameArray = res.data1;
      } else {
        this.spinner.hide();
        this.constituencyNameArray = [];
        this.toastrService.error("Constituency Name is not available");
      }
    }, (error: any) => {
      this.spinner.hide();
      if (error.status == 500) {
        this.router.navigate(['../500'], { relativeTo: this.route });
      }
    })
  }

  // patchCreateConstituency(data: any) {
  //   this.highlightedRow = data.Id;
  //   this.btnText = 'Update Constituency';
  //   data.Members == 1 ? this.noOfMembersDiv = true : this.noOfMembersDiv = false;
  //   data.IsSubConstituencyApplicable == 1 ? (this.subConstituencyDivHide = true, this.subConstituencyTableDiv = true) : (this.subConstituencyDivHide = false, this.subConstituencyTableDiv = false);
  //   this.createConstituencyForm.patchValue({
  //     Id: data.Id,
  //     ElectionId: data.ElectionId,
  //     ConstituencyName: data.ConstituencyName,
  //     Members: data.Members,
  //     NoofMembers: data.NoofMembers,
  //     IsSubConstituencyApplicable: data.IsSubConstituencyApplicable,
  //   });
  // }

  validationNoofMembers() {
    if (this.assignElectionForm.value.Members == 1) {
      this.assignElectionForm.controls["NoofMembers"].setValidators(Validators.required);
      this.assignElectionForm.controls["NoofMembers"].updateValueAndValidity();
      this.assignElectionForm.controls["NoofMembers"].clearValidators();
    }
    else {
      this.assignElectionForm.controls["NoofMembers"].clearValidators();
      this.assignElectionForm.controls["NoofMembers"].updateValueAndValidity();
    }
  }

  validationSubElectionForm() {
    if (this.assignElectionForm.value.IsSubConstituencyApplicable == 1) {
      this.assignElectionForm.controls["subEleName"].setValidators(Validators.required);
      this.assignElectionForm.controls["subEleConstName"].setValidators(Validators.required);
      this.assignElectionForm.controls["subEleName"].updateValueAndValidity();
      this.assignElectionForm.controls["subEleConstName"].updateValueAndValidity();
      this.assignElectionForm.controls["subEleName"].clearValidators();
      this.assignElectionForm.controls["subEleConstName"].clearValidators();
    }
    else {
      this.assignElectionForm.controls["subEleName"].clearValidators();
      this.assignElectionForm.controls["subEleName"].updateValueAndValidity();
      this.assignElectionForm.controls["subEleConstName"].clearValidators();
      this.assignElectionForm.controls["subEleConstName"].updateValueAndValidity();
    }
  }

  clearForm() {
    this.submitted = false;
    this.btnText = 'Assign Booths'
    this.defaultAssElectionForm();
  }

  delConfirmAssEle(assElectionId: any) {
    this.assElectionId = assElectionId;
    this.deleteConfirmModel('subElectionDelFlag');
  }

  deleteConfirmModel(flag: any) {
    const dialogRef = this.dialog.open(DeleteComponent);
    dialogRef.afterClosed().subscribe(result => {
      if (result == 'Yes') {
        if (flag == 'subElectionDelFlag') {
          this.addSubConstituencyArray.splice(this.index, 1);
          this.subConsTableHideShowOnArray();
        } else {
          this.deleteClientData();
        }
      }
    });
  }

  subConsTableHideShowOnArray() {
    this.addSubConstituencyArray.length != 0 ? this.subConstituencyTableDiv = true : this.subConstituencyTableDiv = false; // hide div on array
  }

  deleteClientData() {
    this.callAPIService.setHttp('get', 'Web_Insert_Election_DeleteBoothToElection?HeaderId=' + this.assElectionId + '&CreatedBy=' + this.commonService.loggedInUserId(), false, false, false, 'ncpServiceForWeb');
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
    if (flag == 'notifications') {
      this.filterForm.controls['ScopeId'].setValue(0);
    } else if (flag == 'search') {
      this.filterForm.controls['searchText'].setValue('');
    } else if (flag == 'Type') {
      this.filterForm.controls['fromTo'].setValue(['', '']);
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

  addSubConstituency() {
    let eleName: any;
    let subElectionNameBySubEleId: any;
    this.electionNameArray.find((ele: any) => { // find election name by ele id
      if (this.assignElectionForm.value.ElectionId == ele.Id) {
        eleName = ele.ElectionName;
      }
    });

    this.constituencyNameArray.find((ele: any) => { // find sub election name by sub ele id
      if (this.assignElectionForm.value.strConstituency == ele.id) {
        subElectionNameBySubEleId = ele.ConstituencyName;
      }
    });

    let arrayOfObj = this.subConstArrayCheck(this.assignElectionForm.value.ElectionId, this.assignElectionForm.value.strConstituency);
    if (arrayOfObj == false) {
      this.addSubConstituencyArray.push({ 'selElectionName': eleName, 'selConstituencyName': subElectionNameBySubEleId, 'ElectionId': this.assignElectionForm.value.ElectionId, 'ConstituencyId': this.assignElectionForm.value.strConstituency });
      console.log(this.addSubConstituencyArray);
    } else {
      this.toastrService.error("Election Name & Constituency Name	already exists");
    }
    this.assignElectionForm.controls.ElectionId.reset();
    this.assignElectionForm.controls.strConstituency.reset();
    this.subConsTableHideShowOnArray();
  }

  subConstArrayCheck(eleName: any, subEleCostName: any) {
    return this.addSubConstituencyArray.some((el: any) => {
      return el.ElectionId === eleName && el.ConstituencyId === subEleCostName;
    });
  }
}
