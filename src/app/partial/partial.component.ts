import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-partial',
  templateUrl: './partial.component.html',
  styleUrls: ['./partial.component.css']
})
export class PartialComponent implements OnInit {
  isShowMenu: boolean = false;
  isAuthenticated: boolean = false;
  constructor() { }

  ngOnInit(): void {
  }

}
