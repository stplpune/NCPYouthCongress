import { Component, OnInit } from '@angular/core';
import { CallAPIService } from 'src/app/services/call-api.service';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from '../../services/common.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgxSpinnerService } from "ngx-spinner";
@Component({
  selector: 'app-political-work',
  templateUrl: './political-work.component.html',
  styleUrls: ['./political-work.component.css', '../partial.component.css']
})
export class PoliticalWorkComponent implements OnInit {
  politicalWorkArray: any;
  paginationNo: number = 1;
  total: any;
  pageSize: number = 10;
  viewMembersObj: any = { DistrictId: 0, Talukaid: 0, villageid: 0, SearchText: '' }
  filterForm!: FormGroup;

  constructor(
    private callAPIService: CallAPIService,
    private spinner: NgxSpinnerService,
    private toastrService: ToastrService,
    private commonService: CommonService,
    private fb: FormBuilder,
  ) { }

  ngOnInit(): void {
    this.defaultFilterForm();
    this.getPoliticalWork();
  }

  defaultFilterForm() {
    this.filterForm = this.fb.group({
      memberName: [''],
      workType: [1], //workType == categoryid
    })
  }

  getPoliticalWork() {
    // console.log(this.filterForm.value)
    this.spinner.show();
    let obj = 'categoryid=' + this.filterForm.value.workType + '&nopage=' + this.paginationNo
    this.callAPIService.setHttp('get', 'GetPoliticalWork_Web_1_0?' + obj, false, false, false, 'ncpServiceForWeb');
    this.callAPIService.getHttp().subscribe((res: any) => {
      if (res.data == 0) {
        this.spinner.hide();
        this.politicalWorkArray = res.data1;
        console.log(this.politicalWorkArray);
        this.total = res.data2[0].TotalCount;
      } else {
        if (res.data == 1) {
          this.spinner.hide();
          this.toastrService.error("Data is not available");
        } else {
          this.spinner.hide();
          this.toastrService.error("Please try again something went wrong");
        }
      }
    })
  }
  
  getPoliticalWorkById() {
    this.paginationNo = 1;
    this.getPoliticalWork()
  }

  onClickPagintion(pageNo: number) {
    this.paginationNo = pageNo;
    this.getPoliticalWork()
  }


}
