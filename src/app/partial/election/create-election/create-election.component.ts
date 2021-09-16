import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { CallAPIService } from 'src/app/services/call-api.service';
import { CommonService } from 'src/app/services/common.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { DeleteComponent } from '../../dialogs/delete/delete.component';

@Component({
  selector: 'app-create-election',
  templateUrl: './create-election.component.html',
  styleUrls: ['./create-election.component.css', '../../partial.component.css']
})
export class CreateElectionComponent implements OnInit {

  createElectionForm!: FormGroup;
  submitted = false;
  boothListTypeArray = [{ id: 0, name: "Assembly Booth List" }, { id: 1, name: "User Defined Booth List" }];
  subElectionAppArray = [{ id: 0, name: "Yes" }, { id: 1, name: "No" }];
  electionTypeArray: any;
  subElectionDivHide:boolean = true;
  addSubElectionArray:any=[];
  Id:any;

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
    this.defaultProgramForm();
    this.getElectionType();
  }

  defaultProgramForm() {
    this.createElectionForm = this.fb.group({
      ElectionName: ['', Validators.required],
      ElectionTypeId: ['', Validators.required],
      IsAsemblyBoothListApplicable: [0],
      IsSubElectionApplicable: [0],
      SubElectionId: ['[{"SubElectionId":1}]', Validators.required],
    })
  }
  // [{"SubElectionId":1}]
  get f() { return this.createElectionForm.controls };

  onSubmitElection(){
    this.submitted = true;
    if (this.createElectionForm.invalid) {
      this.spinner.hide();
      return;
    }else{
      this.spinner.show();
      let formData = this.createElectionForm.value;
     let obj = 0 + '&ElectionName=' + formData.ElectionName + '&ElectionTypeId=' + formData.ElectionTypeId + '&IsSubElectionApplicable=' + formData.IsSubElectionApplicable +
      '&IsAsemblyBoothListApplicable=' + formData.IsAsemblyBoothListApplicable + '&CreatedBy=' + this.commonService.loggedInUserId() + '&StrSubElectionId=' + formData.SubElectionId;
     this.callAPIService.setHttp('get', 'Web_Insert_ElectionMaster?Id=' + obj, false, false, false, 'ncpServiceForWeb');
     this.callAPIService.getHttp().subscribe((res: any) => {
       if (res.data == 0) {
        this.toastrService.success(res.data1[0].Msg);
        //this.getProgramList();
        this.spinner.hide();
        this.clearForm();
       } else {
        //  this.toastrService.error("Data is not available");
       }
     }, (error: any) => {
       if (error.status == 500) {
         this.router.navigate(['../500'], { relativeTo: this.route });
       }
     })
    }
    console.log(this.createElectionForm.value);
  }

  clearForm() {
    this.submitted = false;
    this.defaultProgramForm();
    this.subElectionDivHide = true;
  }

  getElectionType() {
    this.spinner.show();
    this.callAPIService.setHttp('get', 'Web_GetElectionType?', false, false, false, 'ncpServiceForWeb');
    this.callAPIService.getHttp().subscribe((res: any) => {
      if (res.data == 0) {
        this.spinner.hide();
        this.electionTypeArray = res.data1;
      } else {
        this.toastrService.error("Data is not available");
      }
    }, (error: any) => {
      if (error.status == 500) {
        this.router.navigate(['../500'], { relativeTo: this.route });
      }
    })
  }

  delConfirmation(Id:any){
    this.Id = Id;
    this.deleteConfirmModel();
  }

  deleteConfirmModel() {
    const dialogRef = this.dialog.open(DeleteComponent);
    dialogRef.afterClosed().subscribe(result => {
      if(result == 'Yes'){
        this.deleteSubElection();
      }
    });
  }

  deleteSubElection(){
    this.callAPIService.setHttp('get', 'Delete_Notification_Web_1_0?NewsId='+this.Id+'&CreatedBy='+this.commonService.loggedInUserId(), false, false , false, 'ncpServiceForWeb');
    this.callAPIService.getHttp().subscribe((res: any) => {
      if (res.data == 0) {
        this.toastrService.success(res.data1[0].Msg);
        //this.getNotificationData();
      } else {
        this.spinner.hide();
      }
    } ,(error:any) => {
      this.spinner.hide();
      if (error.status == 500) {
        this.router.navigate(['../500'], { relativeTo: this.route });
      }
    })
  }

  addSubElection(){
          this.addSubElectionArray.push({'SubElectionId':this.createElectionForm.value.SubElectionId});
          console.log(this.addSubElectionArray)
  }

}
