import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AngularEditorConfig } from '@kolkov/angular-editor';
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

  constructor(private fb:FormBuilder, private _commonService:CommonService) { }

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
    })
  }

  onSubmit(){
    let data = this.addEvent.value
    data.ProgramDate = this._commonService.dateTransformPipe(data.ProgramDate)
    console.log(data);
  }
}
