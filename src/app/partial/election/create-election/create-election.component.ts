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
  index:any;
  electionMasterArray: any;
  paginationNo: number = 1;
  pageSize: number = 10;
  total:any;
  electionDropArray: any;

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
    this.getElectionMaster();
    this.getsubElection();
  }

  defaultProgramForm() {
    this.createElectionForm = this.fb.group({
      ElectionName: ['', Validators.required],
      ElectionTypeId: ['', Validators.required],
      IsAsemblyBoothListApplicable: [0],
      IsSubElectionApplicable: [0],
      SubElectionId: ['', Validators.required],
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
      this.addSubElectionArray = JSON.stringify(this.addSubElectionArray);
     let obj = 0 + '&ElectionName=' + formData.ElectionName + '&ElectionTypeId=' + formData.ElectionTypeId + '&IsSubElectionApplicable=' + formData.IsSubElectionApplicable +
      '&IsAsemblyBoothListApplicable=' + formData.IsAsemblyBoothListApplicable + '&CreatedBy=' + this.commonService.loggedInUserId() + '&StrSubElectionId=' + this.addSubElectionArray;
     this.callAPIService.setHttp('get', 'Web_Insert_ElectionMaster?Id=' + obj, false, false, false, 'ncpServiceForWeb');
     this.callAPIService.getHttp().subscribe((res: any) => {
       if (res.data == 0) {
        this.addSubElectionArray = [];
        this.toastrService.success(res.data1[0].Msg);
        this.getElectionMaster();
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

    getsubElection() { // subElection Dropdown
    this.spinner.show();
    this.callAPIService.setHttp('get', 'Web_GetElection?UserId='+ this.commonService.loggedInUserId() , false, false, false, 'ncpServiceForWeb');
    this.callAPIService.getHttp().subscribe((res: any) => {
      if (res.data == 0) {
        this.spinner.hide();
        this.electionDropArray = res.data1;
      } else {
        this.toastrService.error("Data is not available");
      }
    }, (error: any) => {
      if (error.status == 500) {
        this.router.navigate(['../500'], { relativeTo: this.route });
      }
    })
  }

  getElectionMaster() {
    this.spinner.show();
    let obj = '&ElectionTypeId=' + 3 + '&UserId=' + 1 + '&Search=' + '' +
    '&nopage=' + this.paginationNo;
    this.callAPIService.setHttp('get', 'Web_GetElectionMaster?' + obj, false, false, false, 'ncpServiceForWeb');
    this.callAPIService.getHttp().subscribe((res: any) => {
      if (res.data == 0) {
        this.spinner.hide();
        this.electionMasterArray = res.data1;
        this.total = res.data2[0].TotalCount;
      } else {
        this.toastrService.error("Data is not available");
      }
    }, (error: any) => {
      if (error.status == 500) {
        this.router.navigate(['../500'], { relativeTo: this.route });
      }
    })
  }

  // getElectionType() {
  //   this.spinner.show();
  //   this.callAPIService.setHttp('get', 'Web_GetElectionType?', false, false, false, 'ncpServiceForWeb');
  //   this.callAPIService.getHttp().subscribe((res: any) => {
  //     if (res.data == 0) {
  //       this.spinner.hide();
  //       this.electionTypeArray = res.data1;
  //     } else {
  //       this.toastrService.error("Data is not available");
  //     }
  //   }, (error: any) => {
  //     if (error.status == 500) {
  //       this.router.navigate(['../500'], { relativeTo: this.route });
  //     }
  //   })
  // }

  clearForm() {
    this.submitted = false;
    this.defaultProgramForm();
    this.subElectionDivHide = true;
    this.addSubElectionArray = [];
  }

  delConfirmation(index:any){
    this.index = index;
    this.deleteConfirmModel();
  }

  deleteConfirmModel() {
    const dialogRef = this.dialog.open(DeleteComponent);
    dialogRef.afterClosed().subscribe(result => {
      if(result == 'Yes'){
       // this.deleteSubElection();
      }
    });
  }

  deleteSubElection(){
    this.callAPIService.setHttp('get', 'Delete_Notification_Web_1_0?NewsId='+this.index+'&CreatedBy='+this.commonService.loggedInUserId(), false, false , false, 'ncpServiceForWeb');
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

  onClickPagintion(pageNo: number) {
    this.paginationNo = pageNo;
    this.getElectionMaster();
  }

}
