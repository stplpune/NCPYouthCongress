import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
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
  districtName="Maharashtra State";
  defaultCommitteesFlag:boolean = false;
  defaultMembersFlag:boolean = false;
  globalBodyId:any;
  defaultCloseBtn:boolean = false;
  allDistrict:any;
  selectedDistrictId:any;
  selDistrict = new FormControl();

  constructor(private commonService: CommonService, private toastrService: ToastrService,
    private spinner: NgxSpinnerService, private router: Router,
    private route: ActivatedRoute,  private callAPIService: CallAPIService) { }

  ngOnInit(): void {
    this.showSvgMap(this.commonService.mapRegions());
    this.getOrganizationByDistrictId(0);
  }

  clearFilter(){
    this.districtName="Maharashtra State";
    this.showSvgMap(this.commonService.mapRegions());
    this.defaultMembersFlag = false;
    this.selectedDistrictId="";
    this.selDistrict.reset();
    this.getOrganizationByDistrictId(0);
    this.defaultCloseBtn = false;
 
  };

  ngAfterViewInit() {
    $(document).on('click', 'path', (e: any) => {
      // $('path#'+this.selectedDistrictId).css('fill', '#7289da');
      let getClickedId = e.currentTarget;
      let distrctId = $(getClickedId).attr('id');
      this.getOrganizationByDistrictId(distrctId);
    });
  }


  getOrganizationByDistrictId(id: any) {
    this.getDistrict(id)
    this.spinner.show();
    this.callAPIService.setHttp('get', 'Web_GetOrganization_byDistrictId_1_0?UserId='+this.commonService.loggedInUserId()+'&DistrictId='+id, false, false , false, 'ncpServiceForWeb');
    this.callAPIService.getHttp().subscribe((res: any) => {
      if (res.data == 0) {
        this.defaultCloseBtn = true;
         if(id == 0){
          this.defaultCloseBtn = false;
        }
        this.defaultCommitteesFlag = true;
        this.spinner.hide();
        this.resultCommittees = res.data1;
        this.selDistrict.setValue(Number(id));
      } else {
        this.defaultMembersFlag = false;
        this.defaultCommitteesFlag = true;
        this.defaultCloseBtn = true;
        this.resultCommittees = [];
        this.selDistrict.setValue('');
        this.spinner.hide();
        this.selDistrict.setValue(Number(id));
      }
   
    } ,(error:any) => {
      this.spinner.hide();
      if (error.status == 500) {
        this.router.navigate(['../500'], { relativeTo: this.route });
      }
    })
  }

  selectDistrict(event:any){
    $('path').css('fill', '#7289da');
    this.selectedDistrictId = event;
    $('path#'+this.selectedDistrictId).css('fill', 'rgb(39 40 72)');
    this.getOrganizationByDistrictId(this.selectedDistrictId);
  }

  removeDistrictFilter(){
    this.clearFilter();
  }

  getDistrict(id:any) {
    this.callAPIService.setHttp('get', 'Web_GetDistrict_1_0?StateId=' + 1, false, false, false, 'ncpServiceForWeb');
    this.callAPIService.getHttp().subscribe((res: any) => {
      if (res.data == 0) {
        this.spinner.hide();
        this.allDistrict = res.data1;
        res.data1.find((ele:any)=>{
          if(ele.DistrictId == id){
            this.districtName = ele.DistrictName;
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
    this.spinner.show();
    this.globalBodyId = bodyId;
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
    // sessionStorage.removeItem('weekRange');
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
  sessionStorage.setItem('memberId', JSON.stringify(obj));
  this.router.navigate(['../../member/profile'])
}

redirectOrgDetails(){
  let obj = { bodyId: this.globalBodyId, BodyOrgCellName: this.selCommitteeName }
  sessionStorage.setItem('bodyId', JSON.stringify(obj))
  this.router.navigate(['../committee/details'], { relativeTo: this.route })
}
}
