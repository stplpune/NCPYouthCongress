import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { CallAPIService } from 'src/app/services/call-api.service';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-create-election',
  templateUrl: './create-election.component.html',
  styleUrls: ['./create-election.component.css', '../../partial.component.css']
})
export class CreateElectionComponent implements OnInit {

  createElection!: FormGroup;
  submitted = false;
  boothListTypeArray = [{ id: 1, name: "Assembly Booth List" }, { id: 2, name: "User Defined Booth List" }];
  subElectionAppArray = [{ id: 1, name: "Yes" }, { id: 2, name: "No" }];

  constructor(
    private spinner: NgxSpinnerService,
    private callAPIService: CallAPIService,
    private toastrService: ToastrService,
    private fb: FormBuilder,
    private commonService: CommonService,
  ) { }

  ngOnInit(): void {
    this.defaultProgramForm();
  }

  defaultProgramForm() {
    this.createElection = this.fb.group({
      ElectionName: ['', Validators.required],
      ElectionTypeId: ['', Validators.required],
      IsAsemblyBoothListApplicable: [1],
      IsSubElectionApplicable: [1],
      SubElectionId: ['', Validators.required],
    })
  }

  get f() { return this.createElection.controls };

  onSubmitElectionForm(){
    this.submitted = true;
    console.log(this.createElection.value)
  }

  clearForm() {
    this.submitted = false;
    this.defaultProgramForm();
  }

}
