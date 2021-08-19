import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { CallAPIService } from 'src/app/services/call-api.service';
import { Title, Meta } from '@angular/platform-browser';

@Component({
  selector: 'app-share',
  templateUrl: './share.component.html',
  styleUrls: ['./share.component.css']
})
export class ShareComponent implements OnInit {
  WorkId!: number;
  resultOfShareData: any;
  imagesArray: any;

  constructor(private callAPIService: CallAPIService, private spinner: NgxSpinnerService,
    private toastrService: ToastrService, private router: Router, private route: ActivatedRoute,
    private titleService: Title,
    private meta: Meta,

  ) { }

  ngOnInit(): void {
    this.WorkId = this.route.snapshot.params.id;
    this.getshareData();
  }

  getshareData() {
    this.spinner.show();
    this.callAPIService.setHttp('get', 'Web_BodyMemeber_ActivitiesDetails?WorkId=' + this.WorkId, false, false, false, 'ncpServiceForWeb');
    this.callAPIService.getHttp().subscribe((res: any) => {
      if (res.data == 0) {
        this.spinner.hide();
        this.resultOfShareData = res.data1[0];
        this.updateMetaInfo(this.resultOfShareData.ProgramTitle, 'https://ncpyouth.erpguru.in/share/' + this.WorkId, this.resultOfShareData.Images.split(',')[0]);
      } else {
        this.toastrService.error("Data is not available");
      }
    }, (error: any) => {
      if (error.status == 500) {
        this.router.navigate(['../500'], { relativeTo: this.route });
      }
    })
  }

  updateMetaInfo(content: any, author: any, category: any) {
    this.titleService.setTitle(content);    
    this.meta.updateTag({ name: 'title', content: content });
    this.meta.updateTag({ property: 'og:title', content: content });
    this.meta.updateTag({ property: 'og:url', content: author });
    this.meta.updateTag({ property: 'og:image', content: category });
  }
}
