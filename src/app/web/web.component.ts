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
      router.events.forEach((event) => {
        if (event instanceof NavigationStart) {
          console.log(event)
          if (event['url'] == '/login') {
            alert(event['url']);
            this.login= true;
          } else {
            this.login= false;
          }
        }
      });
    }

  ngOnInit(): void {
  }

}
