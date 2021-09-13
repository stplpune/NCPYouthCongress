import { Component, NgZone, OnInit } from '@angular/core';
import { Router, NavigationStart, NavigationEnd } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-partial',
  templateUrl: './partial.component.html',
  styleUrls: ['./partial.component.css']
})
export class PartialComponent implements OnInit {
  isShowMenu: boolean = false;
  isAuthenticated: boolean = false;
  constructor(private zone: NgZone, private router: Router, private spinner:NgxSpinnerService) { }

  ngOnInit(): void {
    this.router.events.subscribe((event: any) => {
      if (event instanceof NavigationStart) {
        this.spinner.show()
        }
      if (event instanceof NavigationEnd) {
        this.spinner.hide()
        window.scroll(0,0);

      }
    });
  }

}
