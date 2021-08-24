import { Component, OnInit } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
@Component({
  selector: 'app-web',
  templateUrl: './web.component.html',
  styleUrls: ['./web.component.css']
})
export class WebComponent implements OnInit {

  login: boolean = false;
  
  constructor(private router: Router) {
    // on route change to '/login', set the variable showHead to false
    if (this.router.url == '/login') {
      this.login = true;
    }
  }

  ngOnInit(): void {
  }

}
