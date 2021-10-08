import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { CallAPIService } from 'src/app/services/call-api.service';
import { CommonService } from 'src/app/services/common.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { DeleteComponent } from '../../dialogs/delete/delete.component';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
@Component({
  selector: 'app-assign-agents-to-booths',
  templateUrl: './assign-agents-to-booths.component.html',
  styleUrls: ['./assign-agents-to-booths.component.css', '../../partial.component.css']
})
export class AssignAgentsToBoothsComponent implements OnInit {

  assAgentToBoothForm!: FormGroup;
  submitted = false;
  paginationNo: number = 1;
  pageSize: number = 10;
  total: any;
  btnText = 'Add Client';
  filterForm!: FormGroup;
  subject: Subject<any> = new Subject();
  searchFilter = "";
  HighlightRow: any;
  electionNameArray: any;
  clientNameArray: any;
  constituencyNameArray: any;
  AssemblyNameArray: any;
  BoothSubelectionArray: any;

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
    this.AgentToBoothForm();
    this.defaultFilterForm();
    this.getClientName();
    //this.searchFilters('false');
  }

  AgentToBoothForm() {
    this.assAgentToBoothForm = this.fb.group({
      Id: [0],
      Name: [''],
      FName: ['', Validators.required],
      MName: ['', Validators.required],
      LName: ['', Validators.required],
      Address: ['', Validators.required],
      Gender: ['', Validators.required],
    })
  }

  get f() { return this.assAgentToBoothForm.controls };

  defaultFilterForm() {
    this.filterForm = this.fb.group({
      ClientId: [''],
      ElectionId: [''],
      ConstituencyId: [''],
      AssemblyId: [''],
      Search: [''],
    })
  }

  getClientName(){
    this.spinner.show();
    this.callAPIService.setHttp('get', 'Web_Get_Client_ddl?UserId=' + this.commonService.loggedInUserId(), false, false, false, 'ncpServiceForWeb');
    this.callAPIService.getHttp().subscribe((res: any) => {
      if (res.data == 0) {
        this.spinner.hide();
        this.clientNameArray = res.data1;
      } else {
        this.spinner.hide();
      }
    }, (error: any) => {
      this.spinner.hide();
      if (error.status == 500) {
        this.router.navigate(['../500'], { relativeTo: this.route });
      }
    })
  }

  getElectionName() {
    this.spinner.show();
    this.callAPIService.setHttp('get', 'Web_Get_Election_byClientId_ddl?ClientId=' + this.filterForm.value.ClientId +'&UserId='+this.commonService.loggedInUserId(), false, false, false, 'ncpServiceForWeb');
    this.callAPIService.getHttp().subscribe((res: any) => {
      if (res.data == 0) {
        this.spinner.hide();
        this.electionNameArray = res.data1;
      } else {
        this.spinner.hide();
      }
    }, (error: any) => {
      this.spinner.hide();
      if (error.status == 500) {
        this.router.navigate(['../500'], { relativeTo: this.route });
      }
    })
  }  

  getConstituencyName(){
    this.spinner.show();
    this.callAPIService.setHttp('get', 'Web_Get_Constituency_byClientId_ddl?ClientId=' + this.filterForm.value.ClientId +'&UserId='+this.commonService.loggedInUserId() +'&ElectionId='+this.filterForm.value.ElectionId, false, false, false, 'ncpServiceForWeb');
    this.callAPIService.getHttp().subscribe((res: any) => {
      if (res.data == 0) {
        this.spinner.hide();
        this.constituencyNameArray = res.data1;
      } else {
        this.spinner.hide();
      }
    }, (error: any) => {
      this.spinner.hide();
      if (error.status == 500) {
        this.router.navigate(['../500'], { relativeTo: this.route });
      }
    })
  }

  getAssemblyName(){
    this.spinner.show();
    let data = this.filterForm.value;
    this.callAPIService.setHttp('get', 'Web_Get_Assembly_byClientId_ddl?ClientId=' + data.ClientId +'&UserId='+this.commonService.loggedInUserId() +'&ElectionId='+ data.ElectionId
    +'&ConstituencyId='+ data.ConstituencyId, false, false, false, 'ncpServiceForWeb');
    this.callAPIService.getHttp().subscribe((res: any) => {
      if (res.data == 0) {
        this.spinner.hide();
        this.AssemblyNameArray = res.data1;
      } else {
        this.spinner.hide();
      }
    }, (error: any) => {
      this.spinner.hide();
      if (error.status == 500) {
        this.router.navigate(['../500'], { relativeTo: this.route });
      }
    })
  }

  getIsSubElectionApplicable(){
    let eleIsSubElectionApplicable :any;
    this.electionNameArray.filter((ele:any)=>{
      if(ele.ElectionId == this.filterForm.value.ElectionId){
        eleIsSubElectionApplicable =  ele.IsSubElectionApplicable
      };
    })
   return  eleIsSubElectionApplicable;
  }

  getBoothSubelection(){
    this.spinner.show();
    let data = this.filterForm.value;
   this.callAPIService.setHttp('get', 'Web_Get_Booths_Subelection_byClientId?ClientId=' + data.ClientId +'&UserId='+this.commonService.loggedInUserId() +'&ElectionId='+ data.ElectionId
    +'&ConstituencyId='+ data.ConstituencyId +'&AssemblyId='+ data.AssemblyId +'&Search='+ '' +'&nopage='+ this.paginationNo, false, false, false, 'ncpServiceForWeb');
    this.callAPIService.getHttp().subscribe((res: any) => {
      if (res.data == 0) {
        this.spinner.hide();
        this.BoothSubelectionArray = res.data1;
        console.log("avi",this.BoothSubelectionArray);
      } else {
        this.spinner.hide();
      }
    }, (error: any) => {
      this.spinner.hide();
      if (error.status == 500) {
        this.router.navigate(['../500'], { relativeTo: this.route });
      }
    })
  }


  filterData() {
    this.paginationNo = 1;
    //this.getConstituency();
  }

  clearFilter(flag: any) {
    if (flag == 'clientName') {
      this.filterForm.controls['ElectionNameId'].setValue(0);
    } else  if (flag == 'clientName') {
      this.filterForm.controls['ElectionNameId'].setValue(0);
    } else  if (flag == 'clientName') {
      this.filterForm.controls['ElectionNameId'].setValue(0);
    } else  if (flag == 'clientName') {
      this.filterForm.controls['ElectionNameId'].setValue(0);
    }
    
    
    
    
    else if (flag == 'search') {
      this.filterForm.controls['Search'].setValue('');
    }
    this.paginationNo = 1;
   // this.getConstituency();
  }


}
