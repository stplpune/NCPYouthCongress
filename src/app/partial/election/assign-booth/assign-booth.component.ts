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
    this.defaultFilterForm();
    this.GetBoothList();
     this.getAssembly();
     this.getElection();
     this.getAssignedBoothToElection();
     this.searchFilters('false');
  }

  defaultAssignBoothForm() {
    this.assignBoothForm = this.fb.group({
      Id: [0],
      ElectionId: [0, Validators.required],
      ConstituencyId: ['', Validators.required],
      strAssmblyBoothId: ['[[{"AssemblyId":9,"BoothId":9}]]'],
    })
  }

  get f() { return this.assignBoothForm.controls };

  defaultFilterForm() {
    this.filterForm = this.fb.group({
      ElectionId: [0],
      Search: [''],
    })
  }

  onSubmitElection() {
    this.submitted = true;
    let formData = this.assignBoothForm.value;
    if (this.assignBoothForm.invalid) {
      this.spinner.hide();
      return;
    }
    else  {
      this.spinner.show();
  
      let id;
      formData.Id == "" || formData.Id == null ? id = 0 : id = formData.Id;

      let obj = id + '&ElectionId=' + formData.ElectionId + '&ConstituencyId=' + formData.ConstituencyId
       + '&strAssmblyBoothId=' + formData.strAssmblyBoothId +'&CreatedBy=' + this.commonService.loggedInUserId() ;
      this.callAPIService.setHttp('get', 'Web_Insert_Election_AssignBoothToElection?Id=' + obj, false, false, false, 'ncpServiceForWeb');
      this.callAPIService.getHttp().subscribe((res: any) => {
        if (res.data == 0) {
          this.toastrService.success(res.data1[0].Msg);
          //this.getElectionMaster();
          this.spinner.hide();
          this.defaultAssignBoothForm();
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

  GetBoothList() {
    this.spinner.show();
    this.callAPIService.setHttp('get', 'Web_Election_GetBoothList?ConstituencyId=' + 258 + '&UserId=' + this.commonService.loggedInUserId() , false, false, false, 'ncpServiceForWeb');
    this.callAPIService.getHttp().subscribe((res: any) => {
      if (res.data == 0) {
        this.spinner.hide();
        this.boothListArray = res.data1;
      } else {
        this.toastrService.error("Data is not available");
      }
    }, (error: any) => {
      if (error.status == 500) {
        this.router.navigate(['../500'], { relativeTo: this.route });
      }
    })
  }

  getAssignedBoothToElection() {
    this.spinner.show();
    let formData = this.filterForm.value;
    let obj = '&ElectionId=' + formData.ElectionId + '&UserId=' + this.commonService.loggedInUserId() + '&Search=' + formData.Search +
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

  patchElectionRecord() {
    this.btnText = 'Update Booths';
    // this.createElectionForm.patchValue({
    //   Id: this.electionDetailsArray.Id,
    //   ElectionName: this.electionDetailsArray.ElectionName,
    //   ElectionTypeId: this.electionDetailsArray.ElectionTypeId,
    //   IsAsemblyBoothListApplicable: this.electionDetailsArray.IsAsemblyBoothListApplicable,
    //   IsSubElectionApplicable: this.electionDetailsArray.IsSubElectionApplicable,
    // })
  }

  clearForm() {
    this.submitted = false;
    this.btnText = 'Assign Booths'
    this.defaultAssignBoothForm();
  }


  delConfirmAssBothEle(event: any) {
    this.ElectionId = event;
    this.deleteConfirmModel();
  }

  deleteConfirmModel() {
    const dialogRef = this.dialog.open(DeleteComponent);
    dialogRef.afterClosed().subscribe(result => {
          this.deleteElectionMasterData();
    });
  }

  deleteElectionMasterData() {
    this.callAPIService.setHttp('get', 'Web_Insert_Election_DeleteBoothToElection?ElectionId=' + this.ElectionId + '&CreatedBy=' + this.commonService.loggedInUserId(), false, false, false, 'ncpServiceForWeb');
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

  // onClickPagintion(pageNo: number) {
  //   this.paginationNo = pageNo;
  //   this.getElectionMaster();
  // }

  clearFilter(flag: any) {
    if (flag == 'electionType') {
      this.filterForm.controls['ElectionTypeId'].setValue(0);
    } else if (flag == 'search') {
      this.filterForm.controls['Search'].setValue('');
    }
    this.paginationNo = 1;
   // this.getElectionMaster();
  }

  filterData() {
    this.paginationNo = 1;
   // this.getElectionMaster();
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
       // this.getElectionMaster();
      }
      );
  }
}
