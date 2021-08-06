import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
 isShowMenu:boolean=false;
  @Output() onShowMenu: EventEmitter<any> = new EventEmitter();

  constructor(private router:Router, private route:ActivatedRoute) { }

  ngOnInit(): void {
  }

  showMenu(){
    this.isShowMenu = !this.isShowMenu;
    this.onShowMenu.emit(this.isShowMenu);
    
  }

  logOut(){
    localStorage.clear();
    this.router.navigate(['/login'], {relativeTo:this.route})
  }

 

}
