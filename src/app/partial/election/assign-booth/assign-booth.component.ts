import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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
  selector: 'app-assign-booth',
  templateUrl: './assign-booth.component.html',
  styleUrls: ['./assign-booth.component.css', '../../partial.component.css']
})
export class AssignBoothComponent implements OnInit {


  assignBoothForm!: FormGroup;
  submitted = false;
  paginationNo: number = 1;
  pageSize: number = 10;
  total: any;
  btnText = 'Assign Booths';
  filterForm!: FormGroup;
  subject: Subject<any> = new Subject();
  searchFilter = "";
  HighlightRow: any;
  assemblyArray: any;
  boothListArray: any;
  electionNameArray: any;
  constituencyNameArray: any;
  assignedBoothToElectionArray: any;
  ElectionId: any;
  AssemblyBoothArray: any = [];
  AssemblyId: any;
  assemblyBoothJSON: any;
  boothDivHide: boolean = false;
  ConstiId: any;
  ConstituencyId: any;
  AssBoothListDetailArray: any;


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
    this.defaultAssignBoothForm();
    this.getAssembly();
    this.getElection();
    this.defaultFilterForm();
    this.getAssignedBoothToElection();
    this.searchFilters('false');
  }

  defaultAssignBoothForm() {
    this.assignBoothForm = this.fb.group({
      Id: [0],
      ElectionId: ['', Validators.required],
      ConstituencyId: ['', Validators.required],
      Assembly: ['', Validators.required],
      Booths: ['', Validators.required],
    })
  }

  get f() { return this.assignBoothForm.controls };

  defaultFilterForm() {
    this.filterForm = this.fb.group({
      ElectionNameId: [0],
      Search: [''],
    })
  }

  onCheckChangeAssembly(event: any) {
    this.AssemblyId = event.target.value;
    if (this.AssemblyId) {
      this.GetBoothList(this.AssemblyId);
    }
  }

  onCheckChangeBooths(event: any) {
    let BoothId = event.target.value;
    this.AssemblyBoothArray.push({ 'AssemblyId': this.AssemblyId, 'BoothId': BoothId });
  }


  onSubmitElection() {
    this.submitted = true;
    let formData = this.assignBoothForm.value;
    if (this.assignBoothForm.invalid) {
      this.spinner.hide();
      return;
    }
    else {
      this.spinner.show();
      this.assemblyBoothJSON = JSON.stringify(this.AssemblyBoothArray);
      let id;
      formData.Id == "" || formData.Id == null ? id = 0 : id = formData.Id;

      let obj = id + '&ElectionId=' + formData.ElectionId + '&ConstituencyId=' + formData.ConstituencyId
        + '&strAssmblyBoothId=' + this.assemblyBoothJSON + '&CreatedBy=' + this.commonService.loggedInUserId();
      this.callAPIService.setHttp('get', 'Web_Insert_Election_AssignBoothToElection?Id=' + obj, false, false, false, 'ncpServiceForWeb');
      this.callAPIService.getHttp().subscribe((res: any) => {
        if (res.data == 0) {
          this.toastrService.success(res.data1[0].Msg);
          this.AssemblyBoothArray = [];
          this.getAssignedBoothToElection();
          this.spinner.hide();
          this.clearForm();
          this.submitted = false;
          this.btnText = 'Assign Booths';
        } else {
          this.spinner.hide();
          this.toastrService.error("Data is not available");
        }
      }, (error: any) => {
        if (error.status == 500) {
          this.router.navigate(['../500'], { relativeTo: this.route });
        }
      })
    }
  }

  getElection() {
    this.spinner.show();
    this.callAPIService.setHttp('get', 'Web_GetElection?UserId=' + this.commonService.loggedInUserId(), false, false, false, 'ncpServiceForWeb');
    this.callAPIService.getHttp().subscribe((res: any) => {
      if (res.data == 0) {
        this.spinner.hide();
        this.electionNameArray = res.data1;
        if (this.btnText == 'Update Booths') {
          this.GetBoothList(this.AssemblyId);
        }
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
        this.assignBoothForm.controls['ConstituencyId'].setValue(this.ConstituencyId);
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


  getAssembly() {
    this.spinner.show();
    this.callAPIService.setHttp('get', 'Web_Election_GetAssembly?UserId=' + this.commonService.loggedInUserId(), false, false, false, 'ncpServiceForWeb');
    this.callAPIService.getHttp().subscribe((res: any) => {
      if (res.data == 0) {
        this.spinner.hide();
        this.assemblyArray = res.data1;
      } else {
        this.toastrService.error("Data is not available");
      }
    }, (error: any) => {
      if (error.status == 500) {
        this.router.navigate(['../500'], { relativeTo: this.route });
      }
    })
  }

  GetBoothList(AssemblyId: any) {
    this.spinner.show();
    this.callAPIService.setHttp('get', 'Web_Election_GetBoothList?ConstituencyId=' + AssemblyId + '&UserId=' + this.commonService.loggedInUserId(), false, false, false, 'ncpServiceForWeb');
    this.callAPIService.getHttp().subscribe((res: any) => {
      if (res.data == 0) {

        this.spinner.hide();
        this.boothDivHide = true;
        this.boothListArray = res.data1;

      } else {
        this.spinner.hide();
        this.toastrService.error("Data is not available");
      }
    }, (error: any) => {
      if (error.status == 500) {
        this.router.navigate(['../500'], { relativeTo: this.route });
      }
    })
  }

  getAssignedBoothToElection() {//get TableRecord
    this.spinner.show();
    let formData = this.filterForm.value;
    let obj = '&ElectionId=' + formData.ElectionNameId + '&UserId=' + this.commonService.loggedInUserId() + '&Search=' + formData.Search +
      '&nopage=' + this.paginationNo;
    this.callAPIService.setHttp('get', 'Web_Election_GetAssignedBoothToElection?' + obj, false, false, false, 'ncpServiceForWeb');
    this.callAPIService.getHttp().subscribe((res: any) => {
      if (res.data == 0) {
        this.spinner.hide();
        this.assignedBoothToElectionArray = res.data1;
        this.total = res.data2[0].TotalCount;
      } else {
        this.spinner.hide();
        this.assignedBoothToElectionArray = [];
        // this.toastrService.error("Data is not available");
      }
    }, (error: any) => {
      if (error.status == 500) {
        this.router.navigate(['../500'], { relativeTo: this.route });
      }
    })
  }

  getAssignedBoothListDetail(ConstituencyId: any, ElectionId: any) {//modelRecord
    this.spinner.show();
    this.callAPIService.setHttp('get', 'Web_Election_GetAssignedBoothListDetail?ConstituencyId=' + ConstituencyId + '&UserId=' + this.commonService.loggedInUserId() + '&ElectionId=' + ElectionId, false, false, false, 'ncpServiceForWeb');
    this.callAPIService.getHttp().subscribe((res: any) => {
      if (res.data == 0) {
        this.spinner.hide();
        this.AssBoothListDetailArray = res.data1;
      } else {
        this.spinner.hide();
        this.toastrService.error("Data is not available");
      }
    }, (error: any) => {
      if (error.status == 500) {
        this.router.navigate(['../500'], { relativeTo: this.route });
      }
    })
  }

  patchAssBoothElection(HeaderId: any) {
    this.spinner.show();
    this.callAPIService.setHttp('get', 'Web_Election_GetAssignedBoothListbyHeaderId?HeaderId=' + HeaderId, false, false, false, 'ncpServiceForWeb');
    this.callAPIService.getHttp().subscribe((res: any) => {
      if (res.data == 0) {
      this.editAssignBoothsPatchValue(res.data1[0]);
      this.btnText = 'Update Booths';
  
    } else {
      this.spinner.hide();
      this.toastrService.error("Data is not available");
    }
    }, (error: any) => {
      if (error.status == 500) {
        this.router.navigate(['../500'], { relativeTo: this.route });
      }
    })
  }

  editAssignBoothsPatchValue(objData:any){
    console.log(objData);
      this.HighlightRow = objData.SrNo;
      this.boothDivHide = true;
      this.ConstituencyId = objData.ConstituencyId;
      this.assignBoothForm.patchValue({
        Id: objData.Id,
        ElectionId: objData.ElectionId,
        Assembly:objData.Assembly
      });
      this.GetConstituencyName(objData.ElectionId);
  }
  
  clearForm() {
    this.submitted = false;
    this.btnText = 'Assign Booths'
    this.defaultAssignBoothForm();
    this.boothListArray = [];
    this.boothDivHide = false;
  }

  delConfirmAssBothEle(ElectionId: any) {
    this.ElectionId = ElectionId;
    this.deleteConfirmModel();
  }

  deleteConfirmModel() {
    const dialogRef = this.dialog.open(DeleteComponent);
    dialogRef.afterClosed().subscribe(result => {
      if (result == 'Yes') {
        this.deleteElectionMasterData();
      }
    });
  }

  deleteElectionMasterData() {
    this.callAPIService.setHttp('get', 'Web_Insert_Election_DeleteBoothToElection?HeaderId=' + this.ElectionId + '&CreatedBy=' + this.commonService.loggedInUserId(), false, false, false, 'ncpServiceForWeb');
    this.callAPIService.getHttp().subscribe((res: any) => {
      if (res.data == 0) {
        this.toastrService.success(res.data1[0].Msg);
        this.getAssignedBoothToElection();
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
    this.getAssignedBoothToElection();
  }

  clearFilter(flag: any) {
    if (flag == 'electionType') {
      this.filterForm.controls['ElectionNameId'].setValue(0);
    } else if (flag == 'search') {
      this.filterForm.controls['Search'].setValue('');
    }
    this.paginationNo = 1;
    this.getAssignedBoothToElection();
  }

  filterData() {
    this.paginationNo = 1;
    this.getAssignedBoothToElection();
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
        this.getAssignedBoothToElection();
      }
      );
  }
}
