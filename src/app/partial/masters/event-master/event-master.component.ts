import { DatePipe } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { CallAPIService } from 'src/app/services/call-api.service';
import { CommonService } from 'src/app/services/common.service';
import { NgxSpinnerService } from "ngx-spinner";
import { ToastrService } from 'ngx-toastr';
import { DateTimeAdapter } from 'ng-pick-datetime';
import { MatDialog } from '@angular/material/dialog';
import { DeleteComponent } from '../../dialogs/delete/delete.component';
@Component({
  selector: 'app-event-master',
  templateUrl: './event-master.component.html',
  styleUrls: ['./event-master.component.css', '../../partial.component.css'],
  providers: [DatePipe]
})
export class EventMasterComponent implements OnInit {
  htmlContent: any;
  @ViewChild('fileInput') fileInput!: ElementRef;

  config: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: '15rem',
    minHeight: '5rem',
    placeholder: 'Enter text here...',
    translate: 'no',
    defaultParagraphSeparator: 'p',
    defaultFontName: 'Arial',
    toolbarHiddenButtons: [
      ['bold', 'fontName', 'heading', 'fontSize']
    ],
    // customClasses: [
    //   {
    //     name: "quote",
    //     class: "quote",
    //   },
    //   {
    //     name: 'redText',
    //     class: 'redText'
    //   },
    //   {
    //     name: "titleText",
    //     class: "titleText",
    //     tag: "h1",
    //   },
    // ]
  };
  addEvent!: FormGroup;
  getImgExt: any;
  selectedFile: any;
  ImgUrl: any;
  imgName: any;
  @ViewChild('myInput') myInput!: ElementRef;
  eventListArray: any;
  paginationNo: number = 1;
  total: any;
  pageSize: number = 10;
  displayEventArray: any;
  IsChangeImage: boolean = false;
  maxDate: any = new Date();
  fromDate: any = "";
  toDate: any = "";
  dateRange: any;
  defaultCloseBtn: boolean = false;
  selRange = new FormControl();
  editObjectData: any;
  eventId: any;
  isDisplay: any;
  editEventText = "Publish Event";
  isDisplayFlag: any;
  submitted = false;
  IsDisplayStatus: any;
  publishText ="Create";

  constructor(
    private fb: FormBuilder,
    private commonService: CommonService,
    private callAPIService: CallAPIService,
    private router: Router,
    private route: ActivatedRoute,
    private datePipe: DatePipe,
    private spinner: NgxSpinnerService,
    private toastrService: ToastrService,
    public dateTimeAdapter: DateTimeAdapter<any>,
    public datepipe: DatePipe,
    public dialog: MatDialog,
  ) { { dateTimeAdapter.setLocale('en-IN'); } }

  ngOnInit(): void {
    this.defaultEventForm();
    this.getEventList();
  }

  defaultEventForm() {
    this.addEvent = this.fb.group({
      ProgramTitle: ['', Validators.required],
      ProgramDescription: ['', Validators.required],
      ProgramDate: [['',''], Validators.required],
      Id: [0],
      CreatedBy: [this.commonService.loggedInUserId()],
      IschangeImage: [],
    })
  }

  get f() { return this.addEvent.controls };

  resetEventForm() {
    this.editEventText = "Publish Event";
    this.removePhoto();
    this.submitted = false;
    this.addEvent.reset();
  }

  onSubmit() {
    this.spinner.show();
    this.submitted = true;
    if((this.addEvent.value.ProgramDate[0] == null || this.addEvent.value.ProgramDate[0] == "") && (this.addEvent.value.ProgramDate[1] == null || this.addEvent.value.ProgramDate[0] == "")){
      this.addEvent.controls['ProgramDate'].setValue('');
    }
    if (this.addEvent.invalid) {
      this.spinner.hide();
      return;
    }
    else {
      debugger;
      let ImageChangeFlag: any;
      this.submitted = false;
      let data = this.addEvent.value;
      data.Id == null  ? data.Id = 0 : data.Id = data.Id;
      if (this.selectedFile || this.IsChangeImage) {
        ImageChangeFlag = 1
      } else {
        ImageChangeFlag = 0
      }

      let fromDate: any = this.datePipe.transform(data.ProgramDate[0], 'dd/MM/yyyy');
      let toDate: any = this.datePipe.transform(data.ProgramDate[1], 'dd/MM/yyyy');
      let fromData = new FormData();
      fromData.append('ProgramTitle', data.ProgramTitle);
      fromData.append('ProgramDescription', data.ProgramDescription);
      fromData.append('ProgramStartDate', fromDate);
      fromData.append('ProgramEndDate', toDate);
      fromData.append('Id', data.Id);
      fromData.append('CreatedBy', this.commonService.loggedInUserId());
      fromData.append('IsChangeImage', ImageChangeFlag);

      fromData.append('EventImages', this.selectedFile);

      this.callAPIService.setHttp('Post', 'Web_Insert_EventMaster', false, fromData, false, 'ncpServiceForWeb');
      this.callAPIService.getHttp().subscribe((res: any) => {
        if (res.data == 0) {
          this.removePhoto();
          this.IsChangeImage = false;
          this.addEvent.reset();
          this.submitted = false;
          this.spinner.hide();
          this.toastrService.success("Event Addeed Successfully");
          this.getEventList();
          this.editEventText = "Publish Event";
        } else {
          this.spinner.hide();
          // this.toastrService.error("Data is not available 1");
        }
      }, (error: any) => {
        if (error.status == 500) {
          this.spinner.hide();
          this.router.navigate(['../../500'], { relativeTo: this.route });
        }
      })
    }
  }

  choosePhoto() {
    let clickPhoto: any = document.getElementById('my_file')
    clickPhoto.click();
  }

  readUrl(event: any) {
    let selResult = event.target.value.split('.');
    this.getImgExt = selResult.pop();
    this.getImgExt.toLowerCase();
    if (this.getImgExt == "png" || this.getImgExt == "jpg" || this.getImgExt == "jpeg") {
      this.selectedFile = <File>event.target.files[0];
      if (event.target.files && event.target.files[0]) {
        var reader = new FileReader();
        reader.onload = (event: any) => {
          this.ImgUrl = event.target.result;
        }
        reader.readAsDataURL(event.target.files[0]);
        this.imgName = event.target.files[0].name;
      }
    }
    else {
      this.toastrService.error("Profile image allowed only jpg or png format");
    }
  }

  getEventList() {
    this.spinner.show();
    this.callAPIService.setHttp('get', 'Web_GetEventList_1_0?UserId=' + this.commonService.loggedInUserId() + '&PageNo=' + this.paginationNo
      + '&FromDate=' + this.fromDate + '&ToDate=' + this.toDate, false, false, false, 'ncpServiceForWeb');
    this.callAPIService.getHttp().subscribe((res: any) => {
      if (res.data == 0) {
        this.spinner.hide();
        this.eventListArray = res.data1;
        this.total = res.data2[0].TotalCount;
      } else {
        this.eventListArray = [];
        this.spinner.hide();
        this.toastrService.error("Data is not available");
      }
    },
      (error: any) => {
        if (error.status == 500) {
          this.router.navigate(['../500'], { relativeTo: this.route });
        }
      }
    )
  }

  delConfirmation(eventId: any, IsDisplay: any) {
    this.eventId = eventId;
    IsDisplay == 1 ? this.isDisplayFlag = 0 : this.isDisplayFlag = 1;
    this.deleteConfirmModel();
  }

  deleteConfirmModel() {
    const dialogRef = this.dialog.open(DeleteComponent);
    dialogRef.afterClosed().subscribe(result => {
      if (result == 'Yes') {
        this.IsDisplayEvent(2);
      }
      this.resetEventForm();
    });
  }

  IsDisplayEvent(flag: any) {
    this.spinner.show();
    this.callAPIService.setHttp('get', 'Web_IsDisplayEvent?EventId=' + this.eventId + '&UserId=' + this.commonService.loggedInUserId() + '&IsDisplay=' + flag, false, false, false, 'ncpServiceForWeb');
    this.callAPIService.getHttp().subscribe((res: any) => {
      if (res.data == 0) {
        this.spinner.hide();
        this.toastrService.success(res.data1[0].Msg)
        this.getEventList();
      } else {
        this.spinner.hide();
      }
    },
      (error: any) => {
        if (error.status == 500) {
          this.router.navigate(['../500'], { relativeTo: this.route });
        }
      }
    )
  }

  editEventForm(data: any) {
    this.editEventText = "Update Event";
    let startDate = this.changeDateFormat(data.ProgramStartDate);
    let endDate = this.changeDateFormat(data.ProgramEndDate);
    this.htmlContent = data.ProgramDescription;

    this.ImgUrl = data.ImagePath;
    this.addEvent.patchValue({
      Id: data.EventId,
      ProgramTitle: data.ProgramTitle,
      ProgramDate: [startDate, endDate],
      ProgramDescription: data.ProgramDescription,
    })
  }

  changeDateFormat(date: string) {
    let dateParts = date.substring(0, 10).split("/");
    let ddMMYYYYDate = new Date(+dateParts[2], parseInt(dateParts[1]) - 1, + dateParts[0]);
    return ddMMYYYYDate;
  }

  getweekRage(dates: any) {
    this.addEvent.reset();
    this.removePhoto();
    this.defaultCloseBtn = true;
    this.fromDate = this.datepipe.transform(dates[0], 'dd/MM/YYYY');
    this.toDate = this.datepipe.transform(dates[1], 'dd/MM/YYYY');
    this.getEventList();
  }

  clearValue() {
    this.defaultCloseBtn = false;
    this.fromDate = "";
    this.toDate = "";
    this.getEventList();
    this.selRange.setValue(null);
  }

  onClickPagintion(pageNo: number) {
    this.paginationNo = pageNo;
    this.getEventList();
  }

  removePhoto() {
    this.selectedFile = "";
    this.fileInput.nativeElement.value = '';
    this.ImgUrl = "";
    this.IsChangeImage = true;
  }

  eventToggle(eventListData:any){
    eventListData?.IsDisplay == 1 ? this.IsDisplayStatus =  0 : this.IsDisplayStatus = 1;
    eventListData?.IsDisplay == 1 ? this.publishText ="unpublish": this.publishText ="publish";
  }

}
