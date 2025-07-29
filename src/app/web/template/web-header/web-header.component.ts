import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-web-header',
  templateUrl: './web-header.component.html',
  styleUrls: ['./web-header.component.css']
})
export class WebHeaderComponent implements OnInit {
  language : string | any;
  constructor(private translate: TranslateService,
    private commonService: CommonService
  ) { }

  ngOnInit(): void {
    // this.language = sessionStorage.getItem('language') || 'English' ;
    // this.changeLanguage(this.language);
  }

  changeLanguage(lang: any) {
    this.language = lang;
    this.commonService.setLanguage.next(lang);
    sessionStorage.setItem('language', lang);
    this.translate.use(lang);
  }

}
