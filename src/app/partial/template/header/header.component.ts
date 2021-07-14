import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
 isShowMenu:boolean=false;
  @Output() onShowMenu: EventEmitter<any> = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
  }

  showMenu(){
    this.isShowMenu = !this.isShowMenu;
    this.onShowMenu.emit(this.isShowMenu);
    
  }

}
