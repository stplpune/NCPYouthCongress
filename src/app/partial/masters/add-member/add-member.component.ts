import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { CallAPIService } from 'src/app/services/call-api.service';
import { CommonService } from 'src/app/services/common.service';
import { debounceTime } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-add-member',
  templateUrl: './add-member.component.html',
  styleUrls: ['./add-member.component.css', '../../partial.component.css']
})
export class AddMemberComponent implements OnInit {
  editProfileForm!: FormGroup;
  categoryArray = [{ id: 1, name: "Rural" }, { id: 0, name: "Urban" }];
  GenderArray = [{ id: 1, name: "Male" }, { id: 2, name: "Female" }, { id: 3, name: "Other" }];
  selGender: any;
  getImgExt: any;
  imgName: any;
  ImgUrl: any;
  isShowMenu: boolean = false;
  @Output() onShowMenu: EventEmitter<any> = new EventEmitter();
  editFlag: boolean = true;
  userName = this.commonService.loggedInUserName();
  submitted = false;
  resultVillageOrCity: any;
  allDistrict: any;
  getTalkaByDistrict: any;
  profilePhotoChange: any;
  @ViewChild('myInput') myInputVariable!: ElementRef;
  selectedFile: any;
  resProfileData: any;
  showingUserName: any;
  showingMobileNo: any;
  villageCityLabel: any;
  setVillOrCityId: any;
  setVillOrcityName: any;
  globalVillageOrCityId: any;
  disabledEditForm: boolean = true;
  defaultModalHIde: boolean = false;
  defaultModalHIdeCP: boolean = false;
  changePasswordForm: any;
  submittedChangePassword = false;
  show_button: Boolean = false;
  show_eye: Boolean = false;
  show_button1: Boolean = false;
  show_eye1: Boolean = false;
  show_button2: Boolean = false;
  show_eye2: Boolean = false;
  villOrcityDisabled: boolean = false;
  @ViewChild('fileInput') fileInput!: ElementRef;
  villageDisabled!: boolean;
  filterForm!: FormGroup;
  paginationNo: number = 1;
  pageSize: number = 10;
  defaultCloseBtn: boolean = false;
  resAllUsers: any;
  total: any;
  subject: Subject<any> = new Subject();
  searchFilter = "";

  constructor(private router: Router,
    private route: ActivatedRoute,
    private callAPIService: CallAPIService,
    private spinner: NgxSpinnerService,
    private toastrService: ToastrService,
    private commonService: CommonService,
    private fb: FormBuilder,
  ) { }

  ngOnInit(): void {
    this.defaultFilterForm();
    this.getAllUsers();
    this.getDistrictByFilter();
    this.searchFilters('false');
  }
  
  getDistrictByFilter() {
    this.spinner.show();
    this.callAPIService.setHttp('get', 'Web_GetDistrict_1_0?StateId=' + 1, false, false, false, 'ncpServiceForWeb');
    this.callAPIService.getHttp().subscribe((res: any) => {
      if (res.data == 0) {
        this.spinner.hide();
        this.allDistrict = res.data1;
      } else {
        this.spinner.hide();
        if (res.data == 1) {
          this.toastrService.error("Data is not available 2");
        } else {
          this.toastrService.error("Please try again something went wrong");
        }
      }
    })
  }

  getTalukaByFilter() {
    debugger;
    this.callAPIService.setHttp('get', 'Web_GetTaluka_1_0?DistrictId=' + this.filterForm.value.f_DistrictId, false, false, false, 'ncpServiceForWeb');
    this.callAPIService.getHttp().subscribe((res: any) => {
      if (res.data == 0) {
        this.spinner.hide();
        this.getTalkaByDistrict = res.data1;
      } else {
        this.spinner.hide();
        if (res.data == 1) {
          this.toastrService.error("Data is not available");
        } else {
          this.toastrService.error("Please try again something went wrong");
        }
      }
    })
  }

  defaultFilterForm() {
    this.filterForm = this.fb.group({
      f_DistrictId: [0],
      f_TalukaId: [0],
      f_search: [''],
    })
  }

  getAllUsers() {
    this.spinner.show();
    let formData = this.filterForm.value;
    let obj: any = 'DistrictId=' + formData.f_DistrictId + '&UserId=' + this.commonService.loggedInUserId() + '&Search=' + formData.f_search + '&nopage=' + this.paginationNo + '&TalukaId=' + formData.f_TalukaId;
    this.callAPIService.setHttp('get', 'Web_get_User?' + obj, false, false, false, 'ncpServiceForWeb');
    this.callAPIService.getHttp().subscribe((res: any) => {
      if (res.data == 0) {
        this.spinner.hide();
        this.resAllUsers = res.data1;
        this.total = res.data2[0].TotalCount;
      } else {
        this.spinner.hide();
        if (res.data == 1) {
          this.resAllUsers = [];
        } else {
          this.toastrService.error("Please try again something went wrong");
        }
      }
    })
  }

  onClickPagintion(pageNo: number) {
    this.paginationNo = pageNo;
    this.getAllUsers();
  }

  filterData() {
    this.paginationNo = 1;
    this.getAllUsers();
  }

  onKeyUpFilter() {
    this.subject.next();
  }

  searchFilters(flag: any) {
    if (flag == 'true') {
      if (this.filterForm.value.f_search == "" || this.filterForm.value.f_search == null) {
        this.toastrService.error("Please search and try again");
        return
      }
    }
    this.subject
      .pipe(debounceTime(700))
      .subscribe(() => {
        this.searchFilter = this.filterForm.value.f_search;
        this.paginationNo = 1;
        this.getAllUsers();
      }
      );
  }

  clearFilter(flag: any) {
    if (flag == 'f_DistrictId') {
      this.filterForm.controls['f_DistrictId'].setValue(0);
      this.defaultFilterForm();
    } else if (flag == 'f_TalukaId') {
      this.filterForm.controls['f_TalukaId'].setValue(0);
    } else if (flag == 'f_search') {
      this.filterForm.controls['f_search'].setValue('');
    }
    this.paginationNo = 1;
    this.getAllUsers();
  }
}
