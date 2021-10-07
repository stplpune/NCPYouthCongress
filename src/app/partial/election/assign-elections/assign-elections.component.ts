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
    this.getElection();
  }

  defaultAssElectionForm() {
    this.assignElectionForm = this.fb.group({
      Id: [0],
      clientId: [''],
      ElectionId: ['', Validators.required],
      ConstituencyId: ['', Validators.required],
    })
  }

  get f() { return this.assignElectionForm.controls };

  defaultFilterForm() {
    this.filterForm = this.fb.group({
      ElectionId: [0],
      id2: [0],
      Search: [''],
    })
  }

  
  onSubmitAssElection() {
    this.submitted = true;
    console.log(this.assignElectionForm.value)
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

   getElection() {
    this.spinner.show();
    this.callAPIService.setHttp('get', 'Web_Election_Get_ElectionNameHaveConstituency?UserId=' + this.commonService.loggedInUserId(), false, false, false, 'ncpServiceForWeb');
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
        this.assignElectionForm.controls['ConstituencyId'].setValue(this.ConstituencyId);
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

  clearForm() {
    this.submitted = false;
    this.btnText = 'Assign Booths'
    this.defaultAssElectionForm();
  }

  delConfirmAssEle(assElectionId: any) {
    this.assElectionId = assElectionId;
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


  clearFilter(flag:any){
    if(flag ==  'notifications'){
      this.filterForm.controls['ScopeId'].setValue(0);
    }else  if(flag ==  'search'){
      this.filterForm.controls['searchText'].setValue('');
    }else  if(flag ==  'Type'){
      this.filterForm.controls['fromTo'].setValue(['','']);
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
