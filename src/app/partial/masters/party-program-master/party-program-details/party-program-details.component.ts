import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { CallAPIService } from 'src/app/services/call-api.service';
import { NgxSpinnerService } from "ngx-spinner";
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { Gallery, GalleryItem, ImageItem, ThumbnailsPosition, ImageSize } from '@ngx-gallery/core';
import { Lightbox } from '@ngx-gallery/lightbox';
import { CommonService } from 'src/app/services/common.service';



@Component({
  selector: 'app-party-program-details',
  templateUrl: './party-program-details.component.html',
  styleUrls: ['./party-program-details.component.css', '../../../partial.component.css']
})
export class PartyProgramDetailsComponent implements OnInit {
  programDetailsArray: any;
  programListId: any;
  overviewArray: any;
  programDetailsLatLongArray: any;
  programDetailsImagesArray: any;
  lat: any = 19.75117687556874;
  lng: any = 75.71630325927731;
  zoom: any = 5;
  membersDataNonParticipantsArray: any;
  defaultPartiNonParti: boolean = true;
  activeFlag: boolean = true;
  total: any;
  paginationNo: number = 1;
  pageSize: number = 10;
  committeesDataArray: any;
  committeeTableDiv: boolean = false;
  membersAndNonParticipantsDiv: boolean = true;
  ParticipantsText: string = "Members";
  total1: any;
  paginationNo1: number = 1;
  programTile: any;
  allImages = [];    
  programGalleryImg!: GalleryItem[]; 
  ParpantsProMemImge!: GalleryItem[]; 
  ParpantsProMemImge1!: GalleryItem[];
  imgLightBox:boolean = false;
  resultBodyMemActDetails: any;
  CommitteeUserArray: any;
  ViewModelHide:boolean=true;
  committeeNmame: any;
  committeeModelDataDivHide:boolean=false;
  committeeUserdetailsArray: any;
  activitiesDetailslat: any;
  activitiesDetailslng: any;
  paginationNo2: number =1;
  total2: any;
  committeeId: any;
  globalGroupId = 0;
  comUserdetImg:any;

  constructor(
    public location: Location,
    private callAPIService: CallAPIService,
    private spinner: NgxSpinnerService,
    private toastrService: ToastrService,
    private router: Router,
    private route: ActivatedRoute,
    public gallery: Gallery,
    private _lightbox: Lightbox,
    private _commonService:CommonService
  ) {
    if(localStorage.getItem('programListIdKey') == null ||  localStorage.getItem('programListIdKey') == ""){
      this.toastrService.error("Please select Program Title  and try again");
      this.router.navigate(['../party-program'], { relativeTo: this.route });
      return
    }else{
      let getLocalStorageData: any = localStorage.getItem('programListIdKey');
      let programListId = JSON.parse(getLocalStorageData);
      this.programListId = programListId.programListId;
      this.programTile = programListId.programList;
    }
  }

  ngOnInit(): void {
    this.GetProgramDetails();
    this.getMembersData();
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
        this.programGalleryImg =   this._commonService.imgesDataTransform(this.programGalleryImg,'obj');
        this.gallery.ref().load(this.programGalleryImg);

      } else {
          // this.toastrService.error("Data is not available");
      }
    } ,(error:any) => {
      if (error.status == 500) {
        this.router.navigate(['../../500'], { relativeTo: this.route });
      }
    })
  }

  getMembersData() {
    this.ViewModelHide=true;
    this.membersDataNonParticipantsArray = [];
    this.membersAndNonParticipantsDiv = true;
    this.committeeTableDiv = false;
    this.spinner.show();
    this.callAPIService.setHttp('get', 'GetProgram_Details_UserList_1_0?ProgramId=' + this.programListId + '&nopage=' + this.paginationNo, false, false, false, 'ncpServiceForWeb');
    this.callAPIService.getHttp().subscribe((res: any) => {
      if (res.data == 0) {
        this.spinner.hide();
        this.membersDataNonParticipantsArray = res.data1;
        this.total = res.data2[0].TotalCount;
        let data = res.data3;
        // this.ParpantsProMemImge = res.data1;
        // this.programGalleryImg = data.map((item:any) => new ImageItem({ src: item.ImagePath, thumb: item.ImagePath }));
        //  this.basicLightboxExample();
      } else {
        if (res.data == 1) {
          this.spinner.hide();
          // this.toastrService.error("Data is not available");
        } else {
          this.spinner.hide();
          this.toastrService.error("Please try again something went wrong");
        }
      }
    } ,(error:any) => {
      if (error.status == 500) {
        this.router.navigate(['../../500'], { relativeTo: this.route });
      }
    })
  }

   getNonParticipantsData() {
    this.ViewModelHide=false;
    this.committeeTableDiv = false;
    this.membersDataNonParticipantsArray = [];
    this.membersAndNonParticipantsDiv = true;
    this.spinner.show();
    this.callAPIService.setHttp('get', 'Web_NonProgram_Committee_UserList_1_0?ProgramId=' + this.programListId + '&nopage=' + this.paginationNo, false, false, false, 'ncpServiceForWeb');
    this.callAPIService.getHttp().subscribe((res: any) => {
      if (res.data == 0) {
        this.spinner.hide();
        console.log(res);
        this.membersDataNonParticipantsArray = res.data1;
        this.total = res.data2[0].TotalCount;
        this.defaultPartiNonParti = false;
      } else {
        if (res.data == 1) {
          this.spinner.hide();
          // this.toastrService.error("Data is not available");
        } else {
          this.spinner.hide();
          this.toastrService.error("Please try again something went wrong");
        }
      }
    } ,(error:any) => {
      if (error.status == 500) {
        this.router.navigate(['../../500'], { relativeTo: this.route });
      }
    })
  }

  getCommitteesData() {
    this.ViewModelHide = true;
    this.membersAndNonParticipantsDiv = false;
    this.committeeTableDiv = true;
    this.spinner.show();
    this.callAPIService.setHttp('get', 'Web_GetProgram_Details_CommitteeList_1_0?ProgramId=' + this.programListId + '&nopage=' + this.paginationNo1, false, false, false, 'ncpServiceForWeb');
    this.callAPIService.getHttp().subscribe((res: any) => {
      if (res.data == 0) {
        this.spinner.hide();
        this.committeesDataArray = res.data1;
        this.total = res.data2[0].TotalCount;
        this.programDetailsLatLongArray = res.data3;
      } else {
          // this.toastrService.error("Data is not available");
      }
    } ,(error:any) => {
      if (error.status == 500) {
        this.router.navigate(['../../500'], { relativeTo: this.route });
      }
    })
  }

  //latest calll
  getCommitteeUserList(committeeId:any,committeeNmame:any) {
    this.spinner.show();
    this.committeeId=committeeId;
    this.committeeNmame=committeeNmame;
    this.callAPIService.setHttp('get', 'Web_Program_Committee_UserList_1_0?ProgramId=' + this.programListId + '&nopage=' + this.paginationNo2 + '&BodyId=' + committeeId, false, false, false, 'ncpServiceForWeb');
    this.callAPIService.getHttp().subscribe((res: any) => {
      if (res.data == 0) {
        this.spinner.hide();
        this.CommitteeUserArray = res.data1;
        this.total2 = res.data2[0].TotalCount;

      } else {
        this.toastrService.error("Member is not available");
      }
    }, (error: any) => {
      if (error.status == 500) {
        this.router.navigate(['../../../500'], { relativeTo: this.route });
      }
    })
  }

  committeeUserdetails(ActivityId:any){
    this.spinner.show();
    this.committeeModelDataDivHide=true;
    this.callAPIService.setHttp('get', 'Web_BodyMemeber_ActivitiesDetails?WorkId=' + ActivityId, false, false, false, 'ncpServiceForWeb');
    this.callAPIService.getHttp().subscribe((res: any) => {
      if (res.data == 0) {
        this.spinner.hide();
        this.committeeUserdetailsArray = res.data1[0];
        this.committeeUserdetailsArray.globalGroupId;
        this.comUserdetImg = this.committeeUserdetailsArray.Images.split(',');
        this.comUserdetImg = this._commonService.imgesDataTransform(this.comUserdetImg,'array');
        this.gallery.ref().load(this.comUserdetImg);

        console.log(this.comUserdetImg);
        let latLong = this.committeeUserdetailsArray.ActivityLocation.split(",");
        this.activitiesDetailslat = Number(latLong[0]);
        this.activitiesDetailslng = Number(latLong[1]);
      } else {
        this.toastrService.error("Member is not available");
      }
    }, (error: any) => {
      if (error.status == 500) {
        this.router.navigate(['../../../500'], { relativeTo: this.route });
      }
    })
  }

  closeModelCommitty(){
    this.committeeModelDataDivHide=false;
  }

  redToMemberProfile(memberId: any,FullName:any){
    let obj = {'memberId':memberId, 'FullName':FullName}
    localStorage.setItem('memberId', JSON.stringify(obj));
    this.router.navigate(['../../../member/profile'], {relativeTo:this.route})
  }

  onClickPagintion(pageNo: number, defaultPartiNonParti: any) {
    if (defaultPartiNonParti) {
      this.paginationNo = pageNo;
      this.getMembersData();
    } else {
      this.paginationNo = pageNo;
      this.getNonParticipantsData();
    }
  }

  onClickPagintion1(pageNo: number) {
    this.paginationNo1 = pageNo;
    this.getCommitteesData();
  }

  onClickPagintion2(pageNo: number){
    this.paginationNo2 = pageNo;
    this.getCommitteeUserList(this.committeeId,this.committeeNmame);
  }

  ngOnDestroy() {
    // this.router.url != '/member/profile' ? localStorage.removeItem('programListIdKey') : '';
  }


  getPartyProgramDetails(viewMemberId:any){
    this.getBodyMemeberActivitiesDetails(viewMemberId);
  }

    getBodyMemeberActivitiesDetails(viewMemberId: any) {//aa
    this.spinner.show();
    this.callAPIService.setHttp('get', 'Web_BodyMemeber_ActivitiesDetails?WorkId=' + viewMemberId, false, false, false, 'ncpServiceForWeb');
    this.callAPIService.getHttp().subscribe((res: any) => {
      if (res.data == 0) {
        this.spinner.hide();
        this.resultBodyMemActDetails = res.data1[0];
        this.gallery.ref().load(this.comUserdetImg);
        this.comUserdetImg=[];
        this.comUserdetImg = this.resultBodyMemActDetails.Images.split(',');
        this.comUserdetImg = this._commonService.imgesDataTransform(this.comUserdetImg,'array');
        this.gallery.ref().load(this.comUserdetImg);

        let latLong = this.resultBodyMemActDetails.ActivityLocation.split(",");
        this.lat = Number(latLong[0]);
        this.lng = Number(latLong[1]);
      } else {
        this.resultBodyMemActDetails = [];
      }
    }, (error: any) => {
      if (error.status == 500) {
        this.router.navigate(['../../../500'], { relativeTo: this.route });
      }
    })
  }

  redirectOrgDetails(bodyId: any,  BodyOrgCellName:any) {
    if(bodyId == "" || bodyId == null){
      this.toastrService.error("Data not found..");
    }else{
      let obj = {bodyId:bodyId, BodyOrgCellName:BodyOrgCellName}
      localStorage.setItem('bodyId', JSON.stringify(obj))
      this.router.navigate(['../../../master/committee/details'], { relativeTo: this.route })
    }
  }
  
}
