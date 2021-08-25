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
@Component({
  selector: 'app-event-master',
  templateUrl: './event-master.component.html',
  styleUrls: ['./event-master.component.css', '../../partial.component.css'],
  providers: [DatePipe]
})
export class EventMasterComponent implements OnInit {
  htmlContent = '';
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
      ['bold']
      ],
    customClasses: [
      {
        name: "quote",
        class: "quote",
      },
      {
        name: 'redText',
        class: 'redText'
      },
      {
        name: "titleText",
        class: "titleText",
        tag: "h1",
      },
    ]
  };
  addEvent!:FormGroup;
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

  maxDate: any = new Date();
  fromDate:any = "";
  toDate: any = "";
  dateRange: any;
  defaultCloseBtn: boolean = false;
  selRange = new FormControl();


  constructor(
    private fb:FormBuilder,
    private commonService:CommonService, 
    private callAPIService:CallAPIService, 
    private router:Router, 
    private route:ActivatedRoute, 
    private datePipe:DatePipe,
    private spinner: NgxSpinnerService,
    private toastrService: ToastrService,
    public dateTimeAdapter: DateTimeAdapter<any>,
    public datepipe: DatePipe,
    ) { { dateTimeAdapter.setLocale('en-IN'); } 
    this.dateRange = [this.fromDate, this.toDate];}

  ngOnInit(): void {
    this.defaultEventForm();
    this.getEventList();
  }

  defaultEventForm() {
    this.addEvent = this.fb.group({
      ProgramTitle: ['', Validators.required],
      ProgramDescription: ['', Validators.required],
      ProgramDate: ['', Validators.required],
      Id: [0],
      CreatedBy: [this.commonService.loggedInUserId()],
      IschangeImage:[1],
      EventImages:[this.selectedFile, Validators.required],
    })
  }

  onSubmit() {
    let data = this.addEvent.value;
    let fromDate:any = this.datePipe.transform(data.ProgramDate[0], 'dd/MM/yyyy');
    let toDate:any = this.datePipe.transform(data.ProgramDate[1], 'dd/MM/yyyy');

    let fromData = new FormData();
    fromData.append('ProgramTitle', data.ProgramTitle);
    fromData.append('ProgramDescription', data.ProgramDescription);
    fromData.append('ProgramStartDate', fromDate);
    fromData.append('ProgramEndDate', toDate);
    fromData.append('Id', data.Id);
    fromData.append('CreatedBy', data.CreatedBy);
    fromData.append('IschangeImage', data.IschangeImage);
    fromData.append('EventImages', this.selectedFile);

    this.callAPIService.setHttp('Post', 'Web_Insert_EventMaster', false, fromData, false, 'ncpServiceForWeb');
    this.callAPIService.getHttp().subscribe((res: any) => {
      if (res.data == 0) {

      } else {
        // this.toastrService.error("Data is not available 1");
      }
    }, (error: any) => {
      if (error.status == 500) {
        this.router.navigate(['../../500'], { relativeTo: this.route });
      }
    })
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
    + '&FromDate=' + this.fromDate + '&ToDate=' +  this.toDate, false, false, false, 'ncpServiceForWeb');
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

  IsDisplayEvent() {
    this.spinner.show();
    this.callAPIService.setHttp('get', 'Web_IsDisplayEvent?EventId=' + 0 + '&UserId=' + this.commonService.loggedInUserId()+ '&IsDisplay=' + 0, false, false, false, 'ncpServiceForWeb');
    this.callAPIService.getHttp().subscribe((res: any) => {
      if (res.data == 0) {
        this.spinner.hide();
        this.displayEventArray = res.data1;
      } else {
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


  onClickPagintion(pageNo: number) {
    this.paginationNo = pageNo;
    this.getEventList();
  }

  removePhoto() {
    this.selectedFile = "";
    this.myInput.nativeElement.value = '';
    this.ImgUrl = "";
  }

  getweekRage(dates: any) {
    this.defaultCloseBtn = true;
    this.fromDate= this.datepipe.transform(dates[0], 'dd/MM/YYYY');
    this.toDate= this.datepipe.transform(dates[1], 'dd/MM/YYYY');
    this. getEventList();
  }

  clearValue(){
    this.defaultCloseBtn = false;
    this.fromDate = "";
    this.toDate  = "";
    this.getEventList();
    this.selRange.setValue(null);
  }

}
