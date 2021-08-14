import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { CallAPIService } from 'src/app/services/call-api.service';
import { CommonService } from 'src/app/services/common.service';
import { ActivatedRoute, Router } from '@angular/router';
import { debounceTime } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css', '../partial.component.css']
})
export class NotificationsComponent implements OnInit {
  subject: Subject<any> = new Subject();
  notificationForm!: FormGroup;
  submitted = false;
  allLevels: any;
  memberNameArray: any;
  filterForm!: FormGroup;
  allDistrict: any;
  viewMembersObj:any = { DistrictId: 0, Talukaid: 0, villageid: 0, SearchText:''}
  getTalkaByDistrict: any;
  resultVillageOrCity: any;
  notificationscopeArray: any;
  notificationArray: any;
  paginationNo: number = 1;
  pageSize: number = 10;
  searchFilter = "";
  defaultCloseBtn:boolean = false;
  total:any;
  imgName: any;
  ImgUrl: any;
  getImgExt: any;
  selectedFile!: File;
  NotificationText:string =  "Push";
  getImgPath:any;
  NotificationId:any;
  ScopeId:any;

  constructor(
    private callAPIService: CallAPIService, 
    private fb: FormBuilder,
    private toastrService: ToastrService,
    private commonService: CommonService,
    private spinner: NgxSpinnerService,
    private route: ActivatedRoute,
    private router: Router,
    private datePipe:DatePipe
    ) { }

  ngOnInit(): void {
    this.customForm();
    this.getLevel();
    this.getMemberName();
    this.getDistrict();
    this.defaultFilterForm();
    this.gerNotificationscope();
    this.getNotificationData();
    this.searchFilters('false');
  }

  customForm() {
    this.notificationForm = this.fb.group({
      Id:[0],
      CreatedBy:[this.commonService.loggedInUserId()],
      ScopeId: ['', Validators.required], 
      Title: ['', Validators.required],
      Description: ['', Validators.required],
      ImageUrl: [''],
      Link: [''], 
      MemberStr: [''],
    })
  }

  defaultFilterForm() {
    this.filterForm = this.fb.group({
      fromTo: [['','']],
      ScopeId: [0],
      searchText:[''],
    })
  }

  get f() { return this.notificationForm.controls };
  
  onSubmit(){
    // this.spinner.show();
    this.submitted = true;
    if (this.notificationForm.invalid) {
      this.spinner.hide();
      return;
    }
    else {

      let fromData = new FormData();

      let notStatus:any;
      let ImageChangeFlag:any;
      this.selectedFile ? ( notStatus = 2, ImageChangeFlag = 1 ): (notStatus = 1, ImageChangeFlag = 0);

      let getObj:any = this.notificationForm.value;
      fromData.append('Id', getObj.Id);
      fromData.append('CreatedBy', getObj.CreatedBy);
      fromData.append('ScopeId', getObj.ScopeId);
      fromData.append('Title', getObj.Title);
      fromData.append('Description', getObj.Description);
      fromData.append('ImageUrl', getObj.ImageUrl);
      fromData.append('Link', getObj.Link);
      fromData.append('MemberStr', getObj.MemberStr.toString());


      fromData.append('AttchmentStr', this.selectedFile);
      fromData.append('NotificationType', notStatus);
      fromData.append('IsChangeImage', notStatus);

      this.callAPIService.setHttp('post', 'InsertNotification_Web_1_0', false, fromData, false, 'ncpServiceForWeb');
      this.callAPIService.getHttp().subscribe((res: any) => {
        if (res.data == 0) {
          this.submitted = false;
          this.resetNotificationForm();
          this.spinner.hide();
          this.toastrService.success(res.data1[0].Msg)
          this.getNotificationData();
        } else {
          // this.toastrService.error(res.data1[0].Msg)
          this.spinner.hide();
        }
      } ,(error:any) => {
        this.spinner.hide();
        if (error.status == 500) {
          this.router.navigate(['../500'], { relativeTo: this.route });
        }
      })
    }
  }

  editNotification(data:any){
    this.NotificationText = "Update";
    this.getImgPath = data.AttachmentPath
    this.notificationForm.patchValue({
      AttachmentPath: data.AttachmentPath,
      Description: data.Description,
      Id: data.Id,
      Link: data.Link,
      MemberScope: data.MemberScope,
      NotificationDate: data.NotificationDate,
      NotificationType: data.NotificationType,
      ScopeId: data.ScopeId,
      ScopeName: data.ScopeName,
      SrNo: data.SrNo,
      Title: data.Title,
    })
  }

  resetNotificationForm(){
    this.notificationForm.reset();
  }

  deleteImg(){
    this.getImgPath = null;
    this.notificationForm.patchValue({
      AttachmentPath:'',
      NotificationType:1
    })
  }
  
  deleteNotifications(NewsId:any){
    this.callAPIService.setHttp('get', 'Delete_Notification_Web_1_0?NewsId='+NewsId+'&CreatedBy='+this.commonService.loggedInUserId(), false, false , false, 'ncpServiceForWeb');
    this.callAPIService.getHttp().subscribe((res: any) => {
      if (res.data == 0) {
        this.toastrService.success(res.data1[0].Msg)
        this.getNotificationData();
      } else {
        // this.toastrService.error(res.data1[0].Msg)
        this.spinner.hide();
      }
    } ,(error:any) => {
      this.spinner.hide();
      if (error.status == 500) {
        this.router.navigate(['../500'], { relativeTo: this.route });
      }
    })
  }

  pushMotificationStatus(id:any,scopeId:any){
    this.NotificationId = id;
    this.ScopeId = scopeId;
  }

  pushMotification(){
    debugger;
    this.callAPIService.setHttp('get', 'Push_SendNotification_1_0?UserId='+this.commonService.loggedInUserId()+'&NotificationId='+this.NotificationId+'&ScopeId='+this.ScopeId, false, false , false, 'ncpServiceForWeb');
    this.callAPIService.getHttp().subscribe((res: any) => {
      if (res.success == 1) {
        this.toastrService.success('Notification send successfully');
        this.getNotificationData();
      } else {
        this.toastrService.error('Something went wrong please try again');
        this.spinner.hide();
      }
    } ,(error:any) => {
      this.spinner.hide();
      if (error.status == 500) {
        this.router.navigate(['../500'], { relativeTo: this.route });
      }
    })
  }

  getLevel() {
    this.spinner.show();
    this.callAPIService.setHttp('get', 'Web_GetLevel_1_0', false, false, false, 'ncpServiceForWeb');
    this.callAPIService.getHttp().subscribe((res: any) => {
      if (res.data == 0) {
        this.spinner.hide();
        this.allLevels = res.data1;
      } else {
          this.toastrService.error("Data is not available");
      }
    } ,(error:any) => {
      if (error.status == 500) {
        this.router.navigate(['../500'], { relativeTo: this.route });
      }
    })
  }

  getMemberName() {
    this.spinner.show();    
    this.callAPIService.setHttp('get', 'GetMemberddl_Web_1_0?UserId=' + this.commonService.loggedInUserId(), false, false, false, 'ncpServiceForWeb');
    this.callAPIService.getHttp().subscribe((res: any) => {
      if (res.data == 0) {
        this.spinner.hide();
        this.memberNameArray = res.data1;
        console.log(this.memberNameArray);
      } else {
          this.toastrService.error("Data is not available");
      }
    } ,(error:any) => {
      if (error.status == 500) {
        this.router.navigate(['../500'], { relativeTo: this.route });
      }
    })
  }

  getDistrict() {
    this.spinner.show();
    this.callAPIService.setHttp('get', 'Web_GetDistrict_1_0?StateId=' + 1, false, false, false, 'ncpServiceForWeb');
    this.callAPIService.getHttp().subscribe((res: any) => {
      if (res.data == 0) {
        this.spinner.hide();
        this.allDistrict = res.data1;
      } else {
          this.toastrService.error("Data is not available 2");
      }
    } ,(error:any) => {
      if (error.status == 500) {
        this.router.navigate(['../500'], { relativeTo: this.route });
      }
    })
  }

  getTaluka(districtId: any) {
    this.viewMembersObj.DistrictId = districtId;
    this.spinner.show();
    this.callAPIService.setHttp('get', 'Web_GetTaluka_1_0?DistrictId=' + districtId, false, false, false, 'ncpServiceForWeb');
    this.callAPIService.getHttp().subscribe((res: any) => {
      if (res.data == 0) {
        this.spinner.hide();
        this.getTalkaByDistrict = res.data1;
        console.log(this.getTalkaByDistrict)
      } else {
          this.toastrService.error("Data is not available");
      }
    } ,(error:any) => {
      if (error.status == 500) {
        this.router.navigate(['../500'], { relativeTo: this.route });
      }
    })
  }

  getVillageOrCity(talukaID: any) {
    this.viewMembersObj.Talukaid = talukaID
    this.callAPIService.setHttp('get', 'Web_GetVillage_1_0?talukaid=' + talukaID, false, false, false, 'ncpServiceForWeb');
    this.callAPIService.getHttp().subscribe((res: any) => {
      if (res.data == 0) {
        this.spinner.hide();
        this.resultVillageOrCity = res.data1;

      } else {
          this.toastrService.error("Data is not available1");
      }
    } ,(error:any) => {
      if (error.status == 500) {
        this.router.navigate(['../500'], { relativeTo: this.route });
      }
    })
  } 

  gerNotificationscope() {
    this.spinner.show();
    this.callAPIService.setHttp('get', 'Web_Notificationscope', false, false, false, 'ncpServiceForWeb');
    this.callAPIService.getHttp().subscribe((res: any) => {
      if (res.data == 0) {
        this.spinner.hide();
        this.notificationscopeArray = res.data1;
        console.log(this.notificationscopeArray)
      } else {
        this.spinner.hide();
          this.toastrService.error("Data is not available");
      }
    } ,(error:any) => {
      this.spinner.hide();
      if (error.status == 500) {
        this.router.navigate(['../500'], { relativeTo: this.route });
      }
    })
  }


  clearFilter(flag:any){
    if(flag ==  'notifications'){
      this.filterForm.controls['ScopeId'].setValue(0);
    }else  if(flag ==  'search'){
      this.filterForm.controls['searchText'].setValue('');
    }else  if(flag ==  'dateRangePIcker'){
      this.defaultCloseBtn = false;
      this.filterForm.controls['fromTo'].setValue(['','']);
    }
    this.paginationNo = 1;
    this.getNotificationData();
  }

  filterData(flag:any){
    flag == 'range' ?  this.defaultCloseBtn = true :  this.defaultCloseBtn = false; 
    this.paginationNo = 1;
    this.getNotificationData();
  }

  getNotificationData(){
    let getObj:any = this.filterForm.value;
    this.spinner.show();
    let fromDate: any;
    let toDate: any;
    getObj.fromTo[0] != "" ? (fromDate = this.datePipe.transform(getObj.fromTo[0], 'dd/MM/yyyy')) : fromDate = '';
    getObj.fromTo[1] != "" ? (toDate = this.datePipe.transform(getObj.fromTo[1], 'dd/MM/yyyy')) : toDate = '';
    this.callAPIService.setHttp('get', 'GetNotification_Web_1_0?UserId='+this.commonService.loggedInUserId()+'&PageNo='+this.paginationNo+'&FromDate='+fromDate+'&ToDate='+toDate+'&ScopeId='+getObj.ScopeId+'&SearchText='+getObj.searchText, false, false, false, 'ncpServiceForWeb');
    this.callAPIService.getHttp().subscribe((res: any) => {
      if (res.data == 0) {
        this.spinner.hide();
        this.notificationArray = res.data1;
        this.total = res.data2[0].TotalCount;
        console.log(this.notificationArray)
      } else {
        this.notificationArray = [];
        this.spinner.hide();
      }
    } ,(error:any) => {
      this.notificationArray = [];
      this.spinner.hide();
      if (error.status == 500) {
        this.router.navigate(['../500'], { relativeTo: this.route });
      }
    })
  }

 
  onClickPagintion(pageNo: number) {
    this.paginationNo = pageNo;
    this.getNotificationData();
  }

  onKeyUpFilter(){
    this.subject.next();
  }

  searchFilters(flag: any) {
    if (flag == 'true') {
      if (this.filterForm.value.searchText == "" || this.filterForm.value.searchText == null) {
        this.toastrService.error("Please search and try again");
        return
      }
    }
    this.subject.pipe(debounceTime(700)).subscribe(() => {
      this.searchFilter = this.filterForm.value.searchText;
      this.paginationNo = 1;
      this.getNotificationData();
    }
    );
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

  
}
