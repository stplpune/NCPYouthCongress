import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router, ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { CallAPIService } from 'src/app/services/call-api.service';
import { CommonService } from 'src/app/services/common.service';
import { AddMemberComponent } from '../add-member/add-member.component';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-add-designation',
  templateUrl: './add-designation.component.html',
  styleUrls: ['./add-designation.component.css']
})
export class AddDesignationComponent implements OnInit {
  addDesFormSubmitted = false;
  AddDesignationForm!: FormGroup;
  editRadioBtnClick: any;
  IsMultiple = [{ id: 1, name: "Yes" }, { id: 0, name: "No" }];
  resultDesignation:any;
  selEditOrganization:any;
  addDesignation = "Assign";
  modalDeafult = false;
  allAssignedDesignations:any;
  allBodyAssignedDesignation:any;
  desBodyId:any;
  submitted = false;
  heightedRow:any;
  committeeName:any;

  constructor(private callAPIService: CallAPIService, private router: Router, private fb: FormBuilder,
    private toastrService: ToastrService, private commonService: CommonService, public dialog: MatDialog,
    private spinner: NgxSpinnerService, private route: ActivatedRoute, public dialogRef: MatDialogRef<AddMemberComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
      this.desBodyId = this.data.committeeId;
      this.committeeName = this.data.committeeName;
    }

  ngOnInit(): void {
    this.defaultDesignationForm();
    this.getDesignation();
    this.getBodyAssignedDesignation();
    this.AlreadyAssignedDesignations(this.desBodyId);
  }


  
  getDesignation() {
    //this.spinner.show();
    this.callAPIService.setHttp('get', 'Web_Getdesignationmaster_1_0', false, false, false, 'ncpServiceForWeb');
    this.callAPIService.getHttp().subscribe((res: any) => {
      if (res.data == 0) {
        this.spinner.hide();
        this.resultDesignation = res.data1;
      } else {
        // //this.toastrService.error("Data is not available");
      }
    }, (error: any) => {
      if (error.status == 500) {
        this.router.navigate(['../../500'], { relativeTo: this.route });
      }
    })
  }

  get d() { return this.AddDesignationForm.controls };

  clearAddDesignationForm() {
    this.addDesFormSubmitted = false;
    this.AddDesignationForm.patchValue({
      IsMultiple: '',
      DesignationId: '',
    });
  }

  submitDesignationForm() {
    //this.spinner.show();
    this.addDesFormSubmitted = true;
    if (this.AddDesignationForm.invalid) {
      this.spinner.hide();
      return;
    }
    else {
      let fromData: any = new FormData();
      this.AddDesignationForm.value['BodyId'] = this.desBodyId;
      Object.keys(this.AddDesignationForm.value).forEach((cr: any, ind: any) => {
        fromData.append(cr, Object.values(this.AddDesignationForm.value)[ind])
      })
      this.callAPIService.setHttp('Post', 'Web_Insert_postmaster_1_0', false, fromData, false, 'ncpServiceForWeb');
      this.callAPIService.getHttp().subscribe((res: any) => {
        if (res.data == 0) {
          this.addDesignation = 'Add';
          this.submitted = false;
          this.clearAddDesignationForm();
          this.spinner.hide();
          this.toastrService.success(res.data1[0].Msg);
          // this.closeModalAddDes();
          this.getBodyAssignedDesignation();
          this.AlreadyAssignedDesignations(this.desBodyId);
          this.spinner.hide();
        } else {
          this.toastrService.error("Members is not available");
        }
      }, (error: any) => {
        if (error.status == 500) {
          this.router.navigate(['../../500'], { relativeTo: this.route });
        }
      })
    }
  }

  editDesignationForm(data: any) {
    this.heightedRow = data.SrNo;
    this.addDesignation = 'Edit';
    this.AddDesignationForm.patchValue({
      Id: data.Id,
      BodyId: this.AddDesignationForm.value.BodyId,
      DesignationId: data.DesignationId,
      IsMultiple: data.IsMultiple,
      CreatedBy: this.commonService.loggedInUserId(),
    })
    this.editRadioBtnClick = data.IsMultiple;
  }

  defaultDesignationForm() {
    this.AddDesignationForm = this.fb.group({
      Id: [0],
      BodyId: [this.committeeName],
      DesignationId: ['', Validators.required],
      IsMultiple: ['', Validators.required],
      CreatedBy: [this.commonService.loggedInUserId()],
    })
  }

  AddDesignation(BodyOrgCellName: any, bodyId: any) {
    this.desBodyId = bodyId;
    this.getBodyAssignedDesignation();
    this.AlreadyAssignedDesignations(this.desBodyId)
    this.AddDesignationForm.patchValue({
      BodyId: BodyOrgCellName
    })
  }

  AlreadyAssignedDesignations(desBodyId: any) {
    //this.spinner.show();
    this.modalDeafult = true
    this.callAPIService.setHttp('get', 'Web_GetAssignedDesignation_1_0?BodyId=' + desBodyId, false, false, false, 'ncpServiceForWeb');
    this.callAPIService.getHttp().subscribe((res: any) => {
      if (res.data == 0) {
        this.spinner.hide();
        this.allAssignedDesignations = res.data1;
      } else {
        // this.toastrService.error("Designations is  not available");
        this.allAssignedDesignations = [];
      }
    }, (error: any) => {
      if (error.status == 500) {
        this.router.navigate(['../../500'], { relativeTo: this.route });
      }
    })
  }

  
  getBodyAssignedDesignation() {
    this.callAPIService.setHttp('get', 'Web_GetAssigned_Post_1_0?BodyId=' + this.desBodyId, false, false, false, 'ncpServiceForWeb');
    this.callAPIService.getHttp().subscribe((res: any) => {
      if (res.data == 0) {
        this.spinner.hide();
        this.allBodyAssignedDesignation = res.data1;
      } else {
        this.spinner.hide();
        // this.toastrService.error("Designations is  not available");
        this.allBodyAssignedDesignation = [];
      }
    }, (error: any) => {
      this.spinner.hide();
      if (error.status == 500) {
        this.router.navigate(['../../500'], { relativeTo: this.route });
      }
    })
  }

  swingDesignation(event: CdkDragDrop<string[]>) {
    console.log(event);
    moveItemInArray(this.allBodyAssignedDesignation, event.previousIndex, event.currentIndex);
    let stringDesignation: any = 'oldChangeId=' + this.allBodyAssignedDesignation[event.previousIndex].Id + '&oldChangesSortNo=' + this.allBodyAssignedDesignation[event.previousIndex].SrNo
      + '&NewChangeId=' + this.allBodyAssignedDesignation[event.currentIndex].Id + '&NewChangesSortNo=' + this.allBodyAssignedDesignation[event.currentIndex].SrNo + '&Createdby=' + this.commonService.loggedInUserId();

    this.callAPIService.setHttp('get', 'Web_SetDesignationSort?' + stringDesignation, false, false, false, 'ncpServiceForWeb');
    this.callAPIService.getHttp().subscribe((res: any) => {
      if (res.data == 0) {
        this.spinner.hide();
        this.toastrService.success(res.data1[0].Msg);
        this.getBodyAssignedDesignation();
        this.AlreadyAssignedDesignations(this.desBodyId);
      } else {
        this.spinner.hide();
        // this.toastrService.error("Designations is  not available");
        this.allBodyAssignedDesignation = [];
      }
    }, (error: any) => {
      this.spinner.hide();
      if (error.status == 500) {
        this.router.navigate(['../../500'], { relativeTo: this.route });
      }
    })
  }


  addEditMember(flag:any,id:any) {
    // this.highlightedRow = id
    this.onNoClick('Yes')
    let obj = {"formStatus":flag, 'Id':id}
    const dialogRef = this.dialog.open(AddMemberComponent, {
      width: '1024px',
      data: obj
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result == 'Yes') {
        // let obj = { DistrictId: 0, Talukaid: 0, villageid: 0, SearchText: '' }
        // this.getViewMembers(obj);
      }
    });
  }

  onNoClick(text:any): void {
    this.dialogRef.close(text);
  }
}
