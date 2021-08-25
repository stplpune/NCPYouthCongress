import { DatePipe } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { CallAPIService } from 'src/app/services/call-api.service';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-event-master',
  templateUrl: './event-master.component.html',
  styleUrls: ['./event-master.component.css', '../../partial.component.css']
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
  toastrService: any;
  @ViewChild('myInput') myInput!: ElementRef;

  constructor(private fb:FormBuilder, private _commonService:CommonService, private callAPIService:CallAPIService, private router:Router, 
    private route:ActivatedRoute, private datePipe:DatePipe
    ) { }

  ngOnInit(): void {
    this.defaultEventForm();
  }

  defaultEventForm() {
    this.addEvent = this.fb.group({
      ProgramTitle: ['', Validators.required],
      ProgramDescription: ['', Validators.required],
      ProgramDate: ['', Validators.required],
      Id: [0],
      CreatedBy: [this._commonService.loggedInUserId()],
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

  removePhoto() {
    this.selectedFile = "";
    this.myInput.nativeElement.value = '';
    this.ImgUrl = "";
  }

}
