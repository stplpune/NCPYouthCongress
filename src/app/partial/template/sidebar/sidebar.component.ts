import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { CommonService } from 'src/app/services/common.service';
@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  hide:boolean =true;
  isShowMenu:boolean=false;
  logInUserType:any;
  @Input() set showMenu(value: boolean) {
    this.isShowMenu = value
  }
  
  constructor(
    private commonService:CommonService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.logInUserType =  this.commonService.loggedInUserType();
  }

}
