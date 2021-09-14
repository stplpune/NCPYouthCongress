import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { CallAPIService } from 'src/app/services/call-api.service';
import { CommonService } from 'src/app/services/common.service';
declare var $: any

@Component({
  selector: 'app-committees-on-map',
  templateUrl: './committees-on-map.component.html',
  styleUrls: ['./committees-on-map.component.css', '../../partial.component.css']
})

export class CommitteesOnMapComponent implements OnInit {
  graphInstance: any;
  resultCommittees:any;
  resultOrganizationMember:any;
  activeRow:any;
  selCommitteeName:any;
  districtName:any;
  defaultCommitteesFlag:boolean = false;
  defaultMembersFlag:boolean = false;

  constructor(private commonService: CommonService, private toastrService: ToastrService,
    private spinner: NgxSpinnerService, private router: Router,
    private route: ActivatedRoute,  private callAPIService: CallAPIService) { }

  ngOnInit(): void {
    this.showSvgMap(this.commonService.mapRegions());
  }

  ngAfterViewInit() {
    $(document).on('click', 'path', (e: any) => {
      let getClickedId = e.currentTarget;
      var DistrictId = $(getClickedId).attr('id');
      this.getOrganizationByDistrictId(DistrictId);
    });
  }

  getOrganizationByDistrictId(id: any) {
    this.getDistrict(id)
    this.spinner.show();
    this.callAPIService.setHttp('get', 'Web_GetOrganization_byDistrictId_1_0?UserId='+this.commonService.loggedInUserId()+'&DistrictId='+id, false, false , false, 'ncpServiceForWeb');
    this.callAPIService.getHttp().subscribe((res: any) => {
      if (res.data == 0) {
        this.defaultCommitteesFlag = true;
        this.spinner.hide();
        this.resultCommittees = res.data1;
     
      } else {
        this.defaultCommitteesFlag = true;
        this.resultCommittees = [];
        this.spinner.hide();
      }
   
    } ,(error:any) => {
      this.spinner.hide();
      if (error.status == 500) {
        this.router.navigate(['../500'], { relativeTo: this.route });
      }
    })
  }

  getDistrict(id:any) {
    this.callAPIService.setHttp('get', 'Web_GetDistrict_1_0?StateId=' + 1, false, false, false, 'ncpServiceForWeb');
    this.callAPIService.getHttp().subscribe((res: any) => {
      if (res.data == 0) {
        this.spinner.hide();
        res.data1.find((ele:any)=>{
          if(ele.DistrictId == id){
            this.districtName = ele.DistrictName
          }
        })
      } else {
        // this.toastrService.error("Data is not available 2");
      }
    }, (error: any) => {
      if (error.status == 500) {
        this.router.navigate(['../../500'], { relativeTo: this.route });
      }
    })
  }


  committeeNameByOrganizationMember(bodyId:any, committeeName:any){
    debugger;
    this.spinner.show();
    this.activeRow = bodyId
    this.callAPIService.setHttp('get', 'Web_GetOrganizationMember_byBodyId_1_0?UserId='+this.commonService.loggedInUserId()+'&BodyId='+bodyId, false, false , false, 'ncpServiceForWeb');
    this.callAPIService.getHttp().subscribe((res: any) => {
      if (res.data == 0) {
        this.defaultMembersFlag = true;
        this.spinner.hide();
        this.selCommitteeName = committeeName;
        this.resultOrganizationMember = res.data1;
      } else {
        this.defaultMembersFlag = true;
        this.resultOrganizationMember = [];
        this.selCommitteeName ="";
        this.spinner.hide();
      }
    } ,(error:any) => {
      this.spinner.hide();
      if (error.status == 500) {
        this.router.navigate(['../500'], { relativeTo: this.route });
      }
    })

  }
  ngOnDestroy() {
    // localStorage.removeItem('weekRange');
    this.graphInstance.destroy();
  }


  showSvgMap(regions_m: any) {
    if (this.graphInstance) {
      this.graphInstance.destroy();
    }
    this.graphInstance = $("#mapsvg").mapSvg({
      width: 550,
      height: 430,
      colors: {
        baseDefault: "#bfddff",
        background: "#fff",
        selected: "#272848",
        hover: "#272848",
        directory: "#bfddff",
        status: {}
      },
      regions: regions_m,
      viewBox: [0, 0, 763.614, 599.92],
      cursor: "pointer",
      zoom: {
        on: false,
        limit: [0, 50],
        delta: 2,
        buttons: {
          on: true,
          location: "left"
        },
        mousewheel: true
      },
      tooltips: {
        mode: "title",
        off: true,
        priority: "local",
        position: "bottom"
      },
      popovers: {
        mode: "on",
        on: false,
        priority: "local",
        position: "top",
        centerOn: false,
        width: 300,
        maxWidth: 50,
        maxHeight: 50,
        resetViewboxOnClose: false,
        mobileFullscreen: false
      },
      gauge: {
        on: false,
        labels: {
          low: "low",
          high: "high"
        },
        colors: {
          lowRGB: {
            r: 211,
            g: 227,
            b: 245,
            a: 1
          },
          highRGB: {
            r: 67,
            g: 109,
            b: 154,
            a: 1
          },
          low: "#d3e3f5",
          high: "#436d9a",
          diffRGB: {
            r: -144,
            g: -118,
            b: -91,
            a: 0
          }
        },
        min: 0,
        max: false
      },
      source: "assets/images/maharashtra_districts_texts.svg",
      // source: "assets/images/divisionwise.svg",
      title: "Maharashtra-bg_o",
      responsive: true
    });
    // });
  }

  
redToMemberProfile(memberId:any,FullName:any){
  let obj = {'memberId':memberId, 'FullName':FullName}
  localStorage.setItem('memberId', JSON.stringify(obj));
  this.router.navigate(['../../member/profile'])
}

}
