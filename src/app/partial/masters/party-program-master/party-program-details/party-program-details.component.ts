import { Component, OnInit, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { CallAPIService } from 'src/app/services/call-api.service';
import { NgxSpinnerService } from "ngx-spinner";
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { Gallery, GalleryItem, ImageItem, ThumbnailsPosition, ImageSize } from '@ngx-gallery/core';
import { Lightbox } from '@ngx-gallery/lightbox';
import { CommonService } from 'src/app/services/common.service';
import { MatDialog } from '@angular/material/dialog';
import { ActivityDetailsComponent } from '../../../dialogs/activity-details/activity-details.component';
import { MaharashtraGeofanceService } from 'src/app/services/maharashtra-geofance.service';


@Component({
  selector: 'app-party-program-details',
  templateUrl: './party-program-details.component.html',
  styleUrls: ['./party-program-details.component.css', '../../../partial.component.css'],

})
export class PartyProgramDetailsComponent implements OnInit {
  programDetailsArray: any;
  programListId: any;
  overviewArray: any;
  programDetailsLatLongArray: any;
  programDetailsImagesArray: any;
  lat: any = 19.75117687556874;
  lng: any = 75.71630325927731;
  zoom: any = 12;
  membersDataArray: any;
  activeFlag: boolean = true;
  NonComityDataArray: any;
  membersAndNonParticipantsDiv: boolean = true;
  ParticipantsText: string = "Members";
  programTile: any;
  allImages = [];
  programGalleryImg!: GalleryItem[];
  ParpantsProMemImge!: GalleryItem[];
  ParpantsProMemImge1!: GalleryItem[];
  imgLightBox: boolean = false;
  resultBodyMemActDetails: any;
  CommitteeUserArray: any;
  committeeNmame: any;
  committeeModelDataDivHide: boolean = false;
  committeeUserdetailsArray: any;
  activitiesDetailslat: any;
  activitiesDetailslng: any;
  paginationNo: number = 1;
  comityUserListTotal: any;
  committeeId: any;
  globalGroupId = 0;
  comUserdetImg: any;
  comUserdetImg1: any;
  lightBoxGalleryFlag: boolean = true;
  MemberTableDiv: boolean = true;
  ComityTableDiv: boolean = false;
  NonComityTableDiv: boolean = false;
  MapHide: boolean = true;
  lightboxRef: any;
  lightboxRef1: any;
  commityDataArray: any;
  pageSize: number = 10;
  memPaginationNo: number = 1;
  comPaginationNo: number = 1;
  nonComPaginationNo: number = 1;
  memberTotal: any;
  comityTotal: any;
  nonComityTotal: any;
  HighlightRow: any;
  @ViewChild('CommitteesparModalOpen') CommitteesparModalOpen: any;
  hideMapInfo: boolean = false;
  previous: any;

  constructor(
    public location: Location,
    private callAPIService: CallAPIService,
    private spinner: NgxSpinnerService,
    private toastrService: ToastrService,
    private router: Router,
    private route: ActivatedRoute,
    public gallery: Gallery,
    private _lightbox: Lightbox,
    private _commonService: CommonService,
    public dialog: MatDialog,
    public MaharashtraGeofance:MaharashtraGeofanceService
  ) {
    if (sessionStorage.getItem('programListIdKey') == null || sessionStorage.getItem('programListIdKey') == "") {
      this.toastrService.error("Please select Program Title  and try again");
      this.router.navigate(['../party-program'], { relativeTo: this.route });
      return
    } else {
      let getsessionStorageData: any = sessionStorage.getItem('programListIdKey');
      let programListId = JSON.parse(getsessionStorageData);
      this.programListId = programListId.programListId;
      this.programTile = programListId.programList;
    }
  }

  ngOnInit(): void {
    this.GetProgramDetails();
    this.getMembersData();
    console.log(this.MaharashtraGeofance.MaharashtraGeofance);
  }

  GetProgramDetails() {
    this.spinner.show();
    this.callAPIService.setHttp('get', 'Web_GetProgram_Details_1_0?ProgramId=' + this.programListId, false, false, false, 'ncpServiceForWeb');
    this.callAPIService.getHttp().subscribe((res: any) => {
      if (res.data == 0) {
        this.spinner.hide();
        this.programDetailsArray = res.data1[0];
        let programDetailsImagesArray = res.data2;
        this.programGalleryImg = programDetailsImagesArray;
        this.overviewArray = res.data3[0];
        this.gallery.resetAll();
        if (this.programGalleryImg) {
          this.programGalleryImg = this._commonService.imgesDataTransform(this.programGalleryImg, 'obj');
          this.lightboxRef = this.gallery.ref()
          this.lightboxRef.load(this.programGalleryImg);
        }

      } else {
        this.spinner.hide();
        // //this.toastrService.error("Data is not available");
      }
    }, (error: any) => {
      if (error.status == 500) {
        this.router.navigate(['../../500'], { relativeTo: this.route });
      }
    })
  }

  getMembersData() {
    this.ComityTableDiv = false;
    this.NonComityTableDiv = false;
    this.MemberTableDiv = true;
    this.MapHide = true;
    // this.membersDataArray = [];
    this.spinner.show();
    this.callAPIService.setHttp('get', 'GetProgram_Details_UserList_1_0?ProgramId=' + this.programListId + '&nopage=' + this.memPaginationNo, false, false, false, 'ncpServiceForWeb');
    this.callAPIService.getHttp().subscribe((res: any) => {
      if (res.data == 0) {
        this.spinner.hide();
        this.membersDataArray = res.data1;
        this.memberTotal = res.data2[0].TotalCount;
        this.programDetailsLatLongArray = res.data3;
      } else {
        if (res.data == 1) {
          this.membersDataArray = [];
          this.spinner.hide();
          // //this.toastrService.error("Data is not available");
        } else {
          this.spinner.hide();
          this.toastrService.error("Please try again something went wrong");
        }
      }
    }, (error: any) => {
      if (error.status == 500) {
        this.router.navigate(['../../500'], { relativeTo: this.route });
      }
    })
  }

  getNonParticipantsData() {
    this.MapHide = false;
    this.NonComityTableDiv = true;
    this.MemberTableDiv = false;
    this.ComityTableDiv = false;
    this.spinner.show();
    this.callAPIService.setHttp('get', 'NonWeb_Program_Committee_List_1_0?ProgramId=' + this.programListId + '&nopage=' + this.nonComPaginationNo, false, false, false, 'ncpServiceForWeb');
    this.callAPIService.getHttp().subscribe((res: any) => {
      if (res.data == 0) {
        this.spinner.hide();
        this.NonComityDataArray = res.data1;
        this.nonComityTotal = res.data2[0].TotalCount;
      } else {
        if (res.data == 1) {
          this.spinner.hide();
          // //this.toastrService.error("Data is not available");
        } else {
          this.spinner.hide();
          this.toastrService.error("Please try again something went wrong");
        }
      }
    }, (error: any) => {
      if (error.status == 500) {
        this.router.navigate(['../../500'], { relativeTo: this.route });
      }
    })
  }

  getCommitteesData() {
    this.MapHide = true;
    this.ComityTableDiv = true;
    this.MemberTableDiv = false;
    this.NonComityTableDiv = false;
    this.programDetailsLatLongArray = [];

    this.spinner.show();
    this.callAPIService.setHttp('get', 'Web_GetProgram_Details_CommitteeList_1_0?ProgramId=' + this.programListId + '&nopage=' + this.comPaginationNo, false, false, false, 'ncpServiceForWeb');
    this.callAPIService.getHttp().subscribe((res: any) => {
      if (res.data == 0) {
        this.spinner.hide();
        this.commityDataArray = res.data1;
        this.comityTotal = res.data2[0].TotalCount;
        this.programDetailsLatLongArray = res.data3;
      } else {
        this.spinner.hide();
        this.commityDataArray = [];
        // //this.toastrService.error("Data is not available");
      }
    }, (error: any) => {
      if (error.status == 500) {
        this.router.navigate(['../../500'], { relativeTo: this.route });
      }
    })
  }

  //latest calll
  getCommitteeUserList(committeeId: any, committeeNmame: any, flag: any) {
    this.comityUserListTotal = 0;
    this.CommitteeUserArray = [];
    this.spinner.show();
    this.committeeId = committeeId;
    this.committeeNmame = committeeNmame;
    this.callAPIService.setHttp('get', 'Web_Program_Committee_UserList_1_0?ProgramId=' + this.programListId + '&nopage=' + this.paginationNo + '&BodyId=' + committeeId, false, false, false, 'ncpServiceForWeb');
    this.callAPIService.getHttp().subscribe((res: any) => {
      if (res.data == 0) {
        if (flag == 'modalShow') {
          let committeeModalOpen: any = this.CommitteesparModalOpen.nativeElement;
          committeeModalOpen.click();
        }
        this.spinner.hide();
        this.CommitteeUserArray = res.data1;
        this.comityUserListTotal = res.data2[0].TotalCount;

      } else {
        this.CommitteeUserArray = [];
        this.comityUserListTotal = [];
        this.spinner.hide();
        this.toastrService.info("Committee Member is not available");
      }
    }, (error: any) => {
      if (error.status == 500) {
        this.router.navigate(['../../../500'], { relativeTo: this.route });
      }
    })
  }

  committeeUserdetails(ActivityId: any) {
    this.spinner.show();
    this.committeeModelDataDivHide = true;
    this.callAPIService.setHttp('get', 'Web_BodyMemeber_ActivitiesDetails?WorkId=' + ActivityId, false, false, false, 'ncpServiceForWeb');
    this.callAPIService.getHttp().subscribe((res: any) => {
      if (res.data == 0) {
        this.spinner.hide();
        this.committeeUserdetailsArray = res.data1[0];
        this.committeeUserdetailsArray.globalGroupId;
        this.comUserdetImg1 = this.committeeUserdetailsArray.Images.split(',');
        // this.comUserdetImg1 = this._commonService.imgesDataTransform(this.comUserdetImg1,'array');
        // this.lightboxRef1.load(this.comUserdetImg1);

        let latLong = this.committeeUserdetailsArray.ActivityLocation.split(",");
        this.activitiesDetailslat = Number(latLong[0]);
        this.activitiesDetailslng = Number(latLong[1]);
      } else {
        this.spinner.hide();
        this.toastrService.error("Member is not available");
      }
    }, (error: any) => {
      if (error.status == 500) {
        this.router.navigate(['../../../500'], { relativeTo: this.route });
      }
    })
  }

  closeModelCommitty() {
    this.committeeModelDataDivHide = false;
  }

  redToMemberProfile(memberId: any, FullName: any) {
    let obj = { 'memberId': memberId, 'FullName': FullName }
    sessionStorage.setItem('memberId', JSON.stringify(obj));
    this.router.navigate(['../../profile'], { relativeTo: this.route })
  }

  onClickPagintion(pageNo: number, paginationFlag: any) {
    if (paginationFlag == 'memberFlag') {
      this.memPaginationNo = pageNo;
      this.getMembersData();
    } else if (paginationFlag == 'commityFlag') {
      this.comPaginationNo = pageNo;
      this.getCommitteesData();
    } else {
      this.nonComPaginationNo = pageNo;
      this.getNonParticipantsData();
    }
  }

  onClickPagintion1(pageNo: number) {
    this.paginationNo = pageNo;
    this.getCommitteeUserList(this.committeeId, this.committeeNmame, 'false');
  }

  getBodyMemeberActivitiesDetails(viewMemberId: any) {
    this.spinner.show();
    this.callAPIService.setHttp('get', 'Web_BodyMemeber_ActivitiesDetails?WorkId=' + viewMemberId, false, false, false, 'ncpServiceForWeb');
    this.callAPIService.getHttp().subscribe((res: any) => {
      if (res.data == 0) {
        this.spinner.hide();
        this.resultBodyMemActDetails = res.data1[0];
        this.HighlightRow = this.resultBodyMemActDetails.Id;
        this.openDialogBodyMemActDetails();
      } else {
        this.spinner.hide();
        this.resultBodyMemActDetails = [];
      }
    }, (error: any) => {
      if (error.status == 500) {
        this.router.navigate(['../../../500'], { relativeTo: this.route });
      }
    })
  }

  redirectOrgDetails(bodyId: any, BodyOrgCellName: any) {
    if (bodyId == "" || bodyId == null) {
      this.toastrService.error("Data not found..");
    } else {
      let obj = { bodyId: bodyId, BodyOrgCellName: BodyOrgCellName }
      sessionStorage.setItem('bodyId', JSON.stringify(obj))
      this.router.navigate(['../../committee/details'], { relativeTo: this.route })
    }
  }

  openDialogBodyMemActDetails() {
    const dialogRef = this.dialog.open(ActivityDetailsComponent, {
      width: '1024px',
      data: this.resultBodyMemActDetails
    });
  }

  clickedMarker(infowindow: any) {
    if (this.previous) {
      this.previous.close();
    }
    this.previous = infowindow;
    // this.hideMapInfo = true;
  }
}
