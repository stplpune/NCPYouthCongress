import { Component, NgZone, OnInit } from '@angular/core';
import { Router, NavigationStart, NavigationEnd } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
@Component({
  selector: 'app-web',
  templateUrl: './web.component.html',
  styleUrls: ['./web.component.css']
})
export class WebComponent implements OnInit {

  login: boolean = false;

  constructor(private zone: NgZone, private router: Router, private spinner:NgxSpinnerService) {
    // on route change to '/login', set the variable showHead to false
    if (this.router.url == '/login' || this.router.url == '/help' || this.router.url == '/help-non-member'  || this.router.url.includes('mobile-login')){
      this.login = true;
    }
  }

  ngOnInit(): void {
    this.router.events.subscribe((event: any) => {
      if (event instanceof NavigationStart) {
        this.spinner.show()
        }
      if (event instanceof NavigationEnd) {
        this.spinner.hide()
        window.scroll(0,0);
        if (event.url === '/login' || event.url =='/register' || event.url =='/forgotPassword' || event.url == '/help' || event.url == '/help-non-member'  || this.router.url.includes('mobile-login')) {
          this.login= true;
         
        } else {
          this.login= false;
         
        }
      }
    });
  }

}
