import { Component, OnInit } from '@angular/core';
import { CommonService } from 'src/app/services/common.service';
declare var $: any

@Component({
  selector: 'app-committees-on-map',
  templateUrl: './committees-on-map.component.html',
  styleUrls: ['./committees-on-map.component.css', '../../partial.component.css']
})

export class CommitteesOnMapComponent implements OnInit {
  graphInstance:any;

  constructor(private commonService:CommonService) { }

  ngOnInit(): void {
  } 

  ngAfterViewInit() {
    this.showSvgMap(this.commonService.mapRegions());

    $('path').click(()=>{ 
      alert('ok');
      console.log($(this).attr('id'))
    })
}

ngOnDestroy() {
  // localStorage.removeItem('weekRange');
  this.graphInstance.destroy();
}


showSvgMap(regions_m:any) {
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



}
