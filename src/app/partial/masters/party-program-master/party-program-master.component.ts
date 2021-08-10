import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { CallAPIService } from 'src/app/services/call-api.service';
import { CommonService } from 'src/app/services/common.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-party-program-master',
  templateUrl: './party-program-master.component.html',
  styleUrls: ['./party-program-master.component.css', '../../partial.component.css'],
  providers: [DatePipe]
})
export class PartyProgramMasterComponent implements OnInit {
  programStatusArray = [{ id: 1, programStatus: 'Upcomimg' }, { id: 2, programStatus: 'Ongoing' }, { id: 3, programStatus: 'Completed' }, { id: '4', programStatus: 'Cancelled' }]
  public items: string[] = [];
  resultProgramList: any;
  defaultToDate: string = '';
  defaultFromDate: string = '';
  globalStatusId: any = 0;
  paginationNo: number = 1;
  total: any;
  minDate = new Date();
  createProgram!: FormGroup;
  submitted = false;
  programDetails: any;
  HighlightRow: any;
  topFilter!: FormGroup;
  defaultCloseBtn: boolean = false;
  pageSize: number = 10;
  disabledAction: boolean = true;

  constructor(private spinner: NgxSpinnerService, private callAPIService: CallAPIService, private toastrService: ToastrService,
    public datepipe: DatePipe, private fb: FormBuilder, private commonService: CommonService, private route: ActivatedRoute,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.defaultProgramForm();
    this.defaultFilterForm();
    this.getProgramList();

  }

  defaultProgramForm() {
    this.createProgram = this.fb.group({
      Id: [0],
      ProgramTitle: ['', Validators.required],
      ProgramDescription: ['', Validators.required],
      ProgramStartDate: ['', Validators.required],
      CreatedBy: [this.commonService.loggedInUserId()]
    })
  }

  getProgramList() {
    debugger;
    let fromDate: any;
    let toDate: any;

    if (this.topFilter.value.fromTo[0] != "" && this.topFilter.value.fromTo[1] != "" && this.topFilter.value.fromTo) {
      fromDate = this.datepipe.transform(this.defaultFromDate, 'dd/MM/yyyy');
      toDate = this.datepipe.transform(this.defaultToDate, 'dd/MM/yyyy');
    } else {
      fromDate = '';
      toDate = ''
    }

    this.spinner.show();
    this.callAPIService.setHttp('get', 'Web_GetProgram_1_0?StatusId=' + this.globalStatusId + '&FromDate=' + fromDate + '&ToDate=' + toDate + '&nopage=' + this.paginationNo, false, false, false, 'ncpServiceForWeb');
    this.callAPIService.getHttp().subscribe((res: any) => {
      if (res.data == 0) {
        this.spinner.hide();
        this.resultProgramList = res.data1;
        this.total = res.data2[0].TotalCount;
      } else {
        this.spinner.hide();
        if (res.data == 1) {
          this.resultProgramList = [];
          // this.toastrService.error("Data is not available 1");
        } else {
          this.toastrService.error("Please try again something went wrong");
        }
      }
    })
  }



  defaultFilterForm() {
    this.topFilter = this.fb.group({
      fromTo: [''],
      selectStatus: ['']
    })
  }

  get f() { return this.createProgram.controls };

  onSubmitProgramForm() {
    console.log(this.createProgram.value);
    this.submitted = true;
    if (this.createProgram.invalid) {
      this.spinner.hide();
      return;
    }
    else {
      let getObj = this.createProgram.value;
      let fromDate: any = this.datepipe.transform(this.createProgram.value.ProgramStartDate, 'dd/MM/yyyy');
      this.spinner.show();
      this.callAPIService.setHttp('get', 'Web_Insert_PartyProgram?Id=' + getObj.Id + '&ProgramTitle=' + getObj.ProgramTitle + '&ProgramDescription=' + getObj.ProgramDescription + '&ProgramStartDate=' + fromDate + '&CreatedBy=' + getObj.CreatedBy, false, false, false, 'ncpServiceForWeb');
      this.callAPIService.getHttp().subscribe((res: any) => {
        if (res.data == 0) {
          this.submitted = false;
          this.toastrService.success(res.data1[0].Msg);
          this.getProgramList();
          this.spinner.hide();
          this.clearForm();
        } else {
          this.spinner.hide();
          if (res.data == 1) {
            // this.toastrService.error("Data is not available 1");
          } else {
            this.toastrService.error("Please try again something went wrong");
          }
        }
      })
    }
  }

  selDateRangeByFilter(getDate: any) {
    this.defaultCloseBtn = true;
    this.defaultFromDate = getDate[0];
    this.defaultToDate = getDate[1];
    this.getProgramList();
  }

  clearValue() {
    this.defaultCloseBtn = false;
    // this.defaultToDate = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000);
    // this.defaultFromDate = new Date(Date.now() + - 365 * 24 * 60 * 60 * 1000);
    this.topFilter.controls['fromTo'].setValue(['', '']);
    this.getProgramList();

  }

  ViewProgramList(programDetails: any) {
    this.programDetails = programDetails;
  }

  editrogramList(programDetails: any) {
    this.HighlightRow = programDetails.Id;
    this.createProgram.patchValue({
      Id: programDetails.Id,
      ProgramTitle: programDetails.ProgramTitle,
      ProgramDescription: programDetails.ProgramDescription,
      ProgramStartDate: new Date(programDetails.ProgramStartDate),
      CreatedBy: this.commonService.loggedInUserId(),
    });
  }

  // 
  clearForm() {
    this.HighlightRow = null;
    this.submitted = false;
    this.createProgram.reset();
    this.getProgramList();
  }

  endProgramList(data: any) {
    this.spinner.show();
    let proStatus = 3;
    // status == 1 ?  proStatus = 0 : proStatus = 1; 
    this.callAPIService.setHttp('get', 'Web_End_PartyProgram?ProgramId=' + data.Id + '&StatusId=' + proStatus + '&CreatedBy=' + this.commonService.loggedInUserId(), false, false, false, 'ncpServiceForWeb');
    this.callAPIService.getHttp().subscribe((res: any) => {
      if (res.data == 0) {
        this.spinner.hide();
        this.toastrService.success(res.data1[0].Msg);
        this.getProgramList();
      } else {
        this.spinner.hide();
        if (res.data == 1) {
          // this.toastrService.error("Data is not available 1");
        } else {
          this.toastrService.error("Please try again something went wrong");
        }
      }
    })
  }

  cancelProgramList(data: any) {
    this.spinner.show();
    let proStatus = 4;
    // status == 1 ?  proStatus = 0 : proStatus = 1; 
    this.callAPIService.setHttp('get', 'Web_End_PartyProgram?ProgramId=' + data.Id + '&StatusId=' + proStatus + '&CreatedBy=' + this.commonService.loggedInUserId(), false, false, false, 'ncpServiceForWeb');
    this.callAPIService.getHttp().subscribe((res: any) => {
      if (res.data == 0) {
        this.spinner.hide();
        this.toastrService.success(res.data1[0].Msg);
        this.getProgramList();
      } else {
        this.spinner.hide();
        if (res.data == 1) {
          // this.toastrService.error("Data is not available 1");
        } else {
          this.toastrService.error("Please try again something went wrong");
        }
      }
    })
  }

  onClickPagintion(pageNo: number) {
    this.paginationNo = pageNo;
    this.getProgramList()
  }

  selprogramStatus(value: any) {
    this.globalStatusId = value;
    this.getProgramList();
  }

  partyProgramDetails(programListId: any) {
    localStorage.setItem('programListIdKey', JSON.stringify(programListId));
    this.router.navigate(['../party-program-details'], { relativeTo: this.route });
  }

  removeProgram() {
    this.globalStatusId = 0;
    this.getProgramList();
  }

}
