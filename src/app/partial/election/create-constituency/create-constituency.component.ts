import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router, ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { CallAPIService } from 'src/app/services/call-api.service';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-create-constituency',
  templateUrl: './create-constituency.component.html',
  styleUrls: ['./create-constituency.component.css', '../../partial.component.css']
})
export class CreateConstituencyComponent implements OnInit {
  defaultNoMembers = 0;
  electionTypeArray:any;
  addconstituencyArray:any[] = [];
  allembers = [{ id: 0, name: "Single" }, { id: 1, name: "Multiple" }];
  subConstituencyArray = [{ id: 0, name: "Yes" }, { id: 1, name: "No" }];
  constituencyDetailsArray:any;
  createConstituencyForm!:FormGroup;
  noOfMembersDiv:boolean = false;
  subConstituencyDivHide:boolean = false;
  electionName:any;
  constituencyArray:any;

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
    this.defaultConstituencyForm();
    this.getElection();
  }

  defaultConstituencyForm() {
    this.createConstituencyForm = this.fb.group({
      Id: [0],
      ElectionId: ['', Validators.required],
      ConstituencyName: ['', Validators.required],
      Members: [0],
      NoofMembers: [],
      IsSubConstituencyApplicable: [1],
      StrSubElectionId: [''],
    })
  }

  get f() { return this.createConstituencyForm.controls };

  getElection() {
    this.spinner.show();
    this.callAPIService.setHttp('get', 'Web_GetElection?UserId='+this.commonService.loggedInUserId(), false, false, false, 'ncpServiceForWeb');
    this.callAPIService.getHttp().subscribe((res: any) => {
      if (res.data == 0) {
        this.spinner.hide();
        this.electionName = res.data1;
      } else {
        this.spinner.hide();
        this.toastrService.error("Data is not available");
      }
    }, (error: any) => {
      this.spinner.hide();
      if (error.status == 500) {
        this.router.navigate(['../500'], { relativeTo: this.route });
      }
    })
  }

  onSubmit(){
    
  }

  GetConstituencyName(ElectionId:any) {
    this.spinner.show();
    this.callAPIService.setHttp('get', 'Web_Election_Get_ConstituencyName?UserId='+this.commonService.loggedInUserId()+'&ElectionId='+ElectionId, false, false, false, 'ncpServiceForWeb');
    this.callAPIService.getHttp().subscribe((res: any) => {
      if (res.data == 0) {
        this.spinner.hide();
        this.constituencyArray = res.data1;
      } else {
        this.spinner.hide();
        this.toastrService.error("Data is not available");
      }
    }, (error: any) => {
      this.spinner.hide();
      if (error.status == 500) {
        this.router.navigate(['../500'], { relativeTo: this.route });
      }
    })
  }

  constituencyDetails(masterId: any) {//Edit api
    this.spinner.show();
    this.callAPIService.setHttp('get', 'Web_Election_Get_ConstituencyDetails?ConstituencyId=' + masterId, false, false, false, 'ncpServiceForWeb');
    this.callAPIService.getHttp().subscribe((res: any) => {
      if (res.data == 0) {
        this.spinner.hide();
        this. constituencyDetailsArray = res.data1[0];
        this.addconstituencyArray = res.data2; // same array name add and edit record
        // this.patchElectionRecord();
      } else {
        this.toastrService.error("Data is not available");
      }
    }, (error: any) => {
      if (error.status == 500) {
        this.router.navigate(['../500'], { relativeTo: this.route });
      }
    })
  }

  subConstituencyRadiobtn(subEleId: any) {
    if (subEleId == 0) {
      this.subConstituencyDivHide = true;
      }else{
        this.subConstituencyDivHide = false;
      }

  }

  selMembers(id:any){
    id == 1 ? this.noOfMembersDiv = true : this.noOfMembersDiv = false
  }
}
