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
  selector: 'app-designation-master',
  templateUrl: './designation-master.component.html',
  styleUrls: ['./designation-master.component.css', '../../partial.component.css']
})
export class DesignationMasterComponent implements OnInit {


  DesigMasterForm!: FormGroup;
  submitted = false;
  paginationNo: number = 1;
  pageSize: number = 10;
  total: any;
  btnText = 'Create Designation';
  filterForm!: FormGroup;
  subject: Subject<any> = new Subject();
  searchFilter = "";
  HighlightRow: any;
  DesigMasterId: any;

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

  ngOnInit(){
    this.defaultProgramForm();
    this.defaultFilterForm();
    this.searchFilters('false');
  }

  defaultProgramForm() {
    this.DesigMasterForm = this.fb.group({
      Id: [0],
      DesignationName: ['', [Validators.required]],
      DesignationLevel: ['', Validators.required],
      chkLoginAllowed: [''],
    })
  }

  get f() { return this.DesigMasterForm.controls };

  defaultFilterForm() {
    this.filterForm = this.fb.group({
      ElectionTypeId: [0],
      Search: [''],
    })
  }

  clearForm() {
    this.submitted = false;
    this.btnText = 'Create Designation';
    this.defaultProgramForm();
  }

  onSubmitDesigMaster(){
    this.submitted = true;
    let formData = this.DesigMasterForm.value;
    console.log(formData);
    if (this.DesigMasterForm.invalid) {
      this.spinner.hide();
      return;
    }
    else {

    }
  }

  delConfirmation(event: any) { 
    this.DesigMasterId = event;
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
    this.callAPIService.setHttp('get', 'Delete_Election?ElectionId=' + this.DesigMasterId + '&CreatedBy=' + this.commonService.loggedInUserId(), false, false, false, 'ncpServiceForWeb');
    this.callAPIService.getHttp().subscribe((res: any) => {
      if (res.data == 0) {
        this.toastrService.success(res.data1[0].Msg);
        //this.getElectionMaster();
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

  patchElectionRecord() {
    this.btnText = 'Update Designation'

    // this.DesigMasterForm.patchValue({
    //   Id: this.DesigMasterArray.Id,
    //   DesignationName: this.DesigMasterArray.DesignationName,
    //   DesignationLevel: this.DesigMasterArray.DesignationLevel,
    //   chkLoginAllowed: this.DesigMasterArray.chkLoginAllowed,
    // })
  }

  onClickPagintion(pageNo: number) {
    this.paginationNo = pageNo;
    // this.getElectionMaster();
  }

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
    //this.getElectionMaster();
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
        //this.getElectionMaster();
      }
      );
  }

}
