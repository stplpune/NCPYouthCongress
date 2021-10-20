import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { CallAPIService } from 'src/app/services/call-api.service';
import { CommonService } from 'src/app/services/common.service';
import { ActivatedRoute, Router } from '@angular/router';
import { DateTimeAdapter } from 'ng-pick-datetime';

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
  programTitle:string = "Create";
  modalStatusMsg = "end this program";
  globalProgramData:any;

  constructor(private spinner: NgxSpinnerService, private callAPIService: CallAPIService, private toastrService: ToastrService,
    public datepipe: DatePipe, private fb: FormBuilder, private commonService: CommonService, private route: ActivatedRoute,
    private router: Router,   public dateTimeAdapter: DateTimeAdapter<any>,
  ) {{ dateTimeAdapter.setLocale('en-IN')}}

  ngOnInit(): void {
    this.minDate.setDate(this.minDate.getDate() - 1);
    this.defaultProgramForm();
    this.defaultFilterForm();
    this.getProgramList();

  }

  defaultProgramForm() {
    this.createProgram = this.fb.group({
      Id: [0],
      ProgramTitle: ['',  [Validators.required]],
      ProgramDescription: ['', [Validators.required]],
      ProgramStartDate: ['', Validators.required],
      CreatedBy: [this.commonService.loggedInUserId()]
    })
  }

  getProgramList() {
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
    } ,(error:any) => {
      if (error.status == 500) {
        this.router.navigate(['../../500'], { relativeTo: this.route });
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
    this.spinner.show();
    let getObj = this.createProgram.value;
    this.submitted = true;
    if (this.createProgram.invalid) {
      this.spinner.hide();
      return;
    }
    else if (getObj.ProgramTitle.trim() == '' || getObj.ProgramTitle ==  null || getObj.ProgramTitle == undefined) {
      this.toastrService.error("Program Title can not contain space only");
      this.spinner.hide();
      return;
    }
    else if (getObj.ProgramDescription.trim() == '' || getObj.ProgramDescription ==  null || getObj.ProgramDescription == undefined) {
      this.toastrService.error("Program Description can not contain space only");
      this.spinner.hide();
      return;
    }
    else {
      this.createProgram.value['ProgramStartDate'] = this.datepipe.transform(this.createProgram.value.ProgramStartDate, 'dd/MM/yyyy');
      let fromData: any = new FormData();

      Object.keys(this.createProgram.value).forEach((cr: any, ind: any) => {
        let value = Object.values(this.createProgram.value)[ind] != null ? Object.values(this.createProgram.value)[ind] : 0;
        fromData.append(cr, value)
      })

      // this.callAPIService.setHttp('get', 'Web_Insert_PartyProgram?Id=' + getObj.Id + '&ProgramTitle=' + getObj.ProgramTitle + '&ProgramDescription=' + getObj.ProgramDescription + '&ProgramStartDate=' +  + '&CreatedBy=' + getObj.CreatedBy, false, false, false, 'ncpServiceForWeb');
      this.callAPIService.setHttp('Post', 'Web_Insert_PartyProgram_1_0', false, fromData, false, 'ncpServiceForWeb');
      this.callAPIService.getHttp().subscribe((res: any) => {
        if (res.data == 0) {
          this.clearForm();
          this.toastrService.success(res.data1[0].Msg);
          this.getProgramList();
          this.spinner.hide();
       
        } else {
          this.spinner.hide();
            // this.toastrService.error("Data is not available 1");
        }
      } ,(error:any) => {
        if (error.status == 500) {
          this.spinner.hide();
          this.router.navigate(['../../500'], { relativeTo: this.route });
        }
      })
    }
  }

  selDateRangeByFilter(getDate: any) {
    this.defaultCloseBtn = true;
    this.defaultFromDate = getDate[0];
    this.defaultToDate = getDate[1];
    this.paginationNo = 1 ; 
    this.getProgramList();
  }

  clearValue() {
    this.defaultCloseBtn = false;
    // this.defaultToDate = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000);
    // this.defaultFromDate = new Date(Date.now() + - 365 * 24 * 60 * 60 * 1000);
    this.topFilter.controls['fromTo'].setValue(['', '']);
    this.paginationNo = 1 ; 
    this.getProgramList();

  }

  ViewProgramList(programDetails: any) {
    this.programDetails = programDetails;
  }

  editrogramList(programDetails: any) {
    this.programTitle = "Update"
    this.HighlightRow = programDetails.Id;
    let date = this.commonService.dateFormatChange(programDetails.ProgramStartDate);
    this.createProgram.patchValue({
      Id: programDetails.Id,
      ProgramTitle: programDetails.ProgramTitle,
      ProgramDescription: programDetails.ProgramDescription,
      ProgramStartDate: date,
      CreatedBy: this.commonService.loggedInUserId(),
    });
  }
  
  // 
  clearForm() {
    this.programTitle = "Create"
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
          // this.toastrService.error("Data is not available 1");
      }
    } ,(error:any) => {
      if (error.status == 500) {
        this.router.navigate(['../../500'], { relativeTo: this.route });
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
          // this.toastrService.error("Data is not available 1");
      }
    } ,(error:any) => {
      if (error.status == 500) {
        this.router.navigate(['../../500'], { relativeTo: this.route });
      }
    })
  }

  onClickPagintion(pageNo: number) {
    this.programTitle = "Create";
    this.createProgram.reset();
    this.paginationNo = pageNo;
    this.getProgramList()
  }

  selprogramStatus(value: any) {
    this.globalStatusId = value;
    this.getProgramList();
  }

  partyProgramDetails(programListId: any, ProgramTitle:any,ProgramStatus:any) {
    if(ProgramStatus == 1){
      this.toastrService.info("Program is Upcomimg");
      return;
    }else if(ProgramStatus == 4){
      this.toastrService.info("Program is Cancelled");
      return;
    }else{
      let obj = {'programListId':programListId, 'programList':ProgramTitle}
      sessionStorage.setItem('programListIdKey', JSON.stringify(obj));
      this.router.navigate(['../party-program/details'], { relativeTo: this.route });
    }
  }

  removeProgram() {
    this.globalStatusId = 0;
    this.getProgramList();
  }

  ModalOpen(prgramStatus:any, programList:any){
    prgramStatus == 'EndProgram' ?  (this.modalStatusMsg = "End The Program",this.globalProgramData = programList) :  (this.modalStatusMsg = "Cancel the Program", this.globalProgramData = programList);
  }

  programStatus(modalFlag:any){
    (modalFlag = "End The Program") ? this.endProgramList(this.globalProgramData) : this.cancelProgramList(this.globalProgramData);
  }

  ModalOpenClose(){
    this.getProgramList()
  }
  
}


