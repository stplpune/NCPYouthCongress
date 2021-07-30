import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  hide:boolean =true;
  isShowMenu:boolean=false;
  @Input() set showMenu(value: boolean) {
    this.isShowMenu = value
  }
  constructor(
    private router: Router
  ) { }

  ngOnInit(): void {
  }

}
