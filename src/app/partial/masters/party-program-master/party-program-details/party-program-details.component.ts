import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { CallAPIService } from 'src/app/services/call-api.service';
import { NgxSpinnerService } from "ngx-spinner";
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { Gallery, GalleryItem, ImageItem, ThumbnailsPosition, ImageSize } from '@ngx-gallery/core';
import { Lightbox } from '@ngx-gallery/lightbox';



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
  pageSize1: number = 10;
  programTile: any;
  allImages = [];    
  programGalleryImg!: GalleryItem[]; 
  ParpantsProMemImge!: GalleryItem[]; 
  ParpantsProMemImge1!: GalleryItem[];
  imgLightBox:boolean = false;
  resultBodyMemActDetails: any;
  // membersData: any;

  constructor(
    public location: Location,
    private callAPIService: CallAPIService,
    private spinner: NgxSpinnerService,
    private toastrService: ToastrService,
    private router: Router,
    private route: ActivatedRoute,
    public gallery: Gallery,
    private _lightbox: Lightbox
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
        // this.programDetailsLatLongArray = res.data3;
        this.overviewArray = res.data3[0];
        // this.programGalleryImg1 = programDetailsImagesArray.slice(0, 6);

        this.programGalleryImg = this.programGalleryImg.map((item:any) =>
          new ImageItem({ src: item.ImagePath, thumb: item.ImagePath })
        );
        this.basicLightboxExample('global');
        // this.withCustomGalleryConfig();
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
        this.programDetailsLatLongArray = res.data3;
        //console.log("11111",this.programDetailsLatLongArray)
        // this.ParpantsProMemImge = res.data1;
        // this.ParpantsProMemImge = this.ParpantsProMemImge.map((item:any) => new ImageItem({ src: item.ImagePath, thumb: item.ImagePath }));
        // console.log(this.ParpantsProMemImge);
        //  this.basicLightboxExample('members');
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
    this.committeeTableDiv = false;
    this.membersDataNonParticipantsArray = [];
    this.membersAndNonParticipantsDiv = true;
    this.spinner.show();
    this.callAPIService.setHttp('get', 'Web_GetProgram_Details_NonPartipateList_1_0?ProgramId=' + this.programListId + '&nopage=' + this.paginationNo, false, false, false, 'ncpServiceForWeb');
    this.callAPIService.getHttp().subscribe((res: any) => {
      if (res.data == 0) {
        this.spinner.hide();
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
    this.membersAndNonParticipantsDiv = false;
    this.committeeTableDiv = true;
    this.spinner.show();
    this.callAPIService.setHttp('get', 'Web_GetProgram_Details_CommitteeList_1_0?ProgramId=' + this.programListId + '&nopage=' + this.paginationNo1, false, false, false, 'ncpServiceForWeb');
    this.callAPIService.getHttp().subscribe((res: any) => {
      if (res.data == 0) {
        this.spinner.hide();
        this.committeesDataArray = res.data1;
        this.total = res.data2[0].TotalCount;
      } else {
          // this.toastrService.error("Data is not available");
      }
    } ,(error:any) => {
      if (error.status == 500) {
        this.router.navigate(['../../500'], { relativeTo: this.route });
      }
    })
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

  ngOnDestroy() {
    // this.router.url != '/member/profile' ? localStorage.removeItem('programListIdKey') : '';
  }

  redToMemberProfile(memberId: any,FullName:any){
    let obj = {'memberId':memberId, 'FullName':FullName}
    localStorage.setItem('memberId', JSON.stringify(obj));
    this.router.navigate(['../../member/profile'], {relativeTo:this.route})
  }

  // getPartyProgramDetails(membersData:any){
  //   this.membersData=membersData;
  //   this.showLightBox(membersData.MemberId);
  // }

  getPartyProgramDetails(viewMemberId:any){
    // this.membersData=membersData;
    this.getBodyMemeberActivitiesDetails(viewMemberId);
  }

    getBodyMemeberActivitiesDetails(viewMemberId: any) {
    this.spinner.show();
    this.callAPIService.setHttp('get', 'Web_BodyMemeber_ActivitiesDetails?WorkId=' + viewMemberId, false, false, false, 'ncpServiceForWeb');
    this.callAPIService.getHttp().subscribe((res: any) => {
      if (res.data == 0) {
        this.spinner.hide();
        this.resultBodyMemActDetails = res.data1[0];
         console.log("asd",this.resultBodyMemActDetails)
        let latLong = this.resultBodyMemActDetails.ActivityLocation.split(",");
        this.lat = Number(latLong[0]);
        this.lng = Number(latLong[1]);
      } else {
        this.resultBodyMemActDetails = [];
        // this.toastrService.error("Member is not available");
      }
    }, (error: any) => {
      if (error.status == 500) {
        this.router.navigate(['../../../500'], { relativeTo: this.route });
      }
    })
  }



  showLightBox(MemberId:any){
    let index:any = 1;
    this.spinner.show();
    this.callAPIService.setHttp('get', 'Web_GetProgram_Details_ProgromPhoto?ProgramId=' + this.programListId + '&MemberId=' + MemberId+ '&BodyId=0', false, false, false, 'ncpServiceForWeb');
    this.callAPIService.getHttp().subscribe((res: any) => {
      // console.log(res);
      if (res.data == 0) {
        this.spinner.hide();
        this.ParpantsProMemImge = res.data1;
        console.log(this.ParpantsProMemImge);
        // let getImages :any = this.ParpantsProMemImge.map((item:any,i:any) =>{
        //   new ImageItem({src:item[i].ImagePath, thumb:item[i].ImagePath})
        // });
        // console.log(getImages);
        // this.ParpantsProMemImge1 = getImages;
    
        this.basicLightboxExample('members');
        this.withCustomGalleryConfig();
      } else {
          // this.toastrService.error("Data is not available");
      }
    } ,(error:any) => {
      if (error.status == 500) {
        this.router.navigate(['../../500'], { relativeTo: this.route });
      }
    })
  }

  basicLightboxExample(flag:any) {
    if(flag == 'global'){
      this.gallery.ref().load(this.programGalleryImg);
    }else if (flag == 'members'){
      this.gallery.ref().load(this.ParpantsProMemImge1);
    }
  }

  withCustomGalleryConfig() {
    const lightboxGalleryRef = this.gallery.ref('anotherLightbox');
    lightboxGalleryRef.setConfig({
      imageSize: ImageSize.Cover,
      thumbPosition: ThumbnailsPosition.Top
    });

    lightboxGalleryRef.load(this.ParpantsProMemImge1);
  }
}
