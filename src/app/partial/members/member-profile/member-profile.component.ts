import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
@Component({
  selector: 'app-member-profile',
  templateUrl: './member-profile.component.html',
  styleUrls: ['./member-profile.component.css', '../../partial.component.css']
})
export class MemberProfileComponent implements OnInit {

  constructor(
    public location:Location,
    
  ) { }

  ngOnInit(): void {
  }

}
